package com.capstone.triplea.common.validator;

// ProductCreateRequestDto & ProductUpdateRequestDto
// 두 DTO를 하나의 PriceRangeValidator로 검증하기 위한 인터페이스

public interface PriceRangeValidatable {
    Integer getListPrice();
    Integer getPrice();
}
