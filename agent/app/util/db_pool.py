import os
import oracledb
from dotenv import load_dotenv

from app.common.enum.event_type import EventType

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_DSN = os.getenv("DB_DSN")
DB_CONFIG_DIR = os.getenv("DB_CONFIG_DIR")
DB_WALLET_LOCATION = os.getenv("DB_WALLET_LOCATION")
DB_WALLET_PASSWORD = os.getenv("DB_WALLET_PASSWORD")

pool = oracledb.create_pool(
    user=DB_USER,
    password=DB_PASSWORD,
    dsn=DB_DSN,
    config_dir=DB_CONFIG_DIR,
    wallet_location=DB_WALLET_LOCATION,
    wallet_password=DB_WALLET_PASSWORD,
)

def get_connection():
    return pool.acquire()

def close_pool():
    pool.close()

def search_vectordb(cursor: oracledb.Cursor, event_type: EventType, input_vec):
    cursor.setinputsizes(query_vector=oracledb.DB_TYPE_VECTOR)
    cursor.execute("SELECT ID, CONTENT_JSON, VECTOR_DISTANCE(EMBEDDING, :query_vector, COSINE) AS score FROM MARKETING_EXAMPLE WHERE MARKETING_TYPE = :marketing_type ORDER BY score FETCH FIRST 5 ROWS ONLY;", query_vector=input_vec, marketing_type=event_type)