from flask import jsonify
import hashlib
import uuid
import os
import glob
import pathlib

# 支持的电子书格式
supportedBookFormat = {
    ".mobi": True,
    ".azw3": True,
}

def ls_books(dir):
    files = list()
    for item in os.listdir(dir):
        abspath = os.path.join(dir, item)
        try:
            if os.path.isdir(abspath):
                files = files + ls_books(abspath)
            else:
                if pathlib.Path(abspath).suffix in supportedBookFormat:
                    files.append(abspath)
                else:
                    print("ls_books. 忽略文件: ", abspath)
        except FileNotFoundError as err:
            print('invalid directory\n', 'Error: ', err)
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
    for _char in strs:
        if not '\u4e00' <= _char <= '\u9fa5':
            return False
    return True


# 返回 list1 去掉 list2 元素后的数组
def difference(list1, list2):
    list_difference = []
    for item in list1:
        if item not in list2:
            list_difference.append(item)
    return list_difference


def utf8len(s):
    return len(s.encode('utf-8'))