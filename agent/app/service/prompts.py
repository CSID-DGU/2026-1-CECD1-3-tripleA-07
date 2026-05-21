from app.common.enum.event_type import EventType
from app.common.dto.product import Product

# -------------------------
# CATEGORY TONE GUIDE
# -------------------------
CATEGORY_TONE_GUIDE = {
    "일본": {
        "target":   "20~30대 / 직장인 / 첫 해외여행러",
        "tone":     "친근하고 설레는 / 가성비 강조 / 음식·감성·일상 탈출 소재",
        "hook":     "가깝고, 맛있고, 또 가고 싶은 나라",
        "location_prefix": "일본",
    },
    "유럽": {
        "target":   "30~40대 / 버킷리스트 여행자 / 신혼",
        "tone":     "프리미엄·낭만 / 평생 한 번의 경험 강조 / 예술·건축·미식 소재",
        "hook":     "언젠가 꼭 가야 할 그 도시",
        "location_prefix": "유럽",
    },
    "동남아": {
        "target":   "20대 / 가성비 여행자 / 커플·친구 그룹",
        "tone":     "활기차고 자유로운 / 리조트·해변·야시장 소재 / 휴양 강조",
        "hook":     "지금 당장 떠나고 싶은 휴양지",
        "location_prefix": "동남아",
    },
    "미주": {
        "target":   "30~40대 / 장거리 여행 마니아 / 어학연수·워킹홀리데이 경험자",
        "tone":     "스케일 크고 자유로운 / 로드트립·자연·도시 문화 소재 / 도전적 감성",
        "hook":     "한 번쯤은 미국 횡단, 지금이 그 때",
        "location_prefix": "미국",
    },
    "중국": {
        "target":   "30~50대 / 역사·문화 여행자 / 가족 여행객",
        "tone":     "웅장하고 신비로운 / 역사·유적·음식 소재 / 다채로운 문화 강조",
        "hook":     "5,000년 역사가 살아 숨쉬는 나라",
        "location_prefix": "중국",
    },
    "대만": {
        "target":   "20~30대 / 미식 여행자 / 감성 여행러",
        "tone":     "친근하고 따뜻한 / 야시장·음식·골목 감성 소재 / 일본+중화 문화 혼합 강조",
        "hook":     "야시장 냄새와 골목 감성, 대만은 또 가고 싶은 곳",
        "location_prefix": "대만",
    },
    "홍콩·마카오": {
        "target":   "20~40대 / 도시 여행자 / 미식·쇼핑 마니아",
        "tone":     "세련되고 화려한 / 야경·미식·카지노·쇼핑 소재 / 동서양 문화 교차 강조",
        "hook":     "동양과 서양이 만나는 밤, 홍콩",
        "location_prefix": "홍콩·마카오",
    },
    "중동·두바이": {
        "target":   "30~40대 / 럭셔리 여행자 / 인플루언서·신혼",
        "tone":     "럭셔리·압도적 스케일 / 사막·초고층 빌딩·쇼핑몰 소재 / 비일상적 경험 강조",
        "hook":     "사막 위에 세워진 미래 도시",
        "location_prefix": "중동",
    },
    "호주·뉴질랜드": {
        "target":   "20~30대 / 워킹홀리데이·장기 여행자 / 자연 애호가",
        "tone":     "광활하고 청량한 / 자연·해변·액티비티 소재 / 힐링·해방감 강조",
        "hook":     "지구 반대편, 가장 맑은 공기가 있는 곳",
        "location_prefix": "호주·뉴질랜드",
    },
    "인도·남아시아": {
        "target":   "20~30대 / 배낭여행자 / 문화·종교 탐방객",
        "tone":     "신비롭고 강렬한 / 색채·향신료·유적 소재 / 인생 여행 감성",
        "hook":     "한 번 가면 평생 잊을 수 없는 강렬함",
        "location_prefix": "인도·남아시아",
    },
    "국내": {
        "target":   "전 연령대 / 주말 여행자 / 가족·커플",
        "tone":     "따뜻하고 편안한 / 계절·자연·음식·힐링 소재 / 부담 없는 일탈 강조",
        "hook":     "멀리 갈 필요 없어, 여기도 충분히 좋아",
        "location_prefix": "국내",
    },
}
DEFAULT_TONE = {
    "target":   "여행을 즐기는 모든 연령대",
    "tone":     "설레고 따뜻한 / 여행의 설렘 강조",
    "hook":     "새로운 곳으로 떠나는 특별한 여행",
    "location_prefix": "",
}

# -------------------------
# FEW-SHOT EXAMPLES
# -------------------------
FEW_SHOT_NEW = """
아래는 출력 예시입니다. 반드시 동일한 JSON 구조로 출력하세요.
 
[예시 1 - 신규 상품 / 일본 오사카 / 좌석 여유]
{
  "location_tag": "일본 오사카",
  "title": "오사카, 먹으러 갑니다 🍜",
  "body": "퇴근하고 비행기 타면 다음 날 아침은 타코야키. 도톤보리 네온사인 아래, 맥주 한 캔 들고 아무 골목이나 들어가도 맛집인 도시. 일상이 너무 지루할 때, 오사카가 정답이에요. 출시 특가 89,900원, 지금 자리 잡으세요.",
  "cta": "👉 지금 예약하고 오사카 골목 탐험 시작",
  "hashtags": ["#오사카여행", "#일본여행", "#도톤보리", "#먹스타그램", "#여행스타그램", "#오사카맛집", "#직장인여행", "#일탈"]
}
 
[예시 2 - 신규 상품 / 유럽 파리 / 좌석 여유]
{
  "location_tag": "유럽 파리",
  "title": "파리는 역시, 파리였다 🗼",
  "body": "에펠탑 앞에 서는 순간, 사진으로 천 번 봤던 그 장면이 실제가 됩니다. 루브르에서 길을 잃고, 센 강변 카페에서 아무것도 안 해도 괜찮은 도시. 평생 한 번은 가야 한다고 생각만 했다면, 지금이 그 때예요. 출시 특가로 버킷리스트 1번 지워드릴게요.",
  "cta": "👉 평생 한 번, 파리 여행 지금 예약",
  "hashtags": ["#파리여행", "#유럽여행", "#에펠탑", "#버킷리스트", "#신혼여행", "#여행스타그램", "#파리감성", "#유럽감성"]
}
"""

FEW_SHOT_DISCOUNT = """
아래는 출력 예시입니다. 반드시 동일한 JSON 구조로 출력하세요.
 
[예시 1 - 할인 상품 / 일본 후쿠오카 / 좌석 여유]
{
  "location_tag": "일본 후쿠오카",
  "title": "후쿠오카, 지금이 역대 최저가예요 🔥",
  "body": "75,000원이었는데 69,900원으로 내렸어요. 5,100원 아낀 걸로 하카타 라멘 한 그릇 먹고 오세요. 비행기로 1시간 거리, 마음만 먹으면 이번 주말에도 갈 수 있는 곳이에요. 이 가격에 이 거리면 더 이상 망설일 이유가 없잖아요.",
  "cta": "👉 69,900원 지금 바로 예약 (오늘만 이 가격)",
  "hashtags": ["#후쿠오카여행", "#일본여행", "#하카타라멘", "#가성비여행", "#특가", "#여행스타그램", "#일본특가", "#꿀팁"]
}
 
[예시 2 - 할인 상품 / 일본 교토 / 마감 임박]
{
  "location_tag": "일본 교토",
  "title": "교토 잔여 12석 🍂 지금 아니면 없어요",
  "body": "단풍 물드는 아라시야마, 이끼 낀 돌담 사이로 이어지는 기온 골목. 교토는 '언젠가'가 아니라 딱 지금 가야 하는 도시예요. 105,000원에서 95,800원으로 내렸고, 남은 좌석은 12석이에요. 이 글 보고 있는 사람 중에 먼저 잡는 사람이 가는 거예요.",
  "cta": "👉 지금 바로 좌석 잡기 (12석 마감되면 끝)",
  "hashtags": ["#교토여행", "#일본여행", "#아라시야마", "#기온거리", "#마감임박", "#특가", "#여행스타그램", "#일본감성"]
}
"""

# -------------------------
# SYSTEM PROMPT
# -------------------------
SYSTEM_PROMPT = """
You are a top-tier SNS copywriter for a Korean travel platform. Your job is to write Facebook posts that make people stop scrolling and book immediately.
 
Your copy must feel alive — specific, sensory, emotionally urgent. Generic travel writing is a failure.
 
## The #1 rule: No safe, bland copy
- Banned phrases: "특별한 여행", "잊지 못할 추억", "설레는 마음으로", "아름다운 풍경", "행복한 시간"
- Every sentence must create a vivid image or emotion — smell, taste, sound, a specific feeling
- Write like a friend who just got back from the trip, not a brochure
 
## Absolute rules
- Allowed scripts: Korean (한글) and English only. Every other script is strictly forbidden — this includes Chinese characters (漢字/汉字), Japanese kana (ひらがな・カタカナ), Vietnamese (ắ ộ ề …), Arabic, Thai, and any other non-Korean/English writing system. Place names and food names must be written in Korean transliteration (e.g. 타코야키, 하카타, 에펠탑), never in their native script.
- Never copy the description field verbatim — reinterpret with concrete sensory language
- Never output any field outside the specified JSON schema
- Numeric values (prices, discounts, seat counts) must exactly match the input data — never invent or round them
- The tone MUST match the category tone guide provided in the user prompt
- hashtags must ALL start with # (e.g. "#오사카여행", never "오사카여행")
 
## Facebook post structure
- location_tag: "{국가 또는 지역} {도시명}" (e.g. "일본 후쿠오카") — always include, never omit
- title: 15~25자, 강렬한 훅, 이모지 1~2개
- body: 3~5문장, 감각적·감정적 언어, 마지막 문장은 가격 넛지
- cta: 행동 동사 + 혜택, 이모지 1개, 40자 이내
- hashtags: 6~10개, 반드시 # 포함, 목적지 + 테마 + 여행문화 태그 혼합
 
## Output format
Respond ONLY with a valid JSON object. No markdown, no explanation, no extra text outside the JSON.
Schema:
{
  "location_tag": "string",
  "title": "string",
  "body": "string",
  "cta": "string",
  "hashtags": ["string", ...]
}
"""

# -------------------------
# URGENCY LEVEL HELPER
# -------------------------
def _urgency_label(quantity: int) -> str:
    if quantity < 20:
        return f"🚨 잔여 {quantity}석 — 마감 직전"
    elif quantity < 50:
        return f"📢 잔여 {quantity}석 — 마감 임박"
    else:
        return f"잔여 {quantity}석"


# -------------------------
# USER PROMPT BUILDER
# -------------------------
def build_user_prompt(
        event_type: EventType,
        product_new: Product,
        product_old: Product | None,
) -> str:

    # 1) 카테고리별 톤 가이드 주입
    tone = CATEGORY_TONE_GUIDE.get(product_new.category, DEFAULT_TONE)
    location_tag_hint = f"{tone['location_prefix']} {product_new.name.replace('여행', '').strip()}"

    # 2) 가격 정보 사전 계산 (LLM에게 산술 위임 금지)
    list_price      = product_new.list_price
    current_price   = product_new.price
    launch_discount = list_price - current_price
    launch_rate     = round(launch_discount / list_price * 100)

    price_context = (
        f"정가 {list_price:,}원 / 판매가 {current_price:,}원 "
        f"(출시 특가 {launch_rate}% 할인 / {launch_discount:,}원 절약)"
    )

    if event_type == EventType.DISCOUNT and product_old:
        prev_price      = product_old.price
        price_drop      = prev_price - current_price
        drop_rate       = round(price_drop / prev_price * 100)
        price_context  += (
            f"\n이번 추가 인하: {prev_price:,}원 → {current_price:,}원 "
            f"({drop_rate}%p 추가 인하 / {price_drop:,}원 추가 절약)"
        )

    # 3) 좌석 urgency 레이블
    urgency = _urgency_label(product_new.quantity)

    # 4) 이벤트별 핵심 지시
    if event_type == EventType.NEW:
        few_shot   = FEW_SHOT_NEW
        event_rule = f"""
## 이번 요청: 신규 상품 출시 포스트
- 신규 출시 특가임을 자연스럽게 녹일 것 (할인 이벤트처럼 과하게 강조하지 말 것)
- body 첫 문장은 반드시 구체적인 감각(냄새, 맛, 소리, 장면)으로 시작할 것 — "설레는" "아름다운" 같은 추상어 금지
- description의 장소명·음식명·키워드를 감성 언어로 재해석해 body에 녹일 것
- 좌석 수가 50석 미만이면 urgency를 body 또는 cta에 반드시 반영할 것
- location_tag는 반드시 포함할 것: "{location_tag_hint}"
"""
    elif event_type == EventType.DISCOUNT:
        few_shot   = FEW_SHOT_DISCOUNT
        event_rule = f"""
## 이번 요청: 가격 인하 할인 포스트
- 가격 인하 사실을 title 또는 body 첫 문장에서 명확히 언급할 것
- 절약 금액({launch_discount:,}원)과 인하율을 구체적 숫자로 body에 포함할 것
- 좌석 urgency를 반드시 cta 또는 body 마지막 문장에 포함할 것
- "지금 아니면 없다"는 심리적 긴박감을 자연스럽게 조성할 것
- location_tag는 반드시 포함할 것: "{location_tag_hint}"
- hashtags는 반드시 # 기호로 시작할 것 (예: "#오사카여행")
"""
    else:
        raise ValueError(f"Unsupported event_type: {event_type}")

    # 5) 최종 프롬프트 조립
    return f"""
{few_shot}

## 카테고리 톤 가이드
- 카테고리: {product_new.category}
- 주요 타깃: {tone['target']}
- 어조·소재: {tone['tone']}
- 감성 훅 레퍼런스: "{tone['hook']}"
- 권장 location_tag: "{location_tag_hint}"

## 상품 정보
- 상품명: {product_new.name}
- 여행지 소개 (재해석 소재로만 활용): {product_new.description}
- 가격 정보: {price_context}
- 좌석 현황: {urgency}
- 카테고리: {product_new.category}

{event_rule}

위 정보를 바탕으로 Facebook 포스트용 JSON을 생성하세요.
"""