import json

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.common.enum.event_type import EventType
from app.common.dto.product import Product
from app.service.marketing import product_marketing
from app.service.review import product_reviewing
from app.util.discord_logger import discord_send_message
from app.util.sns_adapter import call_facebook_api

router = APIRouter(
    prefix="/api/v1/agent",
    tags=["v1"],
)

class AgentEventRequest(BaseModel):
    # 이벤트 유형
    event_type: EventType = Field(alias="eventType")

    # 상품 ID
    product_id: int = Field(alias="productId")

    # 신규 상품 정보
    product_new: Product = Field(alias="productNew")
    # 기존 상품 정보 (DISCOUNT의 경우)
    product_old: Product | None = Field(alias="productOld", default=None)

    # 샘플 적용 여부
    is_sample: bool = Field(alias="isSample", default=False)

class ReviewRequest(AgentEventRequest):
    # 마케팅 json 데이터
    marketing_json: str = Field(alias="marketingJson")

@router.post("/marketing")
async def start_agent_flow(body: AgentEventRequest):
    # 이벤트 수신 메시지 출력
    discord_send_message(
        "🚀 Agent Automation Flow Started",
        f"- {body.event_type} 유형 이벤트 수신\n- productId: {body.product_id}",
        None,
        3447003
    )
    ai_response: str = await product_marketing(body.event_type, body.is_sample, body.product_new, body.product_old)
    # 생성 완료 메시지 출력
    discord_send_message(
        "✨ Marketing Content Generated",
        ai_response,
        None,
        9109759
    )
    ai_response = await product_reviewing(body.event_type, body.is_sample, body.product_new, body.product_old, ai_response)
    # 검수 완료 메시지 출력
    discord_send_message(
        "🔍 Content reviewed and re-generated",
        ai_response,
        None,
        16753920
    )
    ai_response_json = json.loads(ai_response)
    is_accepted = ai_response_json.get("is_accepted", "")
    if is_accepted:
        content = "\n".join([
                ai_response_json.get("title", ""),
                ai_response_json.get("body", ""),
                ai_response_json.get("cta", ""),
                " ".join(ai_response_json.get("hashtags", []))
            ])
        post_url = call_facebook_api(content)
        # SNS 발행 메시지 출력
        discord_send_message(
            "📢 SNS Publishing Completed",
            ai_response_json.get("title", ""),
            post_url,
            7855479
        )
    else:
        post_url = None
        # 심의 거절 메시지 출력
        discord_send_message(
            "🚨 Content Rejected",
            ai_response_json.get("reason", ""),
            post_url,
            15548997
        )
    # 임시 return 값
    return {
        "eventType": body.event_type,
        "productId": body.product_id,
        "productNew": body.product_new,
        "productOld": body.product_old,
        "aiResponse": ai_response,
        "post_url": post_url
    }

# 테스트를 위한 엔드포인트
@router.post("/review")
async def start_review_flow(body: ReviewRequest):
    ai_response: str = await product_reviewing(body.event_type, body.is_sample, body.product_new, body.product_old, body.marketing_json)
    # 임시 return 값
    return {
        "eventType": body.event_type,
        "productId": body.product_id,
        "productNew": body.product_new,
        "productOld": body.product_old,
        "aiResponse": ai_response
    }