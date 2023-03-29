#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from ..database.database import db


def insert_vocab_related_book_if_need(book_key, title, author):
    vocab_book_info = get_vocab_book_by_key(book_key)
    if vocab_book_info is None or len(vocab_book_info) == 0:
        db.insert_vocab_related_books(
            book_key,
            title,
            author
        )
        return


def insert_vocab_word_if_need(book_key, word_key):
    lan = word_key.split(":")[0]
    word = word_key.split(":")[1]
    vocab_word_info = get_vocab_word_by_word(word)
    if vocab_word_info is None or len(vocab_word_info) == 0:
        db.insert_vocab_words(
            book_key,
            word,
            lan,
        )
        return


def insert_vocab_words_usage_if_need(book_key, word_key, usage, translated_usage, timestamp):
    lan = word_key.split(":")[0]
    word = word_key.split(":")[1]
    vocab_words_usage = get_vocab_words_usage_by_usage(word, usage)
    if vocab_words_usage is None or len(vocab_words_usage) == 0:
        db.insert_vocab_words_usage(
            book_key,
            word,
            usage,
            translated_usage,
            lan,
            timestamp,
        )
        return


def get_vocab_book_by_key(key):
    return db.query(f"select * from vocab_related_books where key='{key}';")


def get_vocab_words_usage_by_usage(word, usage):
    return db.query(f"select * from vocab_words_usage where word='{word}' and usage='{usage}';")

def get_vocab_word_by_word(word):
    return db.query(f"select * from vocab_words where word='{word}';")

def get_vocab_words_usage_list_by_word(book_key, word):
    return db.query(f"select * from vocab_words_usage where book_key='{book_key}' and word='{word}';")

def get_word_usage_list(book_key, word):
    return get_vocab_words_usage_list_by_word(book_key, word)
