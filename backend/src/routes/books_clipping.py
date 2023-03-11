#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from flask import request
import os
import pathlib
from pathlib import Path

from ..util.util import if_ext_supported_book_ext, ls_books
from ..service import book_clipping


def get_all_book_clipping():
    return book_clipping.get_all_book_clipping()


def update_relation():
    content = request.json
    book_meta_uuid = content['book_meta_uuid']
    clipping_book_name = content['clipping_book_name']
    action = content['action']
    return book_clipping.update_relation(book_meta_uuid, clipping_book_name, action)
