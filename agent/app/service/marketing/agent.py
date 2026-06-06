import os
import json
from dotenv import load_dotenv
from openai.types.chat import ChatCompletion

from app.common.enum.event_type import EventType
from app.common.dto.product import Product
from app.service.marketing.prompts import SYSTEM_PROMPT, build_user_prompt
from app.service.marketing.tools import TOOLS, TOOL_MAP
from app.service.marketing.product_samples import PRODUCT_SAMPLES
from app.util.ai_client import get_ai_client

load_dotenv()

AI_MODEL = os.getenv("AI_MODEL")

POKE_API_URL = os.getenv("POKE_API_URL")

client = get_ai_client()

async def run_with_tools(response: ChatCompletion, messages: list):
    for _ in range(5):  # 최대 5회 (무한 루프 방지)
        message = response.choices[0].message
        messages.append(message.model_dump())

        if not message.tool_calls:
            return response

        for tool_call in message.tool_calls:
            name = tool_call.function.name
            args = json.loads(tool_call.function.arguments or "{}")

            try:
                result = TOOL_MAP[name](**args)
            except Exception as e:
                result = {"error": str(e)}

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result, ensure_ascii=False)
            })

        response = await client.chat.completions.create(
            model=AI_MODEL,
            messages=messages,
            tools=TOOLS
        )

    return response

async def product_marketing(event_type: EventType, is_sample: bool, product_new: Product, product_old: Product | None):
    # 파라미터에 따라 샘플 데이터로 테스트 가능
    if is_sample:
        new = PRODUCT_SAMPLES[0] if event_type == EventType.NEW else PRODUCT_SAMPLES[1]
        old = None if event_type == EventType.NEW else PRODUCT_SAMPLES[2]
    else:
        new = product_new
        old = product_old

    messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": f"""
                    상품명: {new.name}
                    카테고리: {new.category}
                    설명: {new.description}
                    필요하면 get_exchange_rate 툴을 호출하세요.
                    """
            }
        ]
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        tools=TOOLS,
    )

    response = await run_with_tools(response, messages)

    return response.choices[0].message.content
