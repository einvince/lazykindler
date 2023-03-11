
#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from ..util.util import get_now, utf8len
from ..database.database import db


def get_book_meta(uuid):
    data = db.query(f"select * from book_meta where uuid='{uuid}';")
    return data[0] if len(data) > 0 else None


def get_clipping_by_uuid(uuid):
    l = db.query(f"select * from clipping where uuid='{uuid}'")
    if len(l) == 0:
        return None
    data = l[0]
    data["highlights"] = [
        item for item in data["highlights"].split("___") if item != ""]
    return data


def clean_sqlite_sequence():
    data = db.query("select * from book_meta")
    if data is not None and len(data) == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'book_meta'")

    data = db.query("select *  from tmp_book;")
    if data is not None and len(data) == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'tmp_book'")

    data = db.query("select * from cover")
    if data is not None and len(data) == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'cover'")

    data = db.query("select * from coll")
    if data is not None and len(data) == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'coll'")

    data = db.query("select * from clipping")
    if data is not None and len(data) == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'clipping'")

    data = db.query("select * from book_to_clipping_book")
    if data is not None and len(data) == 0:
        db.run_sql(
            "DELETE FROM sqlite_sequence WHERE name = 'book_to_clipping_book'")


def delete_cover(uuid):
    db.run_sql(f"delete from cover where uuid='{uuid}'")


def get_cover(uuid):
    return db.query(f"select * from cover where uuid='{uuid}'")


def insert_cover(content, uuid):
    sql = """INSERT INTO cover (uuid, size, content, create_time ) 
                                        VALUES (?, ?, ?, ?) """

    flag = 2 if content.endswith("==") else 1
    size = ((utf8len(content)) * (3/4)) - flag

    cur = db.conn.cursor()
    cur.execute(sql, (uuid, size, content, get_now()))
    db.conn.commit()
