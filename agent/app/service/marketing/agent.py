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

async def run_with_tools(response: ChatCompletion, messages: list) -> str:
    message = response.choices[0].message
    messages.append(message.model_dump())

    if not message.tool_calls:
        return message.content

    for tool_call in message.tool_calls:
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments or "{}")

        # submit_ad → 인자 자체가 최종 결과, 2차 호출 없이 즉시 반환
        if name == "submit_ad":
            return json.dumps(args, ensure_ascii=False)

        result = TOOL_MAP[name](**args)
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result, ensure_ascii=False)
        })

    # get_exchange_rate 실행 후 submit_ad 강제 호출
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        tools=TOOLS,
        tool_choice={"type": "function", "function": {"name": "submit_ad"}},
    )

    message = response.choices[0].message
    if message.tool_calls:
        for tool_call in message.tool_calls:
            if tool_call.function.name == "submit_ad":
                return json.dumps(
                    json.loads(tool_call.function.arguments or "{}"),
                    ensure_ascii=False
                )

    return message.content

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
                "content": build_user_prompt(event_type, new, old)
            }
        ]
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        tools=TOOLS,
        tool_choice="required",
    )

    return await run_with_tools(response, messages)
