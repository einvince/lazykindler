#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import os
import shutil
from pathlib import Path
from flask import jsonify, send_file

from ..service.cover import upsert_cover

from ..helper.books import delete_book, get_all_books, get_all_tmp_books, get_book_meta, get_book_meta_list_by_author, get_book_meta_list_by_publisher, get_book_meta_list_by_star, get_book_meta_list_by_tag
from ..helper.collection import add_item_uuid_to_coll, remove_item_uuid_from_coll
from ..helper.common import clean_sqlite_sequence


from ..routes.books import ls_books
from ..core.kindle.meta.metadata import get_metadata
from ..database.database import db
from ..util.util import add_md5_to_filename, convert_str_to_list, \
    escape_string,  \
    generate_uuid,  \
    get_md5,  \
    get_md5_from_filename,  \
    get_now,  \
    is_all_chinese,  \
    difference,  \
    remove_md5_from_filename \



def store_book(book_path, data_path):
    uuid = generate_uuid()
    md5 = get_md5(book_path)
    book_meta_record = db.query(
        f"select uuid from book_meta where md5='{md5}'")
    if len(book_meta_record) > 0:
        return False

    store(book_path, uuid, md5, data_path)
    db.run_sql(
        f"update tmp_book set create_time='{get_now()}' where uuid='{uuid}'"
    )
    return True


def store(book_path, uuid, md5, data_path):
    # 书名
    title = ""
    # 出版商
    publisher = ""
    # 作者
    author = ""
    # 标签
    tags = ""
    # 集合
    coll_uuids = ""

    book_size = os.path.getsize(book_path)

    meta = {}
    try:
        meta = get_metadata(book_path)
    except Exception as e:
        raise RuntimeError(f"存储书籍: {book_path} 遇到错误") from e

    for key, value in meta.items():
        if key == "author":
            author = ";".join(value).strip()
        elif key == "publisher":
            publisher = ';'.join(value).strip()
        elif key == "subject":
            res = []
            for v in value:
                parts = v.split("-")
                if len(parts):
                    res.extend(part for part in parts if is_all_chinese(part))
            tags = ";".join(res).strip()
        elif key in ["updatedtitle", "title"]:
            title = ';'.join(value).strip()

    if title == "":
        base = os.path.basename(book_path)
        title = os.path.splitext(base)[0].strip()

    db.insert_book(uuid, title, author, tags,
                   book_size, publisher, coll_uuids, md5, book_path)

    shutil.copy2(book_path, data_path)
    p1 = os.path.join(data_path, os.path.basename(book_path))
    p2 = add_md5_to_filename(p1)
    os.rename(p1, p2)


def get_books_meta(storeType, sortTypeValue):
    data = []
    if storeType == 'no_tmp':
        # 查找正式存储的数据
        data = db.query(
            "select a.* from book_meta a where not exists (select null from tmp_book b where a.uuid = b.uuid);")
    else:
        # 查找临时存储的数据
        data = db.query(
            "select a.* from book_meta a where exists (select null from tmp_book b where a.uuid = b.uuid); ")

    sortTypeValue = int(sortTypeValue)

    if sortTypeValue == 1:
        data.sort(key=lambda x: x['size'], reverse=False)
    elif sortTypeValue == 2:
        data.sort(key=lambda x: x['size'], reverse=True)
    elif sortTypeValue == 3:
        data.sort(key=lambda x: x['create_time'], reverse=True)
    elif sortTypeValue == 4:
        data.sort(key=lambda x: x['create_time'], reverse=False)
    elif sortTypeValue == 5:
        data.sort(key=lambda x: x['star'], reverse=True)
    elif sortTypeValue == 6:
        data.sort(key=lambda x: x['star'], reverse=False)
    elif sortTypeValue == 7:
        data.sort(key=get_author, reverse=False)
    elif sortTypeValue == 8:
        data.sort(key=get_publisher, reverse=False)
    return jsonify(data)


def get_author(book_meta):
    return book_meta["author"]


def get_publisher(book_meta):
    return book_meta["publisher"]


def get_book_cover(uuid):
    data = db.query(f"select content from cover where uuid='{uuid}';")
    return "" if data is None or len(data) == 0 else data[0]['content']


def delete_book_by_uuid(uuid):
    delete_book(uuid=uuid)
    return "success"


def update_book_meta(uuid, key, value):
    value = value.strip()

    if key == "coll_uuids":
        update_book_meta_colls(uuid, value)
    else:
        db.run_sql(f"update book_meta set {key}='{value}' where uuid='{uuid}'")
    return "success"


def update_book_meta_colls(uuid, value):
    value = value.removesuffix(';')

    db.run_sql(f"delete from tmp_book where uuid='{uuid}'")

    book_meta = get_book_meta(uuid)

    old_coll_uuids = convert_str_to_list(book_meta["coll_uuids"])
    new_coll_uuids = convert_str_to_list(value)

    # 处理取消关联的集合
    for coll_uuid in difference(old_coll_uuids, new_coll_uuids):
        remove_item_uuid_from_coll(coll_uuid, uuid)

    # 处理新增关联的集合
    for coll_uuid in difference(new_coll_uuids, old_coll_uuids):
        add_item_uuid_to_coll(coll_uuid, uuid)


def get_books_meta_by_uuids(uuids):
    result = []
    for uuid in uuids:
        data = get_book_meta(uuid)
        if data is not None:
            result.append(data)

    result.sort(key=lambda x: x['size'], reverse=True)
    return jsonify(result)


def delete_books_by_keyword(keyword, value):
    value = value.strip()
    uuids = []

    if keyword == "评分":
        books = get_book_meta_list_by_star(value)
        uuids.extend(book['uuid'] for book in books)
    elif keyword == "标签":
        books = get_book_meta_list_by_tag(value)
        uuids.extend(book['uuid'] for book in books)
    elif keyword == "作者":
        books = get_book_meta_list_by_author(value)
        uuids.extend(book['uuid'] for book in books)
    elif keyword == "出版社":
        books = get_book_meta_list_by_publisher(value)
        uuids.extend(book['uuid'] for book in books)

    for uuid in uuids:
        delete_book(uuid)

    return "success"


def delete_all_books():
    books = get_all_books()
    for book in books:
        delete_book(book["uuid"])
    clean_sqlite_sequence()
    return "success"


def delete_all_tmp_books():
    books = get_all_tmp_books()
    for book in books:
        delete_book(book["uuid"])
    return "success"


def upsert_book_cover(uuid, cover_str):
    upsert_cover(uuid, cover_str)
    return "success"


def download_file(uuid):
    book_info = get_book_meta(uuid)
    target_md5 = book_info['md5']

    path = Path(os.path.dirname(os.path.abspath(__file__))
                ).parent.parent.absolute()
    data_path = os.path.join(path, "data")
    is_exist = os.path.exists(data_path)
    if not is_exist:
        return "success"

    download_dir = str(Path.home() / "Downloads")
    if not os.path.isdir(download_dir):
        download_dir = str(Path.home() / "下载")

    filepaths = ls_books(data_path)
    for filepath in filepaths:
        if target_md5 in filepath:
            shutil.copy2(filepath, download_dir)

            md5_filename = os.path.basename(filepath)
            original_filename = remove_md5_from_filename(md5_filename)

            p1 = os.path.join(download_dir, md5_filename)
            p2 = os.path.join(download_dir, original_filename)
            os.rename(p1, p2)
            break
    return "success"


def download_all_files():
    download_dir = str(Path.home() / "Documents")
    if not os.path.isdir(download_dir):
        download_dir = str(Path.home() / "文稿")

    target_dir = os.path.join(download_dir, "lazykindler")
    isExist = os.path.exists(target_dir)
    if not isExist:
        os.makedirs(target_dir)

    md5_list_file_path = os.path.join(target_dir, "md5_list.txt")
    fle = Path(md5_list_file_path)
    fle.touch(exist_ok=True)

    path = Path(os.path.dirname(os.path.abspath(__file__))
                ).parent.parent.absolute()
    data_path = os.path.join(path, "data")
    is_exist = os.path.exists(data_path)
    if not is_exist:
        return "success"

    md5_m = {}
    md5_list = []
    with open(md5_list_file_path) as file:
        md5_list = [line.rstrip() for line in file]
        for md5 in md5_list:
            md5_m[md5] = {}

    filepaths = ls_books(data_path)
    for filepath in filepaths:
        md5_filename = os.path.basename(filepath)
        md5 = get_md5_from_filename(md5_filename)
        if md5 in md5_m:
            continue

        shutil.copy2(filepath, target_dir)

        md5_list.append(md5)
        original_filename = remove_md5_from_filename(md5_filename)

        p1 = os.path.join(target_dir, md5_filename)
        p2 = os.path.join(target_dir, original_filename)
        os.rename(p1, p2)

    # 清空文件内容
    open(md5_list_file_path, 'w').close()

    with open(md5_list_file_path, 'w') as f:
        for line in md5_list:
            f.write(f"{line}\n")

    return "success"


def download_file_for_read(uuid):
    try:
        book_info = get_book_meta(uuid)
        target_md5 = book_info['md5']

        path = Path(os.path.dirname(os.path.abspath(__file__))
                    ).parent.parent.absolute()
        data_path = os.path.join(path, "data")
        is_exist = os.path.exists(data_path)
        if not is_exist:
            return "success"

        filepaths = ls_books(data_path)
        for filepath in filepaths:
            # 这里的filepath是mobi或者azw3格式的路径地址
            # 如果对应的epub格式电子书不存在，就开始转换格式
            # 然后发送转换后的格式
            if target_md5 in filepath:
                if ' ' in filepath:
                    new_filepath = filepath.replace(" ", "_")
                    os.rename(filepath, new_filepath)
                    filepath = new_filepath

                epub_filepath = f'{os.path.splitext(filepath)[0]}.epub'
                is_exist = os.path.exists(epub_filepath)
                if not is_exist:
                    command = "/Applications/calibre.app/Contents/MacOS/ebook-convert " + \
                        filepath + " " + epub_filepath
                    command = escape_string(command)
                    print(
                        "in download_file_for_read 开始转换书籍----------------command = ", command)
                    os.system(
                        command
                    )

                print(
                    "in download_file_for_read, epub_filepath----------------", epub_filepath)
                return send_file(epub_filepath, as_attachment=True)
    except Exception as error:
        print("in download_file_for_read ------------------------发生错误, err = ", error)
        return "fail"

    return "fail"
