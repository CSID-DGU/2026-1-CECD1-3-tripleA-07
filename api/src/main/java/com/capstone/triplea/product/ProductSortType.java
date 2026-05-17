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
    CREATED_AT_DESC ("createdAt", Sort.Direction.DESC),
    PRICE_ASC ("price", Sort.Direction.ASC),
    PRICE_DESC ("price", Sort.Direction.DESC),
    NAME_ASC ("name", Sort.Direction.ASC),
    QUANTITY_DESC ("quantity", Sort.Direction.DESC);

    private final String field;
    private final Sort.Direction direction;

    public Sort toSort() {
        return Sort.by(direction, field);
    }
}