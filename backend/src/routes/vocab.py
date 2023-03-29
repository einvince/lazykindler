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
