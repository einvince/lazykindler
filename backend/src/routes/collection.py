#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from flask import request
from ..service import collection
from ..service import cover
from ..database.database import db


def create_collection():
    content = request.json

    name = content['name']
    coll_type = content['coll_type']
    description = content['description']
    tags = content['tag']
    star = content['star'] if 'star' in content else 0
    cover = content['cover']

    collection.create_collection(
        name, coll_type, description, tags, star, cover)
    return "success"


def get_all_collections():
    coll_type = request.args.get('coll_type')
    return collection.get_all_collections(coll_type)


def get_multiple_collections():
    uuids = request.args.get('uuids')
    return collection.get_multiple_collections(uuids.split(';'))


def delete_coll_without_items():
    uuid = request.args.get('uuid')
    return collection.delete_colls_without_items(uuid)


def delete_coll_with_items():
    uuid = request.args.get('uuid')
    return collection.delete_colls_with_items(uuid)


def delete_all_colls_hard():
    return collection.delete_all_colls_hard()


def add_book_to_collection():
    content = request.json
    coll_uuid = content['coll_uuid']
    book_uuids = content['book_uuids']
    return collection.add_book_to_collection(coll_uuid, book_uuids)


def update_coll():
    content = request.json
    uuid = content['uuid']
    key = content['key']
    value = content['value']
    return collection.update_collection(uuid, key, value)


def update_coll_cover():
    content = request.json
    coll_uuid = content['coll_uuid']
    cover_str = content['cover']
    return cover.upsert_cover(coll_uuid, cover_str)


def get_coll_books():
    coll_uuid = request.args.get('coll_uuid')
    return collection.get_coll_books(coll_uuid)
