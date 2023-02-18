#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from ..util.util import convert_str_to_list
from ..database.database import db
from .common import get_book_meta, get_clipping_by_uuid


def get_coll(uuid):
    return db.query(
        f"select * from coll where uuid='{uuid}';"
    )[0]


def get_all_coll():
    return db.query("select * from coll;")


def add_item_uuid_to_coll(coll_uuid, item_uuid):
    # sourcery skip: extract-duplicate-method
    coll_info = get_coll(coll_uuid)
    item_uuids = convert_str_to_list(coll_info["item_uuids"])
    if item_uuid in item_uuids:
        return
    item_uuids.append(item_uuid)

    db.run_sql(
        f"""update coll set item_uuids='{";".join(item_uuids)}' where uuid='{coll_uuid}'"""
    )

    book_info = get_book_meta(item_uuid)
    if book_info is not None:
        coll_uuids = convert_str_to_list(book_info["coll_uuids"])
        coll_uuids.append(coll_uuid)

        coll_uuids_str = ";".join(coll_uuids)

        db.run_sql(
            f"""update book_meta set coll_uuids='{coll_uuids_str}' where uuid='{item_uuid}'"""
        )
        db.run_sql(f"delete from tmp_book where uuid='{book_info['uuid']}'")
        return

    clipping_info = get_clipping_by_uuid(item_uuid)
    if clipping_info is not None:
        coll_uuids = convert_str_to_list(clipping_info["coll_uuids"])
        coll_uuids.append(coll_uuid)
        coll_uuids_str = ";".join(coll_uuids)

        db.run_sql(
            f"""update clipping set coll_uuids='{coll_uuids_str}' where uuid='{item_uuid}'"""
        )


def remove_item_uuid_from_coll(coll_uuid, item_uuid):
    if item_uuid == "":
        return
    coll_info = get_coll(coll_uuid)
    if coll_info is None:
        return
    item_uuids = convert_str_to_list(coll_info["item_uuids"])
    if item_uuid not in item_uuids:
        return
    item_uuids.remove(item_uuid)

    db.run_sql(
        f"""update coll set item_uuids='{";".join(item_uuids)}' where uuid='{coll_uuid}'"""
    )

    book_info = get_book_meta(item_uuid)
    if book_info is not None:
        coll_uuids = convert_str_to_list(book_info["coll_uuids"])
        coll_uuids.remove(coll_uuid)
        db.run_sql(
            f"""update book_meta set coll_uuids='{";".join(coll_uuids)}' where uuid='{item_uuid}'"""
        )
        return

    clipping_info = get_clipping_by_uuid(item_uuid)
    if clipping_info is not None:
        coll_uuids = convert_str_to_list(clipping_info["coll_uuids"])
        coll_uuids.remove(coll_uuid)
        db.run_sql(
            f"""update clipping set coll_uuids='{";".join(coll_uuids)}' where uuid='{item_uuid}'"""
        )


def get_colls_by_type(coll_type):
    return db.query(f"select * from coll where coll_type='{coll_type}'")
