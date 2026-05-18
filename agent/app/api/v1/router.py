from typing import Any, Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.common.enum.event_type import EventType
from app.service import (
    new_product_marketing,
    discount_product_marketing,
)

router = APIRouter(
    prefix="/api/v1",
    tags=["v1"],
)

class AgentEventRequest(BaseModel):
    # 이벤트 유형
    event_type: EventType = Field(alias="eventType")

    # 상품 ID
    product_id: int = Field(alias="productId")

    # 할인 이벤트 시 변경된 이전 값들
    changed: Optional[Dict[str, Any]] = None

@router.post("/agent")
async def start_agent_flow(body: AgentEventRequest):
    # 신제품 이벤트
    if body.event_type == EventType.NEW:
        ai_response: str = await new_product_marketing(body.product_id, body.event_type)
        # 임시 return 값
        return {
            "event_type": body.event_type,
            "product_id": body.product_id,
            "ai_response": ai_response
        }
    # 할인 이벤트
    elif body.event_type == EventType.DISCOUNT:
        ai_response: str = await discount_product_marketing(body.product_id, body.event_type)
        # 임시 return 값
        return {
            "event_type": body.event_type,
            "product_id": body.product_id,
            "changed": body.changed,
            "ai_response": ai_response
        }
    else:
        return {"message": "unknown event"}