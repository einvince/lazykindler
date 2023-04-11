#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-


from ..helper import setting

def get_setting(key):
    return setting.get_setting(key)

def upsert_setting(key, value):
    setting.upsert_setting(key, value)
    return "success"


