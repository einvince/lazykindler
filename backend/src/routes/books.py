from flask import request
import os
import pathlib
from pathlib import Path
from ..util.util import if_ext_supported, ls_books
from ..service import books


def store_books():
    """
    GET request endpoint of UsersInfo
    :return:

        "Hello world, from Users!"
    """

    path = Path(os.path.dirname(os.path.abspath(__file__))).parent.parent.absolute()
    data_path = os.path.join(path, "data")
    isExist = os.path.exists(data_path)
    if not isExist:
        os.makedirs(data_path)

    content = request.json
    book_paths = content['book_paths'].split(";")

    i = 1
    for book_path in book_paths:
        if os.path.isdir(book_path):
            filepaths = ls_books(book_path)
            for filepath in filepaths:
                print("存储书籍-----------index = {}, filepath = {}".format(i, filepath))
                i += 1
                books.store_book_from_path(filepath, data_path)
        else:
            if if_ext_supported(pathlib.Path(book_path).suffix):
                print("存储书籍-----------index = {}, filepath = {}".format(i, book_path))
                i += 1
                books.store_book_from_path(book_path, data_path)
    return "success"


def get_books_meta():
    store_type = request.args.get('storeType')
    data = books.get_books_meta(store_type)
    return data


def get_books_meta_by_uuids():
    uuids_str = request.args.get('uuids')
    data = books.get_books_meta_by_uuids(uuids_str.split(";"))
    return data


def get_book_cover():
    uuid = request.args.get('uuid')
    return books.get_book_cover(uuid)


def delete_book():
    uuid = request.args.get('uuid')
    return books.delete_book(uuid)


def update_book_meta():
    content = request.json
    uuid = content['uuid']
    key = content['key']
    value = content['value']
    return books.update_book_meta(uuid, key, value)


def delete_book_by_keyword():
    store_type = request.args.get('store_type')
    keyword = request.args.get('keyword')
    value = request.args.get('value')
    return books.delete_books_by_keyword(store_type, keyword, value)


def delete_all_books():
    return books.delete_all_books()


def update_book_cover():
    content = request.json
    book_uuid = content['book_uuid']
    cover_str = content['cover']
    return books.upsert_book_cover(book_uuid, cover_str)
