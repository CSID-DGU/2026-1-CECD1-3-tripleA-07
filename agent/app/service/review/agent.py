import os
import json
from dotenv import load_dotenv

from app.common.enum.event_type import EventType
from app.common.dto.product import Product
from app.service.review.prompts import SYSTEM_PROMPT, build_user_prompt
from app.service.marketing.product_samples import PRODUCT_SAMPLES
from app.util.ai_client import get_ai_client

load_dotenv()

AI_MODEL = os.getenv("AI_MODEL")

client = get_ai_client()

# 필요 시 툴 사용 (marketing/agent.py 참고)

async def product_reviewing(
        event_type: EventType,
        is_sample: bool,
        product_new: Product,
        product_old: Product | None,
        marketing_content: str
    ):
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
                "content": build_user_prompt(event_type, new, old, marketing_content)
            }
        ]
    response = await client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        temperature=0.7,
        n=5
    )

    selected_idx = None
    for idx, choice in enumerate(response.choices):
        result_json = json.loads(choice.message.content)
        # is_accepted 여부 체크
        if not(result_json["is_accepted"]):
            selected_idx = idx
            break  # 가장 먼저 나온 거절 기준
        else:
            if selected_idx is None:
                selected_idx = idx

    return response.choices[selected_idx].message.content
