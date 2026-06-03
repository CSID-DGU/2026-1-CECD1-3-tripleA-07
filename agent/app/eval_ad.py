"""
eval_ad.py  —  광고 문구 평가기 (IFEval + LLM-as-Judge)

사용법:
    python eval_ad.py                        # 예시 광고로 바로 실행
    python eval_ad.py --input ad.json        # JSON 파일 입력
    python eval_ad.py --event DISCOUNT       # 이벤트 타입 지정 (NEW | DISCOUNT, 기본 NEW)

환경변수 (.env 또는 직접 설정):
    AI_ENDPOINT=https://inference.generativeai.us-chicago-1.oci.oraclecloud.com
    AI_API_KEY=...
    AI_MODEL=xai.grok-4.3
"""

import os, re, json, argparse
from dotenv import load_dotenv

# 기존
load_dotenv()

# 수정 — .env를 eval_ad.py 기준으로 탐색 (상위 폴더까지 올라가며 찾음)
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")        # 같은 폴더
load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")    # 한 단계 위
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")    # 두 단계 위
load_dotenv(dotenv_path=Path(__file__).resolve().parents[3] / ".env")    # 세 단계 위 (프로젝트 루트)

# ── 환경 변수 ──────────────────────────────────────────────────────────────
AI_ENDPOINT = os.getenv("AI_ENDPOINT")
AI_API_KEY  = os.getenv("AI_API_KEY")
AI_MODEL    = os.getenv("AI_MODEL")

# ── 예시 광고 (기본값) ─────────────────────────────────────────────────────
EXAMPLE_AD = {
    "location_tag": "일본 오사카",
    "title": "오사카 먹방+온천 이 조합 반칙 아님? 🍜",
    "body": (
        "아시아나 항공으로 편안하게 떠나는 오사카 교토 고베 온천 4일.\\n"
        "도톤보리 거리 음식과 오사카성 활기, 천연 온천까지 한 번에 즐기는 일정 감다살 인정?\\n"
        "벨뷰 가든 호텔과 이비스 우메다에서 편안한 휴식.\\n"
        "정가 대비 30만 원 바로 세이브💸 1,519,000원에 가이드 팁까지 포함!\\n"
        " @@아... 육즙 가득 함바그부터 야키니쿠 특식까지 섹시푸드 놓치지 말자! 📢 15석 마감 임박!"
    ),
    "cta": "프로필 링크에서 지금 확인하세요 ✈️",
    "hashtags": [
        "#오사카여행", "#교토여행", "#고베여행", "#온천여행",
        "#일본여행", "#가성비여행", "#도톤보리", "#오사카성"
    ],
}

# ══════════════════════════════════════════════════════════════════════════════
# 1. IFEval
# ══════════════════════════════════════════════════════════════════════════════

EMOJI_RE       = re.compile(r'[\U0001F300-\U0001FFFF\u2600-\u26FF\u2700-\u27BF]')
BANNED_EXPRS   = ["특별한 여행", "잊지 못할 추억", "설레는 마음으로", "아름다운 풍경", "행복한 시간"]
BANNED_CHAR_RE = re.compile(r'[\u3400-\u9FFF\u3040-\u30FF\u0E00-\u0E7F\u0600-\u06FF]')


def run_ifeval(ad: dict, event_type: str = "NEW") -> dict:
    """
    반환값:
        {
            "checks": { "IF-01_fields": True, ... },
            "score":  0.88,          # 통과 비율
            "passed": 14,
            "total":  16,
        }
    """
    checks: dict[str, bool] = {}

    title    = ad.get("title", "")
    body     = ad.get("body", "")
    cta      = ad.get("cta", "")
    hashtags = ad.get("hashtags", [])
    full     = title + body + cta

    # IF-01: 5필드 완전성
    checks["IF-01_fields_complete"] = all(
        k in ad for k in ["title", "body", "cta", "hashtags"]
    )

    # IF-02: title 길이 15~25자
    checks["IF-02_title_length"] = 15 <= len(title) <= 25

    # IF-03: title 이모지 1~2개
    checks["IF-03_title_emoji"] = 1 <= len(EMOJI_RE.findall(title)) <= 2

    # IF-04: body 문장 수 5~7개  (\\n 기준 분리)
    sentences = [s.strip() for s in body.split("\n") if s.strip()]
    checks["IF-04_body_sentences"] = 5 <= len(sentences) <= 7

    # IF-05: body 이모지 4~5개
    checks["IF-05_body_emoji"] = 4 <= len(EMOJI_RE.findall(body)) <= 5

    # IF-06: cta 40자 이내
    checks["IF-06_cta_length"] = len(cta) <= 40

    # IF-07: cta 이모지 1개
    checks["IF-07_cta_emoji"] = len(EMOJI_RE.findall(cta)) == 1

    # IF-08: hashtags 6~10개
    checks["IF-08_hashtag_count"] = 6 <= len(hashtags) <= 10

    # IF-09: 모든 해시태그 #으로 시작
    checks["IF-09_hashtag_prefix"] = bool(hashtags) and all(h.startswith("#") for h in hashtags)

    # IF-10: 금지 표현 미포함
    checks["IF-12_no_banned_expr"] = not any(b in full for b in BANNED_EXPRS)

    # IF-11: 금지 문자(한자·가나·태국어 등) 미포함
    checks["IF-13_no_banned_char"] = not BANNED_CHAR_RE.search(full)

    # IF-12: body에 @@ 포함
    checks["IF-14_body_contains_at"] = "@@" in body

    # IF-13: 이벤트별 검사
    # (NEW 전용): body에 신규/오픈/첫 출시 등의 표현이 있는지 확인
    if event_type == "NEW":
        checks["IF-15_new_product_mentioned"] = bool(
            re.search(
                r"(신규|새로운|첫\s*출시|오픈|런칭|신상|드디어)",
                body
            )
        )
    # (DISCOUNT 전용): body 전체에 가격 인하 숫자 포함
    elif event_type == "DISCOUNT":
        checks["IF-15_discount_price_mentioned"] = bool(
            re.search(r'\d[\d,]+원', body)
        )

    passed = sum(checks.values())
    total  = len(checks)
    return {
        "checks": checks,
        "score":  round(passed / total, 4),
        "passed": passed,
        "total":  total,
    }


# ══════════════════════════════════════════════════════════════════════════════
# 2. LLM-as-Judge
# ══════════════════════════════════════════════════════════════════════════════

JUDGE_SYSTEM = """당신은 냉정한 한국 여행 SNS 광고 카피라이팅 심사위원입니다.
절대 관대하게 평가하지 마세요. 5점은 업계 최고 수준의 카피에만 줍니다.
아래 6개 차원을 각각 1~5점으로 평가하고, 반드시 순수 JSON만 반환하세요.
마크다운 코드블록, 설명, 추가 텍스트 절대 금지.
 
[점수 기준 — 엄격하게 적용]
1점: 심각한 결함. 즉시 수정 필요
2점: 기준 미달. 전형적인 AI 생성 냄새, 뻔한 표현
3점: 보통. 나쁘지 않지만 기억에 남지 않음. 평균적인 광고
4점: 양호. 눈에 띄는 장점이 있으나 아쉬운 점 존재
5점: 탁월. 이 카테고리 최고 수준, 즉시 집행 가능
 
[평가 차원]
- hook_score      (1~5): 제목 후킹력.
    1=공지문/안내문 톤, 2=평범한 질문형, 3=흥미는 있으나 임팩트 부족,
    4=스크롤 멈추는 훅, 5=클릭 안 하면 손해라는 느낌
 
- tone_score      (1~5): SNS 친구 말투. @@는 Facebook 친구 태그 유도 문구이다. @@ 표현은 정상적인 마케팅 기법이며 플레이스홀더나 오타로 간주하지 마라.
    1=존댓말·공문체, 2=어색한 구어체 시도, 3=구어체이나 밋밋함,
    4=자연스러운 친구 말투, 5=밈·개성·리듬감까지 완벽
 
- factual_score   (1~5): 사실 충실도.
    1=없는 정보 창작·숫자 오류, 2=과장 심함, 3=대체로 맞으나 모호,
    4=상품 정보 충실히 반영, 5=핵심 포인트만 정확히 선별
 
- urgency_score   (1~5): 구매 긴급감.
    1=가격·잔여석·CTA 모두 없음, 2=가격만 언급, 3=가격+CTA 있으나 약함,
    4=가격 넛지+잔여석+CTA 갖춤, 5=지금 안 사면 손해라는 강한 심리 압박

- persuasion_score (1~5): 예약 유도.
    1 = 예약 의사가 전혀 안 생김, 2 = 관심은 가지만 행동 안 함,
    3 = 평범, 4 = 예약 고려 가능, 5 = 당장 클릭하고 싶음
 
- creative_score  (1~5): 창의성·개성.
    1=AI 생성 냄새 나는 뻔한 표현, 2=공식적 패턴 답습,
    3=시도는 있으나 참신하지 않음, 4=카테고리 맞춤 감성 살림,
    5=이 광고만의 독보적 언어·리듬·감성
 
- overall_score   (1~5): 위 5개 차원 종합. 단순 평균 아님 — 치명적 결함이 하나라도 있으면 최대 3점
 
[출력 JSON 스키마]
{
  "hook_score": int,
  "tone_score": int,
  "factual_score": int,
  "urgency_score": int,
  "creative_score": int,
  "persuasion_score": int,
  "overall_score": int,
  "reason": "한 줄 총평 — 가장 큰 문제점 중심으로 (60자 이내)",
  "improvement": "가장 즉각적인 개선 방법 1가지, 구체적으로 (60자 이내)"
}"""


def run_llm_judge(ad: dict, event_type: str = "NEW") -> dict | None:
    """OCI OpenAI 호환 엔드포인트로 LLM-as-Judge 실행"""
    if not AI_API_KEY:
        print("  ⚠️  AI_API_KEY 없음 → LLM-as-Judge 건너뜀")
        return None

    try:
        from openai import OpenAI
    except ImportError:
        print("  ⚠️  openai 패키지 없음 → pip install openai")
        return None

    client = OpenAI(
        api_key=AI_API_KEY,
        base_url=f"{AI_ENDPOINT}",
    )

    user_content = f"""[이벤트 타입]: {event_type}
[평가 대상 광고]:
{json.dumps(ad, ensure_ascii=False, indent=2)}"""

    try:
        resp = client.chat.completions.create(
            model=AI_MODEL,
            max_tokens=512,
            messages=[
                {"role": "system", "content": JUDGE_SYSTEM},
                {"role": "user",   "content": user_content},
            ],
        )
        raw = resp.choices[0].message.content.strip()

        # 마크다운 코드블록 방어
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        return json.loads(raw.strip())

    except json.JSONDecodeError as e:
        print(f"  ❌ Judge JSON 파싱 실패: {e}")
        return None
    except Exception as e:
        print(f"  ❌ Judge API 실패: {e}")
        print("AI_API_KEY:", os.getenv("AI_API_KEY", "❌ 못 찾음")[:10] + "...")
        print(".env 탐색 경로:", Path(__file__).resolve().parents[3] / ".env")
        return None


# ══════════════════════════════════════════════════════════════════════════════
# 3. 결과 출력
# ══════════════════════════════════════════════════════════════════════════════

CHECK_LABELS = {
    "IF-01_fields_complete":              "4필드 완전성",
    "IF-02_title_length":                 "title 길이 (15~25자)",
    "IF-03_title_emoji":                  "title 이모지 (1~2개)",
    "IF-04_body_sentences":               "body 문장 수 (5~7개)",
    "IF-05_body_emoji":                   "body 이모지 (4~5개)",
    "IF-06_cta_length":                   "cta 길이 (40자 이내)",
    "IF-07_cta_emoji":                    "cta 이모지 (1개)",
    "IF-08_hashtag_count":                "해시태그 수 (6~10개)",
    "IF-09_hashtag_prefix":               "#으로 시작",
    "IF-11_no_raw_newline":               "raw 개행 없음",
    "IF-12_no_banned_expr":               "금지 표현 미포함",
    "IF-13_no_banned_char":               "금지 문자 미포함",
    "IF-14_body_contains_at":             "body @@ 포함",
    "IF-15_new_product_mentioned":          "[NEW] body 내 특정 단어 포함",
    "IF-15_discount_price_mentioned":     "[DISCOUNT] body 내 가격 인하 숫자 포함",
}

JUDGE_LABELS = {
    "hook_score":     "후킹력",
    "tone_score":     "SNS 말투",
    "factual_score":  "사실 충실도",
    "urgency_score":  "구매 긴급감",
    "creative_score": "창의성·개성",
    "persuasion_score": "예약 유도",
    "overall_score":  "종합 완성도",
}


def print_report(ad: dict, event_type: str, if_result: dict, lj_result: dict | None):
    W = 56
    print()
    print("╔" + "═" * W + "╗")
    print("║" + " 광고 문구 평가 리포트".center(W) + "║")
    print("╠" + "═" * W + "╣")

    # 입력 요약
    print(f"║  이벤트 타입 : {event_type:<{W-17}}║")
    title_disp = ad.get('title','')[:W-17]
    print(f"║  title       : {title_disp:<{W-17}}║")

    # ── IFEval ──
    print("╠" + "═" * W + "╣")
    print("║" + " ① IFEval (규칙 준수)".center(W) + "║")
    print("╠" + "─" * W + "╣")
    for key, passed in if_result["checks"].items():
        label  = CHECK_LABELS.get(key, key)
        mark   = "✅" if passed else "❌"
        line   = f"  {mark} {label}"
        print(f"║{line:<{W+1}}║")   # 이모지 폭 보정

    score_pct = f"{if_result['score']:.0%}"
    summary = f"  결과: {if_result['passed']}/{if_result['total']} 통과  ({score_pct})"
    bar_len  = int(if_result['score'] * 20)
    bar      = "█" * bar_len + "░" * (20 - bar_len)
    print("╠" + "─" * W + "╣")
    print(f"║  [{bar}] {score_pct:<6}  {if_result['passed']}/{if_result['total']} 통과  ║")

    # ── LLM-as-Judge ──
    print("╠" + "═" * W + "╣")
    print("║" + " ② LLM-as-Judge (품질 평가)".center(W) + "║")
    print("╠" + "─" * W + "╣")
    if lj_result:
        score_keys = [k for k in JUDGE_LABELS]
        total_lj   = sum(lj_result.get(k, 0) for k in score_keys)
        max_lj     = len(score_keys) * 5

        for key, label in JUDGE_LABELS.items():
            score = lj_result.get(key, 0)
            stars = "★" * score + "☆" * (5 - score)
            line  = f"  {label:<10} {stars}  {score}/5"
            print(f"║{line:<{W}}║")

        print("╠" + "─" * W + "╣")
        lj_pct = total_lj / max_lj
        bar_len = int(lj_pct * 20)
        bar     = "█" * bar_len + "░" * (20 - bar_len)
        lj_pct_str = f"{lj_pct:.0%}"
        print(f"║  [{bar}] {lj_pct_str:<6}  {total_lj}/{max_lj} 점      ║")
        print("╠" + "─" * W + "╣")

        reason = lj_result.get("reason", "")[:W-6]
        print(f"║  총평: {reason:<{W-7}}║")
        improve = lj_result.get("improvement", "")[:W-10]
        print(f"║  개선: {improve:<{W-7}}║")
    else:
        print("║  (LLM-as-Judge 결과 없음 — API 키 확인)".ljust(W) + "  ║")

    print("╚" + "═" * W + "╝")
    print()


# ══════════════════════════════════════════════════════════════════════════════
# 4. 진입점
# ══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="광고 문구 평가기")
    parser.add_argument("--input",  type=str, default=None,
                        help="평가할 광고 JSON 파일 경로 (없으면 예시 광고 사용)")
    parser.add_argument("--event",  type=str, default="NEW",
                        choices=["NEW", "DISCOUNT"],
                        help="이벤트 타입 (기본: NEW)")
    parser.add_argument("--output", type=str, default=None,
                        help="결과를 저장할 JSON 파일 경로 (선택)")
    args = parser.parse_args()

    # 광고 로드
    if args.input:
        with open(args.input, encoding="utf-8") as f:
            ad = json.load(f)
        print(f"📂 {args.input} 로드 완료")
    else:
        ad = EXAMPLE_AD
        print("📝 예시 광고로 실행합니다. (--input 으로 파일 지정 가능)")

    event_type = args.event

    # IFEval
    print("\n🔍 IFEval 평가 중...")
    if_result = run_ifeval(ad, event_type)

    # LLM-as-Judge
    print("🤖 LLM-as-Judge 평가 중...")
    lj_result = run_llm_judge(ad, event_type)

    # 출력
    print_report(ad, event_type, if_result, lj_result)

    # 결과 저장 (선택)
    if args.output:
        result = {
            "event_type": event_type,
            "ad":         ad,
            "ifeval":     if_result,
            "llm_judge":  lj_result,
        }
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"💾 결과 저장 완료 → {args.output}")


if __name__ == "__main__":
    main()