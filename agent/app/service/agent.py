import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

AI_ENDPOINT = os.getenv("AI_ENDPOINT")
AI_API_KEY = os.getenv("AI_API_KEY")
AI_MODEL = os.getenv("AI_MODEL")

# OpenAI async client
client = AsyncOpenAI(
    api_key=AI_API_KEY,
    base_url=AI_ENDPOINT
)

async def new_product_marketing():
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a marketing assistant for new products."
            },
            {
                "role": "user",
                "content": "신제품 마케팅 전략을 3줄로 요약해줘"
            }
        ]
    )

    return response


async def discount_product_marketing():
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a marketing assistant for discounted products."
            },
            {
                "role": "user",
                "content": "할인 상품 마케팅 전략을 3줄로 요약해줘"
            }
        ]
    )

    return response.choices[0].message.content