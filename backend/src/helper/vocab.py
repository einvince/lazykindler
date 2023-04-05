#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import time
from ..database.database import db


def insert_vocab_related_book_if_need(book_key, title, lang, author):
    vocab_book_info = get_vocab_book_by_key(book_key)
    if vocab_book_info is None or len(vocab_book_info) == 0:
        db.insert_vocab_related_books(
            book_key,
            title,
            lang,
            author
        )


def insert_vocab_word_if_need(book_key, word):
    vocab_word_info = get_vocab_word_by_word(book_key, word)
    if vocab_word_info is None or len(vocab_word_info) == 0:
        db.insert_vocab_words(
            book_key,
            word,
        )


def upsert_vocab_words_usage_if_need(book_key, word, usage, translated_usage, timestamp=None):
    if timestamp is None:
        timestamp = time.time() * 1000
    vocab_words_usage = get_vocab_words_usage_by_usage(book_key, word, usage)
    if vocab_words_usage is None or len(vocab_words_usage) == 0:
        db.insert_vocab_words_usage(
            book_key,
            word,
            usage,
            translated_usage,
            timestamp,
        )
        return
    if translated_usage is None:
        translated_usage = "" 
    
    # 一般不太可能清空翻译内容，为了防止被自动导入程序从kindle数据库生词本中导入时清理
    # 用户之前设置的生词用例的翻译，这里如果翻译为空直接退出
    if translated_usage == "":
        return
    
    db.run_sql(f"update vocab_words_usage set translated_usage='{translated_usage}' where book_key='{book_key}' and word='{word}' and usage='{usage}';")

def get_vocab_book_by_key(book_key):
    return db.query(f"select * from vocab_related_books where key='{book_key}';")

def get_vocab_words_usage_by_usage(book_key, word, usage):
    return db.query(f"select * from vocab_words_usage where book_key='{book_key}' and word='{word}' and usage='{usage}';")

def get_vocab_word_by_word(book_key, word):
    return db.query(f"select * from vocab_words where book_key='{book_key}' and word='{word}';")

def get_word_usage_list(book_key, word):
    return db.query(f"select * from vocab_words_usage where book_key='{book_key}' and word='{word}';")

def delete_all_vocab_related_data():
    db.run_sql("delete from vocab_related_books")
    db.run_sql("delete from vocab_words")
    db.run_sql("delete from vocab_words_usage")
