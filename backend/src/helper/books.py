#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import os
from pathlib import Path

from .book_clipping import delete_relation_by_book_meta_uuid
from ..helper.collection import remove_item_uuid_from_coll
from ..util.util import ls_books
from ..database.database import db


def update_book_meta(uuid, key, value):
    db.run_sql(f"update book_meta set {key}='{value}' where uuid='{uuid}'")
    return "success"


def get_book_meta(uuid):
    data = db.query(f"select * from book_meta where uuid='{uuid}';")
    return data[0] if len(data) > 0 else None


def get_all_books():
    return db.query(
        "select * from book_meta")


def get_all_tmp_books():
    return db.query(
        "select * from tmp_book")


def get_book_meta_list_by_star(star):
    return db.query(
        f"select uuid from book_meta where star='{int(star)}';"
    )


def get_book_meta_list_by_tag(tag):
    return db.query(
        f"select uuid from book_meta where tags like '^{tag};%' or tags like '%;{tag}$' or tags like '%;{tag};%' or tags='{tag}';"
    )


def get_book_meta_list_by_author(author):
    return db.query(
        f"select uuid from book_meta where author='{int(author)}';"
    )


def get_book_meta_list_by_publisher(publisher):
    return db.query(
        f"select uuid from book_meta where publisher='{int(publisher)}';"
    )


def delete_book(uuid):
    delete_book_data_by_uuid(uuid)

    db.run_sql(f"delete from book_meta where uuid='{uuid}'")
    db.run_sql(f"delete from cover where uuid='{uuid}'")
    db.run_sql(f"delete from tmp_book where uuid='{uuid}'")

    delete_relation_by_book_meta_uuid(uuid)

    colls = db.query(
        f"select uuid, item_uuids from coll where item_uuids like '%{uuid}%'"
    )
    for coll in colls:
        remove_item_uuid_from_coll(coll['uuid'], uuid)


# 从data目录删除书籍文件
def delete_book_data_by_uuid(uuid):
    book_infos = db.query(f"select md5 from book_meta where uuid='{uuid}'")
    if len(book_infos) == 0:
        return

    book_info = book_infos[0]
    target_md5 = book_info['md5']

    path = Path(os.path.dirname(os.path.abspath(__file__))
                ).parent.parent.absolute()
    data_path = os.path.join(path, "data")
    is_exist = os.path.exists(data_path)
    if not is_exist:
        return

    filepaths = ls_books(data_path)
    for filepath in filepaths:
        if target_md5 in filepath:
            try:
                os.remove(filepath)
                break
            except OSError:
                break
