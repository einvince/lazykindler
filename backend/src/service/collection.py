#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from multiprocessing.spawn import old_main_modules
from flask import jsonify

from ..database.database import db
from ..util.util import convert_str_to_list, generate_uuid, difference

from ..helper import books, clipping, collection, common


def create_collection(name, coll_type, description, tags, star, cover):
    uuid = generate_uuid()

    colls = db.query(
        f"select name from coll where name='{name}' and coll_type='{coll_type}'"
    )
    if len(colls) > 0:
        # 不允许创建多个具有相同名称和集合类型的coll
        return

    db.insert_coll(uuid, name, coll_type, description, tags, star, cover)


def update_coll(item_uuids, coll_uuid):
    db.run_sql(
        f"update coll set item_uuids='{item_uuids}' where uuid='{coll_uuid}'"
    )


def get_all_collections(coll_type):
    data = collection.get_colls_by_type(coll_type)
    if data is None:
        return jsonify([])
    data.sort(key=lambda x: x['star'], reverse=True)
    return jsonify(data)


def get_multiple_collections(uuids):
    data = [collection.get_coll(uuid) for uuid in uuids]
    return jsonify(data)


def delete_clipping(uuid):
    clipping.delete_clipping(uuid)

    colls = db.query(
        f"select uuid, item_uuids from coll where item_uuids like '%{uuid}%'"
    )
    for coll in colls:
        collection.remove_item_uuid_from_coll(coll['uuid'], uuid)
    return "success"


def delete_colls_without_items(coll_uuid):
    coll = collection.get_coll(coll_uuid)
    item_uuids = coll["item_uuids"].split(";")

    for item_uuid in item_uuids:
        collection.remove_item_uuid_from_coll(coll_uuid, item_uuid)

    common.delete_cover(coll_uuid)

    db.run_sql(f"delete from coll where uuid='{coll_uuid}';")
    return "success"


def delete_all_colls_hard():
    colls = collection.get_all_coll()
    for coll in colls:
        delete_colls_with_items(coll["uuid"])
        common.delete_cover(coll["uuid"])
        db.run_sql(f"delete from coll where uuid='{coll['uuid']}';")
    return "success"


def delete_colls_with_items(coll_uuid):
    common.delete_cover(coll_uuid)

    coll = collection.get_coll(coll_uuid)

    item_uuids = coll["item_uuids"].split(";")
    for item_uuid in item_uuids:
        books.delete_book(item_uuid)
        collection.remove_item_uuid_from_coll(coll_uuid, item_uuid)

    for item_uuid in item_uuids:
        delete_clipping(item_uuid)
        collection.remove_item_uuid_from_coll(coll_uuid, item_uuid)

    common.delete_cover(coll_uuid)
    db.run_sql(f"delete from coll where uuid='{coll_uuid}';")
    return "success"


def add_book_to_collection(coll_uuid, book_uuids):
    coll = collection.get_coll(coll_uuid)

    old_item_uuids = convert_str_to_list(coll["item_uuids"])
    new_item_uuids = book_uuids.strip().removesuffix(';').split(";")

    for item_uuid in difference(new_item_uuids, old_item_uuids):
        collection.add_item_uuid_to_coll(coll_uuid, item_uuid)

    for item_uuid in difference(old_item_uuids, new_item_uuids):
        collection.remove_item_uuid_from_coll(coll_uuid, item_uuid)
    return "success"


def update_collection(uuid, key, value):
    value = value.strip().removesuffix(';')
    coll = collection.get_coll(uuid)

    if key == "item_uuids":
        old_item_uuids = convert_str_to_list(coll["item_uuids"])
        new_item_uuids = value.split(";")

        # 往书籍的关联集合中添加新的集合
        for book_uuid in difference(new_item_uuids, old_item_uuids):
            collection.add_item_uuid_to_coll(uuid, book_uuid)

        # 从书籍的关联集合中删掉移除的集合
        for book_uuid in difference(old_item_uuids, new_item_uuids):
            collection.remove_item_uuid_from_coll(uuid, book_uuid)
    else:
        db.run_sql(f"update coll set {key}='{value}' where uuid='{uuid}'")
    return "success"


def get_coll_books(coll_uuid):
    coll = collection.get_coll(coll_uuid)
    book_uuids = coll["item_uuids"].split(";")

    data = []
    for uuid in  book_uuids:
        book_meta = books.get_book_meta(uuid)
        if book_meta is not None:
            data.append(book_meta)
    data.sort(key=lambda x: x['size'], reverse=True)
    return jsonify(data)
