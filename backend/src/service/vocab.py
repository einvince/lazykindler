#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import sqlite3
import os
from flask import jsonify
import json

from ..database.database import db
from ..helper import vocab, common


# vocab_path = "/Users/wupeng/Documents/vocab.db"
vocab_path = "/Volumes/Kindle/system/vocabulary/vocab.db"


def sync_vocab_to_lazykindler():
    if not os.path.isfile(vocab_path):
        return

    book_info_list = read_data_from_sqlite_table("BOOK_INFO")
    for item in book_info_list:
        vocab.insert_vocab_related_book_if_need(
            item["id"],
            item["title"],
            item["lang"],
            item["authors"],
        )

    lookup_list = read_data_from_sqlite_table("LOOKUPS")
    for item in lookup_list:
        word = item["word_key"]
        if ":" in word:
            word = word.split(":")[1]
        vocab.insert_vocab_word_if_need(
            item["book_key"],
            word,
        )
        vocab.upsert_vocab_words_usage_if_need(
            item["book_key"],
            word,
            item["usage"],
            "",
            item["timestamp"],
        )


def read_data_from_sqlite_table(table_name):
    conn = sqlite3.connect(vocab_path)
    cursor = conn.cursor()

    cursor.execute(f"PRAGMA table_info({table_name})")
    column_names = [column_info[1] for column_info in cursor.fetchall()]

    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()

    result = []
    for row in rows:
        row_dict = dict(zip(column_names, row))
        result.append(row_dict)

    cursor.close()
    conn.close()

    return result


def get_words_list():
    sql = "select b.word, a.title, a.author, b.usage, b.create_time from vocab_related_books a JOIN vocab_words b where a.key == b.book_key"
    data = db.query(sql)
    if data is None:
        data = []
    data.sort(key=lambda x: x['author'], reverse=True)

    result = []
    for item in data:
        item["usage"] = vocab.get_word_usage_list(item["word"])
        result.append(item)

    return jsonify(result)


def get_vocab_book_list(book_key_list):
    sql = '''select 
    a.key,a.title,a.author,a.create_time,count(*) wordCount 
    from vocab_related_books a
    left join vocab_words b on a.key = b.book_key

    group by a.key,a.title,a.author,a.create_time
     '''
    if len(book_key_list):
        sql += f" where a.key in '{book_key_list}'"
    data = db.query(sql)
    if data is None:
        data = []
    return jsonify(data)

def get_vocab_words_by_book(book_key_list):
    sql = f"select * from vocab_words where book_key in {book_key_list}"

    sql = sql.replace("[", "(")
    sql = sql.replace("]", ")")

    data = db.query(sql)
    if data is None:
        data = []
    
    result = []
    for item in data:
        item["usage"] = vocab.get_word_usage_list(item["book_key"], item["word"])
        result.append(item)

    return jsonify(result)

def upsert_word_and_usage(book_key, word, usage, translated_usage):
    word_info = vocab.get_vocab_word_by_word(book_key, word)
    if word_info is None or len(word_info) == 0:
        vocab.insert_vocab_word_if_need(
            book_key,
            word,
        )
    vocab.upsert_vocab_words_usage_if_need(book_key, word, usage, translated_usage)
    return "success"


def delete_all_vocab_related_data():
    vocab.delete_all_vocab_related_data()
    common.clean_sqlite_sequence()
    return "success"


if __name__ == "__main__":
    sync_vocab_to_lazykindler()
