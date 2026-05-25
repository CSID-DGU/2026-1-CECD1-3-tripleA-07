import os
import oracledb
from dotenv import load_dotenv

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