#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import itertools
from distutils.command.clean import clean
import os
from pathlib import Path
import hashlib
import re
import json
from flask import jsonify, send_file

from ..util.util import compare_strings_with_similarity, ls_moon_reader_clippings, generate_uuid
from ..database.database import db
from ..helper import book_clipping, books, clipping


similarity = 0.8


def clean_book_name(raw_book_name):
    """
    清洗书名
    """
    # 匹配所有包含在括号中的子字符串，包括英文和中文括号
    pattern = re.compile(r'[(（【].*?[)）】]')
    return re.sub(pattern, '', raw_book_name)


def maintain_relation():
    all_book_meta = books.get_all_books()
    all_clippings = clipping.get_all_clippings()

    all_clipping_book_names = {item["book_name"] for item in all_clippings}
    # 处理新增的关联
    for book_meta, clipping_book_name in itertools.product(all_book_meta, all_clipping_book_names):
        cleaned_book_name = clean_book_name(book_meta["name"])
        cleaned_clipping_book_name = clean_book_name(clipping_book_name)
        if not compare_strings_with_similarity(similarity, cleaned_book_name, cleaned_clipping_book_name):
            continue
        relations = book_clipping.get_relation_by_relation(
            book_meta["uuid"], clipping_book_name)
        if relations is not None and len(relations) > 0:
            continue
        db.insert_book_relation(
            book_meta["uuid"],
            clipping_book_name,
            0,
        )

    # 删除失效关联
    all_relations = book_clipping.get_all_relation()
    for relation in all_relations:
        if not clipping.check_if_there_is_book_clipping(relation["clipping_book_name"]):
            book_clipping.delete_relation_by_book_name(
                relation["clipping_book_name"])


def get_all_book_clipping():
    return jsonify(book_clipping.get_all_relation())


def update_relation(book_meta_uuid, clipping_book_name, action):
    if action == "save":
        book_clipping.update_relation(book_meta_uuid, clipping_book_name, 1)
    elif action == "delete":
        book_clipping.update_relation(book_meta_uuid, clipping_book_name, 2)
    return "success"
