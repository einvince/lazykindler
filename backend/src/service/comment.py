from flask import jsonify

from ..util.util import generate_uuid
from ..database.database import db


def get_comments_of_related_uuid(related_uuid):
    data = db.query(f"select * from comment where related_uuid='{related_uuid}';")
    data.sort(key=lambda x: x['create_time'], reverse=False)
    if data is None:
        data = []
    return jsonify(data)


def delete_comment(uuid):
    db.run_sql(f"delete from comment where uuid='{uuid}'")
    return "success"


def create_comment(related_uuid, content):
    db.insert_comment(generate_uuid(), related_uuid, content)
    return "success"


def update_comment(uuid, new_content):
    db.run_sql(f"update comment set content='{new_content}' where uuid='{uuid}'")
    return "success"
