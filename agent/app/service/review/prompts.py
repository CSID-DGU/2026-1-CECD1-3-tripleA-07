from app.common.enum.event_type import EventType
from app.common.dto.product import Product

# -------------------------
# SYSTEM PROMPT
# -------------------------
SYSTEM_PROMPT = """
당신은 한국 여행 플랫폼을 위한 최고 수준의 SNS 카피라이터입니다.
당신의 역할은 페이스북 게시물 초안을 검수하고 최종 결과물을 작성하는 것입니다.

## 절대 규칙
- 제공된 데이터와 일치하지 않는 내용을 포함해서는 안됨
- 사회적 논란이 될만한 내용은 포함해서는 안됨
- 컨텐츠에 날짜가 포함된다면, 해당일이 부정적인 사건과 연관되어서는 안됨 (해당 날짜는 피해야 함)
- 정확히 같은 말이 아니더라도 논란을 연상할 수 있는 비슷한 어감의 문구가 포함되어서는 안됨
- 판단 기준은 아주 보수적이고 비판적이며, 언어에 민감한 사용자를 기준으로 함

## 게시글 구조
- location_tag: "{국가 또는 지역} {도시명}" (예시: "일본 후쿠오카") — 반드시 포함 
- title: 15~25자, 강렬한 훅, 이모지 1~2개 
- body: 3~7문장, 감정적 언어, 가격 넛지, 이모지 4~5개 
- cta: 행동 동사 + 혜택, 이모지 1개, 40자 이내 
- hashtags: 6~10개, 반드시 # 포함, 목적지 + 테마 + 여행문화 태그 혼합
- reason: 게시글에 포함되지 않음, 검수를 통해 변경된 이유에 관한 서술

## 출력 형식
반드시 유효한 JSON 객체만 응답하세요.
마크다운 사용 금지, 설명 금지, JSON 외의 추가 텍스트 출력 금지.
스키마:
{
  "location_tag": "string",
  "title": "string",
  "body": "string",
  "cta": "string",
  "hashtags": ["string", ...],
  "reason": "string"
}
"""

# -------------------------
# USER PROMPT BUILDER
# -------------------------
def build_user_prompt(
        event_type: EventType,
        product_new: Product,
        product_old: Product | None,
        marketing_content: str
) -> str:
    # 필요 시 벡터 검색 (marketing/prompts.py 참고)
    
    # 가격 정보
    list_price    = product_new.list_price
    current_price = product_new.price
    discount_amt  = list_price - current_price
    discount_rate = round(discount_amt / list_price * 100)

    price_context = (
        f"정가 {list_price:,}원 / 판매가 {current_price:,}원 "
        f"(할인 {discount_rate}% / {discount_amt:,}원 절약)"
    )

    if event_type == EventType.DISCOUNT and product_old:
        prev_price = product_old.price
        price_drop = prev_price - current_price
        drop_rate  = round(price_drop / prev_price * 100)
        price_context += (
            f"\n이번 추가 인하: {prev_price:,}원 → {current_price:,}원 "
            f"({drop_rate}%p 추가 인하 / {price_drop:,}원 추가 절약)"
        )

    # 최종 프롬프트 조립
    return f"""

## 상품 정보
- 상품명: {product_new.name}
- 여행지 소개: {product_new.description}
- 가격 정보: {price_context}
- 카테고리: {product_new.category}

## 컨텐츠 초안
{marketing_content}

위 정보를 바탕으로 Facebook 포스트용 JSON을 검수하세요.
"""