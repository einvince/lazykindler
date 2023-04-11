#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from flask import Flask
from flask_cors import CORS
import os
import time
import atexit
import threading

from ..service.vocab import sync_vocab_to_lazykindler
from ..service.book_clipping import maintain_relation
from ..service.clipping import ClippingHelper
from ..service.moon_reader import import_moon_reader_clipping
from ..routes import books, clipping, collection, comment, books_clipping, vocab, setting


app = Flask(__name__)
# cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
cors = CORS(app)


def background_task():
    while True:
        print("Background task running...")

        # kindle 高亮笔记导入
        clipping_helper = ClippingHelper()
        clipping_helper.import_clippings()

        # 导入 静读天下apk 中导出的电子书高亮文件
        import_moon_reader_clipping()

        # 维护书籍和高亮笔记书籍的关系。TODO 后期会把书籍和高亮笔记做关联
        maintain_relation()

        # 同步kindle中的生词本到数据库
        sync_vocab_to_lazykindler()

        time.sleep(30)

def stop_background_task():
    global background_thread
    background_thread.do_run = False

background_thread = threading.Thread(target=background_task)
background_thread.do_run = True
background_thread.start()

atexit.register(stop_background_task)

app.add_url_rule('/api/book/upload', view_func=books.store_books, methods=['POST'])
app.add_url_rule('/api/book/all_meta', view_func=books.get_books_meta, methods=['GET'])
app.add_url_rule('/api/book/get/uuids', view_func=books.get_books_meta_by_uuids, methods=['GET'])
app.add_url_rule('/api/book/update', view_func=books.update_book_meta, methods=['POST'])
app.add_url_rule('/api/book/update/cover', view_func=books.update_book_cover, methods=['POST'])
app.add_url_rule('/api/book/cover', view_func=books.get_book_cover, methods=['GET'])
app.add_url_rule('/api/book/delete', view_func=books.delete_book, methods=['DELETE'])
app.add_url_rule('/api/book/delete/bykeyword', view_func=books.delete_book_by_keyword, methods=['DELETE'])
app.add_url_rule('/api/book/delete/all', view_func=books.delete_all_books, methods=['DELETE'])
app.add_url_rule('/api/book/delete/all/tmp', view_func=books.delete_all_tmp_books, methods=['DELETE'])
app.add_url_rule('/api/book/download', view_func=books.download_file, methods=['GET'])
app.add_url_rule('/api/book/download/all', view_func=books.download_all_files, methods=['GET'])
app.add_url_rule('/api/book/read/uuid/<uuid>/file.epub', view_func=books.download_file_for_read, methods=['GET'])

app.add_url_rule('/api/collection/create', view_func=collection.create_collection, methods=['POST'])
app.add_url_rule('/api/collection/get/books', view_func=collection.get_coll_books, methods=['GET'])
app.add_url_rule('/api/collection/get/all', view_func=collection.get_all_collections, methods=['GET'])
app.add_url_rule('/api/collection/get/multiple', view_func=collection.get_multiple_collections, methods=['GET'])
app.add_url_rule('/api/collection/delete/withoutitems', view_func=collection.delete_coll_without_items, methods=['DELETE'])
app.add_url_rule('/api/collection/delete/withitems', view_func=collection.delete_coll_with_items, methods=['DELETE'])
app.add_url_rule('/api/collection/update', view_func=collection.update_coll, methods=['POST'])
app.add_url_rule('/api/collection/add/book', view_func=collection.add_book_to_collection, methods=['POST'])
app.add_url_rule('/api/collection/update/cover', view_func=collection.update_coll_cover, methods=['POST'])
app.add_url_rule('/api/collection/delete/all', view_func=collection.delete_all_colls_hard, methods=['DELETE'])

app.add_url_rule('/api/clipping/get/all', view_func=clipping.get_all_clippings, methods=['GET'])
app.add_url_rule('/api/clipping/get/uuids', view_func=clipping.get_clipping_by_uuids, methods=['GET'])
app.add_url_rule('/api/clipping/delete', view_func=clipping.delete_clipping, methods=['DELETE'])
app.add_url_rule('/api/clipping/update', view_func=clipping.update_clipping, methods=['POST'])
app.add_url_rule('/api/clipping/delete/all', view_func=clipping.delete_all_clipping, methods=['DELETE'])
app.add_url_rule('/api/clipping/highlight/add', view_func=clipping.add_highlight_to_clipping, methods=['POST'])
app.add_url_rule('/api/clipping/highlight/delete', view_func=clipping.delete_highlight_from_clipping, methods=['POST'])
app.add_url_rule('/api/clipping/update/bykeyword', view_func=clipping.update_by_keyword, methods=['POST'])
app.add_url_rule('/api/clipping/create', view_func=clipping.create_clipping, methods=['POST'])
app.add_url_rule('/api/clipping/get/by/book_name', view_func=clipping.get_clippings_by_book_name, methods=['POST'])
app.add_url_rule('/api/clipping/count/get/by/book_name', view_func=clipping.get_clippings_count_by_book_name, methods=['POST'])
app.add_url_rule('/api/clipping/get/by/book_meta_uuid', view_func=clipping.get_clippings_by_book_meta_uuid, methods=['GET'])

app.add_url_rule('/api/comment/get/by_related_uuid', view_func=comment.get_comments_of_related_uuid, methods=['GET'])
app.add_url_rule('/api/comment/create', view_func=comment.create_comment, methods=['POST'])
app.add_url_rule('/api/comment/update', view_func=comment.update_comment, methods=['POST'])
app.add_url_rule('/api/comment/delete', view_func=comment.delete_comment, methods=['DELETE'])

app.add_url_rule('/api/book_clipping/get/all', view_func=books_clipping.get_all_book_clipping, methods=['GET'])
app.add_url_rule('/api/book_clipping/update', view_func=books_clipping.update_relation, methods=['POST'])

app.add_url_rule('/api/vocab/book/get', view_func=vocab.get_vocab_book_list, methods=['POST'])
app.add_url_rule('/api/vocab/word/get', view_func=vocab.get_vocab_words_by_book, methods=['POST'])
app.add_url_rule('/api/vocab/word/upsert', view_func=vocab.upsert_word_and_usage, methods=['POST'])
app.add_url_rule('/api/vocab/delete/all', view_func=vocab.delete_all_vocab_related_data, methods=['DELETE'])

app.add_url_rule('/api/setting/get', view_func=setting.get_setting, methods=['GET'])
app.add_url_rule('/api/setting/upsert', view_func=setting.upsert_setting, methods=['POST'])
