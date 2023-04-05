
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
    data = db.query("select count(*) as count from book_meta")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'book_meta'")

    data = db.query("select count(*) as count  from tmp_book;")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'tmp_book'")

    data = db.query("select count(*) as count from cover")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'cover'")

    data = db.query("select count(*) as count from coll")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'coll'")

    data = db.query("select count(*) as count from clipping")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'clipping'")

    data = db.query("select count(*) as count from book_to_clipping_book")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'book_to_clipping_book'")
    
    data = db.query("select count(*) as count from comment")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'comment'")

    data = db.query("select count(*) as count from vocab_related_books")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'vocab_related_books'")

    data = db.query("select count(*) as count from vocab_words")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'vocab_words'")

    data = db.query("select count(*) as count from vocab_words_usage")
    if data[0]['count'] == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'vocab_words_usage'")


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
