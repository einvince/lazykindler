#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import os
from pathlib import Path
import hashlib

from ..util.util import ls_moon_reader_clippings, generate_uuid
from ..database.database import db


def import_moon_reader_clipping():
    """
        导入 "静读天下"apk中导出的电子书高亮文件

        搜索目录是 ~/Downloads、~/Desktop、~/下载、~/桌面 等目录下, 文件扩展名是 .mrexpt 的文件,
        这种文件是从 "静读天下"apk 导出的高亮文件的格式.
    """
    # 扫描下载、桌面等目录的高亮文件
    path_list = []
    dir_path = str(Path.home() / "Downloads")
    if os.path.isdir(dir_path):
        path_list.append(dir_path)

    dir_path = str(Path.home() / "下载")
    if os.path.isdir(dir_path):
        path_list.append(dir_path)

    dir_path = str(Path.home() / "Desktop")
    if os.path.isdir(dir_path):
        path_list.append(dir_path)

    dir_path = str(Path.home() / "桌面")
    if os.path.isdir(dir_path):
        path_list.append(dir_path)

    for clipping_path in path_list:
        filepaths = ls_moon_reader_clippings(clipping_path)
        for filepath in filepaths:
            handle_moon_reader_clipping_file(filepath)
    return


def handle_moon_reader_clipping_file(filepath):
    base, ext = os.path.splitext(filepath)
    book_name = os.path.basename(base)

    # 从文件名里提取的名称一般很长，书名后可能加了很多乱七八糟的说明，为了
    # 尽可能获取短的有效的名称，按照下面的方式提取有效字符串
    extracted_book_name_v1, _, _ = book_name.partition('(')
    extracted_book_name_v2, _, _ = book_name.partition('（')
    if len(extracted_book_name_v1) < len(extracted_book_name_v2):
        book_name = extracted_book_name_v1
    else:
        book_name = extracted_book_name_v2

    with open(filepath, 'r') as file:
        blocks = []
        current_block = []
        empty_strings = 0

        for line in file:
            line = line.strip()
            if line == "":
                empty_strings += 1
            else:
                empty_strings = 0
                current_block.append(line)

            if empty_strings == 2:
                blocks.append(current_block)
                current_block = []
                empty_strings = 0
        blocks.append(current_block)

        for line_list in blocks:
            clip_content = line_list[0]
            timestamp = int(line_list[-1])

            # TODO 高亮文件中没有作者信息
            author = None

            str_md5 = hashlib.md5(clip_content.encode('utf-8')).hexdigest()
            clips = db.query(
                "select uuid from clipping where md5='{}';".format(str_md5))
            if clips is not None and len(clips) > 0:
                if timestamp != 0:
                    db.run_sql("update clipping set {}='{}' where uuid='{}'".format(
                                "addDate", timestamp/1000, clips[0]["uuid"]))
                if author is not None:
                    db.run_sql("update clipping set {}={} where uuid='{}'".format(
                                "author", author, clips[0]["uuid"]))
            else:
                clip_content = clip_content.replace('<BR><BR><BR>', '\n')
                clip_content = clip_content.replace('<BR><BR>', '\n')
                clip_content = clip_content.replace('<BR>', '\n')
                clip_content = clip_content.strip()
                db.insert_clipping(generate_uuid(), book_name, author,
                        clip_content, timestamp, str_md5)
