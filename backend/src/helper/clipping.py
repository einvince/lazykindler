#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import re

from ..util.util import compare_strings_ignore_special_chars
from ..database.database import db
from .collection import remove_item_uuid_from_coll


def update_clipping(uuid, key, value):
    db.run_sql(f"update clipping set {key}='{value}' where uuid='{uuid}'")
    return "success"


def get_clipping_by_md5(md5_str):
    return db.query(f"select uuid from clipping where md5='{md5_str}';")


def check_if_there_is_book_clipping(book_name):
    book_name = book_name.replace("'", "")
    res = db.query(f"SELECT id FROM clipping WHERE book_name = '{book_name}'")
    return res is not None and len(res) != 0


def get_all_clippings():
    return db.query("select * from clipping where deleted is null;")


def get_clippings_by_book_name(book_name):
    book_name = book_name.replace("'", "")
    return db.query(f"select * from clipping where book_name='{book_name}' and deleted is null;")

def delete_clipping_hard(uuid):
    db.run_sql(f"delete from clipping where uuid='{uuid}'")
    delete_comment_hard(uuid)


def delete_comment_hard(clipping_uuid):
    db.run_sql(f"delete from comment where related_uuid='{clipping_uuid}'")


def get_clipping_by_uuid(uuid):
    l = db.query(f"select * from clipping where uuid='{uuid}'")
    if len(l) == 0:
        return None
    data = l[0]
    data["highlights"] = [
        item for item in data["highlights"].split("___") if item != ""]
    return data


def update_clipping_highlights(clipping):
    db.run_sql(
        f"""update clipping set highlights='{"___".join(clipping["highlights"])}' where uuid='{clipping['uuid']}'""")


def update_clipping_star(old_value, new_value):
    db.run_sql(f"update clipping set star={new_value} where star={old_value}")


def update_clipping_tag(old_value, new_value):
    db.query(
        f"update clipping set tags='{new_value}' where tags='{old_value}';")


def update_clipping_author(old_value, new_value):
    clipp_list = get_all_clippings()
    for clipp in clipp_list:
        if compare_strings_ignore_special_chars(clipp["author"], old_value):
            db.run_sql(
                f"update clipping set author='{new_value}' where uuid='{clipp['uuid']}';")


def update_clipping_book_name(old_value, new_value):
    clipp_list = get_all_clippings()
    for clipp in clipp_list:
        if compare_strings_ignore_special_chars(clipp["book_name"], old_value):
            db.run_sql(
                f"update clipping set book_name='{new_value}' where uuid='{clipp['uuid']}';")


def delete_clipping(uuid):
    db.run_sql(f"update clipping set deleted=1 where uuid='{uuid}'")
    db.run_sql(f"delete from comment where related_uuid='{uuid}'")

    colls = db.query(
        f"select uuid, item_uuids from coll where item_uuids like '%{uuid}%'"
    )
    for coll in colls:
        remove_item_uuid_from_coll(coll["uuid"], uuid)
    return "success"
