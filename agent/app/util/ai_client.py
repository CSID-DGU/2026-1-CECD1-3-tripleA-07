import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

AI_ENDPOINT = os.getenv("AI_ENDPOINT")
AI_API_KEY = os.getenv("AI_API_KEY")

# OpenAI async client
client = AsyncOpenAI(
    api_key=AI_API_KEY,
    base_url=AI_ENDPOINT
)

def get_ai_client():
    return client

async def close_ai_client():
    client.close()