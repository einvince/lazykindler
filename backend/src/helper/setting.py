#!/usr/bin/env pytho3
# -*- coding: utf-8 -*-

from ..database.database import db


def get_setting(key):
    res = db.query(f"select value from setting where key='{key}';")
    return res[0]["value"] if res else ""

def upsert_setting(key, value):
    if get_setting(key):
        db.run_sql(f"update setting set value='{value}' where key='{key}';")
    else:
        db.insert_setting(
            key,
            value,
        )
