#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from flask import request
from ..service import vocab


def get_vocab_words():
    return vocab.get_words_list()


def get_vocab_book_list():
    content = request.json
    book_key_list = content['book_key_list']
    return vocab.get_vocab_book_list(book_key_list)


def get_vocab_words_by_book():
    content = request.json
    book_key_list = content['book_key_list']
    return vocab.get_vocab_words_by_book(book_key_list)


def upsert_word_and_usage():
    content = request.json
    book_key = content['book_key']
    word = content['word']
    usage = content['usage']
    translated_usage = content['translated_usage']
    return vocab.upsert_word_and_usage(book_key, word, usage, translated_usage)
