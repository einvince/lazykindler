#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import os
from pathlib import Path
from .collection import remove_item_uuid_from_coll
from ..util.util import ls_books
from ..database.database import db


def get_relation_by_relation(book_meta_uuid, clipping_book_name):
    return db.query(f"select * from book_to_clipping_book where book_meta_uuid='{book_meta_uuid}' and clipping_book_name='{clipping_book_name}'")


def get_relation_by_clipping_book_name(clipping_book_name):
    return db.query(f"select * from book_to_clipping_book where clipping_book_name='{clipping_book_name}'")


def get_relation_by_book_meta_uuid(book_meta_uuid):
    return db.query(f"select * from book_to_clipping_book where book_meta_uuid='{book_meta_uuid}'")


def get_all_relation():
    return db.query("select * from book_to_clipping_book")


def delete_relation_by_book_name(book_name):
    return db.run_sql(f"delete from book_to_clipping_book where clipping_book_name='{book_name}'")


def delete_relation_by_book_meta_uuid(book_meta_uuid):
    return db.run_sql(f"delete from book_to_clipping_book where book_meta_uuid='{book_meta_uuid}'")


def update_relation(book_meta_uuid, clipping_book_name, new_status):
    return db.query(f"update book_to_clipping_book set status={new_status} where book_meta_uuid='{book_meta_uuid}' and clipping_book_name='{clipping_book_name}'")
