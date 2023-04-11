#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from flask import request
from ..service import setting


def get_setting():
    key = request.args.get('key')
    return setting.get_setting(key)


def upsert_setting():
    content = request.json
    key = content['key']
    value = content['value']
    return setting.upsert_setting(key, value)
