#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from os import path
import time
import numpy as np
import datetime
import hashlib
from flask import jsonify

from ..helper import clipping, collection, common, book_clipping

from ..util.util import convert_str_to_list, difference, generate_uuid
from ..database.database import db

clipping_path = u'/Volumes/Kindle/documents/My Clippings.txt'


# clipping_path = u'/Users/wupeng/Downloads/My Clippings.txt'


class ClippingHelper(object):

    def import_clippings(self):
        exists = path.exists(clipping_path)
        if not exists:
            return
        lines = [line.strip() for line in open(clipping_path, 'r').readlines()]
        arr = np.array(lines)
        clippings = np.array_split(arr, len(lines) / 5)

        for clip in clippings:
            self.handle_single_clipping(clip[0], clip[1], clip[3])

    def handle_single_clipping(self, title, time_info, clip_content):
        book_name = self.extract_book_name(title)
        author = self.extract_author(title)
        timestamp = self.extract_time(time_info)

        md5_str = hashlib.md5(clip_content.encode('utf-8')).hexdigest()

        clips = clipping.get_clipping_by_md5(md5_str)
        if clips is not None and len(clips) > 0:
            return

        clip_content = clip_content.replace(' ', '\n')

        db.insert_clipping(generate_uuid(), book_name, author,
                           clip_content, timestamp, md5_str)

    def extract_book_name(self, title):
        index = title.find('(')
        if title.find('（') >= 0:
            index = title.find('（')
        return title[:index].strip()

    def extract_author(self, title):
        return title[title.rfind("(") + 1:title.rfind(")")]

    def extract_time(self, time_info):
        index = time_info.find(',')
        time_str = time_info[index + 1:].strip()
        return time.mktime(datetime.datetime.strptime(time_str, '%d %B %Y %H:%M:%S').timetuple())


def get_all_clippings():
    data = clipping.get_all_clippings()

    result = []
    for item in data:
        item["highlights"] = convert_str_to_list(item["highlights"])
        result.append(item)
    result.sort(key=lambda x: x['addDate'], reverse=True)
    return jsonify(result)


def get_clipping_by_uuids(uuids):
    data = []
    for uuid in uuids:
        item = clipping.get_clipping_by_uuid(uuid)
        if item is not None:
            data.append(item)
    data.sort(key=lambda x: x['addDate'], reverse=True)
    return jsonify(data)


def delete_clipping(uuid):
    clipping.delete_clipping(uuid)
    return "success"


def update_clipping(uuid, key, value):
    value = value.strip()

    if key == "coll_uuids":
        update_clipping_colls(uuid, value)
    else:
        db.run_sql(f"update clipping set {key}='{value}' where uuid='{uuid}'")
    return "success"


def update_clipping_colls(uuid, value):
    value = value.removesuffix(';')

    clipping_info = clipping.get_clipping_by_uuid(uuid)
    old_coll_uuids = convert_str_to_list(clipping_info["coll_uuids"])
    new_coll_uuids = convert_str_to_list(value)

    # 处理取消关联的集合
    for coll_uuid in difference(old_coll_uuids, new_coll_uuids):
        collection.remove_item_uuid_from_coll(coll_uuid, uuid)

    # 处理新增关联的集合
    for coll_uuid in difference(new_coll_uuids, old_coll_uuids):
        collection.add_item_uuid_to_coll(coll_uuid, uuid)


def update_by_keyword(keyword, new_value, old_value):
    new_value = new_value.strip()

    if keyword == "评分":
        clipping.update_clipping_star(old_value, new_value)
    elif keyword == "标签":
        clipping.update_clipping_tag(old_value, new_value)
    elif keyword == "作者":
        clipping.update_clipping_author(old_value, new_value)
    elif keyword == "书名":
        clipping.update_clipping_book_name(old_value, new_value)
    return "success"


def delete_all_clipping():
    all_clippings = clipping.get_all_clippings_for_delete()
    for item in all_clippings:
        coll_uuids = convert_str_to_list(item["coll_uuids"])
        for coll_uuid in coll_uuids:
            collection.remove_item_uuid_from_coll(coll_uuid, item["uuid"])
        clipping.delete_clipping_hard(item['uuid'])
    common.clean_sqlite_sequence()
    return "success"


# 给clipping添加高亮
def add_highlight_to_clipping(clipping_uuid, highlight):
    if highlight.strip() == "":
        return "success"
    data = clipping.get_clipping_by_uuid(clipping_uuid)
    if highlight in data['highlights']:
        return "success"
    data['highlights'].append(highlight)
    clipping.update_clipping_highlights(data)
    return "success"


# 从clipping删除高亮
def delete_highlight_from_clipping(clipping_uuid, highlight):
    data = clipping.get_clipping_by_uuid(clipping_uuid)
    data["highlights"].remove(data)
    clipping.update_clipping_highlights(data)
    return "success"

# 支持手动创建笔记


def create_clipping(book_name, author, content):
    str_md5 = hashlib.md5(content.encode('utf-8')).hexdigest()
    db.insert_clipping(generate_uuid(), book_name, author,
                       content, time.time(), str_md5)
    return "success"


def get_clippings_count_by_book_name(book_name):
    res = clipping.get_clippings_by_book_name(book_name)
    return str(0) if res is None or len(res) == 0 else str(len(res))


def get_clippings_by_book_meta_uuid(book_meta_uuid):
    relation = book_clipping.get_relation_by_book_meta_uuid(book_meta_uuid)
    if relation is None or len(relation) == 0:
        return jsonify([])
    res = clipping.get_clippings_by_book_name(
        relation[0]["clipping_book_name"])
    return jsonify([]) if res is None or len(res) == 0 else jsonify(res)
