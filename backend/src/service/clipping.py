#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from os import path
import time
import numpy as np
import datetime
import hashlib
from flask import jsonify

from ..service.collection import update_coll
from ..util.util import difference, generate_uuid
from ..database.database import db

clipping_path = u'/Volumes/Kindle/documents/My Clippings.txt'


# clipping_path = u'/Users/wupeng/Downloads/My Clippings.txt'


class ClippingHelper(object):
    def __init__(self):
        pass

    def import_clippings(self):
        exists = path.exists(clipping_path)
        if not exists:
            return

        file = open(clipping_path, 'r')
        lines = file.readlines()

        allLines = []
        for line in lines:
            line = line.strip()
            allLines.append(line)

        arr = np.array(allLines)
        clippings = np.array_split(arr, len(allLines) / 5)

        for clip in clippings:
            self.handle_single_clipping(clip[0], clip[1], clip[3])

    def handle_single_clipping(self, title, time_info, clip_content):
        book_name = self.extract_book_name(title)
        author = self.extract_author(title)
        timestamp = self.extract_time(time_info)

        str_md5 = hashlib.md5(clip_content.encode('utf-8')).hexdigest()

        clips = db.query(
            "select uuid from clipping where md5='{}';".format(str_md5))
        if clips is not None and len(clips) > 0:
            return

        clip_content = clip_content.replace(' ', '\n')

        db.insert_clipping(generate_uuid(), book_name, author,
                           clip_content, timestamp, str_md5)

    def extract_book_name(self, title):
        index = title.find('(')
        if title.find('（') >= 0:
            index = title.find('（')
        book_name = title[:index].strip()
        return book_name

    def extract_author(self, title):
        return title[title.rfind("(") + 1:title.rfind(")")]

    def extract_time(self, time_info):
        index = time_info.find(',')
        str = time_info[index + 1:].strip()
        return time.mktime(datetime.datetime.strptime(str, '%d %B %Y %H:%M:%S').timetuple())


def get_all_clippings():
    data = db.query("select * from clipping where deleted is null;")
    data.sort(key=lambda x: x['addDate'], reverse=True)
    for i, e in enumerate(data):
        if e["highlights"] is not None:
            data[i]["highlights"] = e["highlights"].split("___")
    return jsonify(data)


def get_clipping_by_uuids(uuids):
    result = []
    for uuid in uuids:
        clipping_list = db.query(
            "select * from clipping where uuid='{}'".format(uuid))
        result = result + clipping_list

    for i, e in enumerate(result):
        if e["highlights"] is not None:
            result[i]["highlights"] = e["highlights"].split("___")
    return jsonify(result)


def delete_clipping(uuid):
    db.run_sql("update clipping set deleted=1 where uuid='{}'".format(uuid))
    db.run_sql(
        "delete from comment where related_uuid='{}'".format('uuid'))

    colls = db.query(
        "select uuid, item_uuids from coll where item_uuids like '%{}%'".format(uuid))
    for coll in colls:
        item_uuids = coll['item_uuids'].split(';')
        item_uuids.remove(uuid)
        if item_uuids is None or len(item_uuids) == 0:
            db.run_sql_with_params(
                "update coll set item_uuids=? where uuid=?", (None, coll['uuid']))
        else:
            update_coll(';'.join(item_uuids),
                        coll['uuid'])
    return "success"


def update_clipping(uuid, key, value):
    value = value.strip()

    if key == "coll_uuids":
        clipping = db.query(
            "select coll_uuids from clipping where uuid='{}';".format(uuid))[0]
        old_coll_uuids = []
        if clipping["coll_uuids"] is not None:
            old_coll_uuids = clipping["coll_uuids"].split(";")

        new_coll_uuids = []
        if value is not None:
            new_coll_uuids = value.split(";")
            if "" in new_coll_uuids:
                new_coll_uuids.remove("")

        # 处理删掉的集合，从集合中删掉摘抄
        for coll_uuid in difference(old_coll_uuids, new_coll_uuids):
            coll_info = db.query(
                "select item_uuids from coll where uuid='{}';".format(coll_uuid))[0]
            coll_item_uuids = []
            if coll_info["item_uuids"] is not None:
                l = coll_info["item_uuids"].split(";")
                l.remove(uuid)
                if l is not None and len(l) > 0:
                    coll_item_uuids = l
            if len(coll_item_uuids) == 0:
                db.run_sql_with_params(
                    "update coll set item_uuids=? where uuid=?", (None, coll_uuid))
            else:
                db.run_sql("update coll set item_uuids='{}' where uuid='{}'".format(
                    ";".join(coll_item_uuids), coll_uuid))

        # 处理新增摘抄的集合
        for coll_uuid in difference(new_coll_uuids, old_coll_uuids):
            coll_info = db.query(
                "select item_uuids from coll where uuid='{}';".format(coll_uuid))[0]
            coll_item_uuids = []
            if coll_info["item_uuids"] is not None:
                l = coll_info["item_uuids"].split(";")
                l.append(uuid)
                coll_item_uuids = l
            else:
                coll_item_uuids.append(uuid)
            db.run_sql("update coll set item_uuids='{}' where uuid='{}'".format(
                ";".join(coll_item_uuids), coll_uuid))

    if key == 'author':
        clipping = db.query(
            "select author from clipping where uuid='{}'".format(uuid))[0]
        db.run_sql("update clipping set author='{}' where author='{}'".format(
            value, clipping['author']))
    else:
        if value is None or value == "":
            db.run_sql_with_params(
                "update clipping set {}=? where uuid=?".format(key), (None, uuid))
            return "success"
        else:
            db.run_sql("update clipping set {}='{}' where uuid='{}'".format(
                key, value, uuid))
    return "success"


def update_by_keyword(keyword, new_value, old_value):
    new_value = new_value.strip()
    old_value = old_value.strip()

    if new_value == "无标签":
        new_value = None
    if new_value == "无作者":
        new_value = None

    if old_value == "无标签":
        old_value = None
    if old_value == "无作者":
        old_value = None

    if keyword == "评分":
        db.run_sql(
            "update clipping set stars={} where stars={}".format(new_value, old_value))
    elif keyword == "标签":
        if old_value == None:
            db.run_sql(
                "update clipping set subjects='{}' where subjects is null;".format(new_value))
        else:
            db.run_sql(
                "update clipping set subjects='{}' where subjects='{}';".format(new_value, old_value))
    elif keyword == "作者":
        if old_value == None:
            db.run_sql(
                "update clipping set author='{}' where author is null;".format(new_value))
        else:
            db.run_sql(
                "update clipping set author='{}' where author='{}';".format(new_value, old_value))
    elif keyword == "书名":
        if old_value == None:
            db.run_sql(
                "update clipping set book_name='{}' where book_name is null;".format(new_value))
        else:
            db.run_sql(
                "update clipping set book_name='{}' where book_name='{}';".format(new_value, old_value))
    return "success"


def delete_all_clipping():
    colls = db.query(
        "select uuid from coll where coll_type='clipping'")
    for coll in colls:
        db.run_sql("delete from cover where uuid='{}'".format(coll['uuid']))

    db.run_sql("delete from coll where coll_type='clipping'")

    all_clippings = db.query(
        "select uuid from clipping")
    for clip in all_clippings:
        db.run_sql(
            "delete from comment where related_uuid='{}'".format(clip['uuid']))
    db.run_sql("delete from clipping")

    db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'collping'")

    covers = db.query("select uuid from cover")
    if covers is None or len(covers) == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'cover'")

    colls = db.query("select uuid from coll")
    if colls is None or len(colls) == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'coll'")
    return "success"


# 给clipping添加高亮
def add_highlight_to_clipping(clipping_uuid, highlight):
    if highlight.strip() == "":
        return "success"

    clipping = db.query(
        "select uuid, highlights from clipping where uuid='{}'".format(clipping_uuid))[0]
    highlight_arr = []
    if clipping["highlights"] is not None:
        highlight_arr = clipping["highlights"].split("___")

    if highlight in highlight_arr:
        return "success"

    highlight_arr.append(highlight)
    db.run_sql("update clipping set highlights='{}' where uuid='{}'".format(
        "___".join(highlight_arr), clipping_uuid))
    return "success"


# 从clipping删除高亮
def delete_highlight_from_clipping(clipping_uuid, highlight):
    clipping = db.query(
        "select uuid, highlights from clipping where uuid='{}'".format(clipping_uuid))[0]
    if clipping["highlights"] is None:
        return "success"

    highlight_arr = clipping["highlights"].split("___")

    updated_highlight_arr = highlight_arr.copy()
    for item in highlight_arr:
        if item in highlight:
            updated_highlight_arr.remove(item)

    if len(updated_highlight_arr) == 0:
        db.run_sql_with_params(
            "update clipping set highlights=? where uuid=?", (None, clipping_uuid))
    else:
        db.run_sql("update clipping set highlights='{}' where uuid='{}'".format(
            "___".join(updated_highlight_arr), clipping_uuid))
    return "success"
