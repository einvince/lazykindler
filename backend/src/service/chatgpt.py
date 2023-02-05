#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

import openai
from src.instance.config import config


def get_awnser_from_chatgpt(keyword_type, keyword):
    openai.api_key = config['chatgpt_key']['key']

    if len(keyword) > 4000:
        # 太长了chatgpt会报错
        keyword = keyword[:4000]

    prompt = ""
    if keyword_type == "书名":
        prompt="Awnser in Chinese。the book name is {}, Please introduce in detail.\nA:".format(keyword)
    if keyword_type == "作者":
        prompt="Awnser in Chinese。There is an author whose name is {}, he/she writes book, Please introduce in detail.\nA:".format(keyword)
    
    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0,
            max_tokens=1000,
            top_p=1,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            timeout=60,
            stop=["\n"],
        )
        answer = response["choices"][0]["text"].strip()
    except Exception as e:
        return "使用chatgpt查询出错, 请重试"
    return answer
