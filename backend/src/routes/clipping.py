#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from flask import request
from ..service import clipping


def get_all_clippings():
    return clipping.get_all_clippings()


def get_clipping_by_uuids():
    uuids_str = request.args.get('uuids')
    return clipping.get_clipping_by_uuids(uuids_str.split(";"))


def delete_clipping():
    uuid = request.args.get('uuid')
    return clipping.delete_clipping(uuid)


def update_clipping():
    content = request.json
    uuid = content['uuid']
    key = content['key']
    value = content['value']
    return clipping.update_clipping(uuid, key, value)


def update_by_keyword():
    keyword = request.args.get('keyword')
    new_value = request.args.get('new_value')
    old_value = request.args.get('old_value')
    return clipping.update_by_keyword(keyword, new_value, old_value)


def delete_all_clipping():
    return clipping.delete_all_clipping()


def add_highlight_to_clipping():
    content = request.json
    uuid = content['uuid']
    highlight = content['highlight']
    return clipping.add_highlight_to_clipping(uuid, highlight)


def delete_highlight_from_clipping():
    content = request.json
    uuid = content['uuid']
    highlight = content['highlight']
    return clipping.delete_highlight_from_clipping(uuid, highlight)


def create_clipping():
    content = request.json
    book_name = content['book_name']
    author = content['author']
    clip_content = content['clip_content']
    return clipping.create_clipping(book_name, author, clip_content)


def get_clippings_count_by_book_name():
    content = request.json
    book_name = content['book_name']
    return clipping.get_clippings_count_by_book_name(book_name)


def get_clippings_by_book_name():
    content = request.json
    book_name = content['book_name']
    return clipping.get_clippings_by_book_name(book_name)


def get_clippings_by_book_meta_uuid():
    book_meta_uuid = request.args.get('book_meta_uuid')
    return clipping.get_clippings_by_book_meta_uuid(book_meta_uuid)
