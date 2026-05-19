import os
import json
from dotenv import load_dotenv
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletion

from app.common.enum.event_type import EventType
from app.common.dto.product import Product
from app.service.prompts import SYSTEM_PROMPT, build_user_prompt
from app.service.tools import TOOLS, TOOL_MAP
from app.service.product_samples import PRODUCT_SAMPLES

load_dotenv()

AI_ENDPOINT = os.getenv("AI_ENDPOINT")
AI_API_KEY = os.getenv("AI_API_KEY")
AI_MODEL = os.getenv("AI_MODEL")

POKE_API_URL = os.getenv("POKE_API_URL")

# OpenAI async client
client = AsyncOpenAI(
    api_key=AI_API_KEY,
    base_url=AI_ENDPOINT
)

async def run_with_tools(response: ChatCompletion, messages: list):
    message = response.choices[0].message

    # assistant 메시지를 저장
    messages.append(message.model_dump())

    # tool call 없으면 종료
    if not message.tool_calls:
        return response

    for tool_call in message.tool_calls:
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments or "{}")

        result = TOOL_MAP[name](**args)

        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result, ensure_ascii=False)
        })

    # 2차 호출
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        tools=TOOLS
    )

    return response

async def product_marketing(event_type: EventType, is_sample: bool, product_new: Product, product_old: Product | None):
    sample_num = 0 if event_type == EventType.NEW else 1
    messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": build_user_prompt(event_type, PRODUCT_SAMPLES[sample_num])
            }
        ]
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        tools=TOOLS
    )

    response = await run_with_tools(response, messages)

    return response.choices[0].message.content
