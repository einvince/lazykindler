from flask import request
from ..service import chatgpt


def get_awnser_from_chatgpt():
    content = request.json
    keyword_type = content['keyword_type']
    keyword = content['keyword']
    return chatgpt.get_awnser_from_chatgpt(keyword_type, keyword)
