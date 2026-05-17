package com.capstone.triplea.product;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;

/*
 * 상품 목록 정렬 기준 Enum
 * :Controller @RequestParam에서 문자열 -> Enum 자동 변환
 */

@Getter
@RequiredArgsConstructor
public enum ProductSortType {
    CREATED_AT_DESC ("createdAt", Sort.Direction.DESC), // 최신 등록순 (기본)
    PRICE_ASC ("price", Sort.Direction.ASC),    // 가격 낮은순
    PRICE_DESC ("price", Sort.Direction.DESC),  // 가격 높은순
    NAME_ASC ("name", Sort.Direction.ASC),      // 상품명 가나다순
    QUANTITY_DESC ("quantity", Sort.Direction.DESC);    // 재고 많은순

    private final String field;
    private final Sort.Direction direction;

    public Sort toSort() {
        return Sort.by(direction, field);
    }
}