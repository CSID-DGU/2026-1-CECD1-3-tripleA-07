package com.capstone.triplea.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/*
수정 요청 DTO: 모든 필드 선택적 (PATCH 방식)
null인 필드는 수정하지 않음
*/

@Getter
@Setter
public class ProductUpdateRequestDto {

    @Length(max=225)
    private String name;

    @Size(max = 500, message = "상품 설명은 500자 이하")
    private String description;

    @Min(value = 0, message = "정가는 0 이상")
    private Integer listPrice;

    @Min(value = 0, message = "판매가는 0 이상")
    private Integer price;

    @Min(value = 0, message = "수량은 0 이상")
    private Integer quantity;

    private String imageUrl;
    private String category;
}