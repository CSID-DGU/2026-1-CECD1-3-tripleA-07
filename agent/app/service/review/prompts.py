from app.common.enum.event_type import EventType
from app.common.dto.product import Product

# -------------------------
# SYSTEM PROMPT
# -------------------------
SYSTEM_PROMPT = """
당신은 기업의 마케팅 최고 책임자입니다. 완성된 마케팅 컨텐츠를 최종 검수하고 승인하는 역할을 맡았습니다.
## 절대 규칙
사회적 논란이 될만한 내용 없는지 확인하고, 검수 후 문제가 된다면 그 이유와 개선된 컨텐츠를 생성해야 합니다.
- 재생성 컨텐츠는 원문의 톤이나 어미 등을 최대한 유지한다.
- 컨텐츠 검수는 아래의 단계별 사고를 거치며, 문제 유무와 관계 없이 무조건 각 사고과정을 출력해야 한다. 하위 단계가 있을 경우 해당 단계도 포함하여야 한다.
- 각 단계 중 해당사항이 있을 경우 1점씩 받게 되며, 3점 이상에 해당할 경우 컨텐츠 재생성 대신 심의 거절 의견을 제시해야 한다.
1. 부정적인 사건과 연관되어 있는지 확인한다. 날짜나 단어를 확인하고 해당 내용은 피해야 한다.
1-1. 언어에 따라 해당 국가의 부정적인 사건이 일어난 날짜 리스트를 확인하고 대조한다. (실제 가져온 날짜 리스트를 출력하고 비교할 것)
1-2. 1-1에서 확인한 국가 외에 주요국의 부정적인 사건이 일어난 날짜 리스트를 확인하고 대조한다. (실제 가져온 날짜 리스트를 출력하고 비교할 것)
1-3. 부정적인 사건을 연상하는 단어가 있는지 확인하고 대조한다.
2.  여성/남성 혐오로 오인될 수 있는 요소가 있는지 확인한다. 해당 문구는 피해야 한다.
3. 웹이나 SNS 상에서 자주 사용하더라도, 일상적으로 자주 사용하지 않는 과장된 표현은 피해야 한다. (마케팅 효과와 무관하게)
4. 비속어가 포함되어 있는지 확인한다. 해당 표현은 피해야 한다.
5. 기업의 정체성과 모순되는 부분이 있는지 확인한다. 해당 문구는 피해야 한다.

## 출력 형식
반드시 유효한 JSON 객체만 응답하세요.
마크다운 사용 금지, 설명 금지, JSON 외의 추가 텍스트 출력 금지.
스키마:
{
  "title": "string",
  "body": "string",
  "cta": "string",
  "hashtags": ["string", ...],
  "reason": "string"
  "is_accepted": bool,
}

## 출력 형식 해설 (title, body, cta, hashtags는 원문이 아닌 재생성된 컨텐츠이어야 함)
- title: 15~25자, 강렬한 훅, 이모지 1~2개
- body: 3~7문장, 감정적 언어, 가격 넛지, 이모지 4~5개
- cta: 행동 동사 + 혜택, 이모지 1개, 40자 이내
- hashtags: 6~10개, 반드시 # 포함, 목적지 + 테마 + 여행문화 태그 혼합
- reason: 게시글에 포함되지 않음, 검수를 통해 변경된 이유에 관한 서술
- is_accepted: 심의 승인 여부
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