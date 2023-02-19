#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import re
from ..database.database import db
from .collection import remove_item_uuid_from_coll

def update_clipping(uuid, key, value):
    db.run_sql(f"update clipping set {key}='{value}' where uuid='{uuid}'")
    return "success"


def get_clipping_by_md5(md5_str):
    return db.query(f"select uuid from clipping where md5='{md5_str}';")[0]


def get_all_clippings():
    return db.query("select * from clipping where deleted is null;")

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
    data["highlights"] = [item for item in data["highlights"].split("___") if item != "" ]
    return data

def update_clipping_highlights(clipping):
    db.query(f"""update clipping set highlights='{"___".join(clipping["highlights"])}' where uuid='{clipping['uuid']}'""")

def update_clipping_star(old_value, new_value):
    db.run_sql(f"update clipping set star={new_value} where star={old_value}")

def update_clipping_tag(old_value, new_value):
    db.query(f"update clipping set tags='{new_value}' where tags='{old_value}';")

def update_clipping_author(old_value, new_value):
    clipp_list = get_all_clippings()
    for clipp in clipp_list:
        print(clipp["author"], old_value, compare_strings_ignore_special_chars(clipp["author"], old_value))
        if compare_strings_ignore_special_chars(clipp["author"], old_value):
            db.run_sql(f"update clipping set author='{new_value}' where uuid='{clipp['uuid']}';")

def update_clipping_book_name(old_value, new_value):
    clipp_list = get_all_clippings()
    for clipp in clipp_list:
        print(clipp["book_name"], old_value, compare_strings_ignore_special_chars(clipp["book_name"], old_value))
        if compare_strings_ignore_special_chars(clipp["book_name"], old_value):
            db.run_sql(f"update clipping set book_name='{new_value}' where uuid='{clipp['uuid']}';")

def compare_strings_ignore_special_chars(s1, s2):
    # 书名或者作者命中，可能包含特殊字符，导致无法进行比较
    # 这里去掉任何特殊字符后比较是否相等
    s1 = re.sub(r'\W+', '', s1).lower()
    s2 = re.sub(r'\W+', '', s2).lower()
    return s1 == s2

def delete_clipping(uuid):
    db.run_sql(f"update clipping set deleted=1 where uuid='{uuid}'")
    db.run_sql(f"delete from comment where related_uuid='{uuid}'")

    colls = db.query(
        f"select uuid, item_uuids from coll where item_uuids like '%{uuid}%'"
    )
    for coll in colls:
        remove_item_uuid_from_coll(coll["uuid"], uuid)
    return "success"
