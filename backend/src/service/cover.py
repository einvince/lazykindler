
from ..helper.common import insert_cover
from ..database.database import db

from ..helper import common

# 更新封面
def upsert_cover(uuid, content):
    cover = common.get_cover(uuid)
    if len(cover) == 0:
        insert_cover(content, uuid)
    else:
        db.run_sql(f"update cover set content='{content}' where uuid='{uuid}'")
    return "success"
