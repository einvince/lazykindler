import uuid
import os
import pathlib
import hashlib
import epub_meta
import difflib
import re

from flask import jsonify


def get_book_meta_info(book_path):
    return epub_meta.get_epub_metadata(
        book_path, read_cover_image=True, read_toc=True)


# 支持的电子书格式
supportedBookFormat = {
    ".mobi": True,
    ".azw3": True,
}


def if_ext_supported_book_ext(ext):
    return ext.lower() in supportedBookFormat


def ls_books(dir):
    files = []
    for item in os.listdir(dir):
        abspath = os.path.join(dir, item)
        try:
            if os.path.isdir(abspath):
                files = files + ls_books(abspath)
            elif if_ext_supported_book_ext(pathlib.Path(abspath).suffix):
                files.append(abspath)
        except FileNotFoundError as err:
            print('invalid directory\n', 'Error: ', err)
    return files


def ls_moon_reader_clippings(dir):
    files = []
    for item in os.listdir(dir):
        abspath = os.path.join(dir, item)
        if os.path.isdir(abspath):
            for filepath in files:
                _, file_extension = os.path.splitext(filepath)
                if file_extension == ".mrexpt":
                    files.append(filepath)
        else:
            _, file_extension = os.path.splitext(abspath)
            if file_extension == ".mrexpt":
                files.append(abspath)
    return files


def handle_error(err_msg):
    status_code = 500
    success = False
    response = {
        'success': success,
        'error': {
            'message': err_msg
        }
    }

    return jsonify(response), status_code


def generate_uuid():
    return str(uuid.uuid4())


def get_md5(filepath):
    md5_hash = hashlib.md5()
    with open(filepath, "rb") as f:
        # Read and update hash in chunks of 4K
        for byte_block in iter(lambda: f.read(4096), b""):
            md5_hash.update(byte_block)
        return md5_hash.hexdigest()


def get_now():
    from datetime import datetime
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def is_all_chinese(strs):
    return all('\u4e00' <= _char <= '\u9fa5' for _char in strs)


# 返回 list1 减去 list2 后的数组
def difference(list1, list2):
    return [item for item in list1 if item not in list2]


def utf8len(s):
    return len(s.encode('utf-8'))


def add_md5_to_filename(filepath):
    filename, file_extension = os.path.splitext(filepath)
    md5 = get_md5(filepath)

    con_str = "______"
    if con_str + md5 + file_extension not in filepath:
        return filename + con_str + md5 + file_extension
    return filepath


def remove_md5_from_filename(filepath):
    filename, file_extension = os.path.splitext(filepath)
    return filename.split("______", 1)[0] + file_extension


def get_md5_from_filename(filepath):
    filename, _ = os.path.splitext(filepath)
    return filename.split("______", 1)[1]


def convert_str_to_list(str_data):
    return [a for a in str_data.split(";") if a != ""]


# 转换文件格式时，文件名中可能会包含各种特殊字符，
# 如果未做处理, 转换命令可能会执行失败
def escape_string(str):
    return str.translate(str.maketrans({"-":  r"\-",
                                        "]":  r"\]",
                                        "[":  r"\[",
                                        "【":  r"\【",
                                        "】":  r"\】",
                                        "&":  r"\&",
                                        ".":  r"\.",
                                        "/":  r"\/",
                                        "•":  r"\•",
                                        "\\": r"\\",
                                        "^":  r"\^",
                                        "$":  r"\$",
                                        "(":  r"\(",
                                        ")":  r"\)",
                                        "《":  r"\《",
                                        "》":  r"\》",
                                        "*":  r"\*",
                                        ".":  r"\.",
                                        "*":  r"\*",
                                        "+":  r"\+",
                                        "?":  r"\?",
                                        "{":  r"\{",
                                        "}":  r"\}",
                                        "|":  r"\|",
                                        ",":  r"\,",
                                        "!":  r"\!",
                                        "~":  r"\~",
                                        ";":  r"\;",
                                        "、":  r"\、",
                                        "`":  r"\`",
                                        "·":  r"\·",
                                        })
                         )



def string_similarity(s1, s2):
    """
    计算两个字符串的相似度
    """
    seq = difflib.SequenceMatcher(None, s1, s2)
    return seq.ratio()

def compare_strings_with_similarity(similarity, s1, s2):
    """
    比较两个字符串的相似度

    similarity 是一个0到1之间的小数
    """
    len1 = len(s1)
    len2 = len(s2)

    if len1 < len2:
        s1, s2 = s2, s1
        len1, len2 = len2, len1

    intersection = set(s1).intersection(set(s2))
    if len(intersection) >= similarity * len(s2):
        return True

    s1_count = sum(ch in s2 for ch in s1)
    s2_count = sum(ch in s1 for ch in s2)
    if s1_count / len1 >= similarity or s2_count / len2 >= similarity:
        return True

    similarity_value = string_similarity(s1, s2)
    return similarity_value >= similarity

def compare_strings_ignore_special_chars(s1, s2):
    # 书名或者作者命中，可能包含特殊字符，导致无法进行比较
    # 这里去掉任何特殊字符后比较是否相等
    s1 = re.sub(r'\W+', '', s1).lower()
    s2 = re.sub(r'\W+', '', s2).lower()
    return s1 == s2

def remove_special_chars_from_str(string):
    return re.sub(r'\W+', '', string)
