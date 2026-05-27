package com.capstone.triplea.product.dto;

import com.capstone.triplea.common.validator.PriceRangeValidatable;
import com.capstone.triplea.common.validator.ValidPriceRange;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;

/*
* 수정 요청 DTO: 모든 필드 선택적 (PUT 방식)
* - 필수값: @NotNull로 강제
* - 선택값: null 허용 (내보내지 않으면 null로 저장)
*/

@Getter
@Setter
@ValidPriceRange
public class ProductUpdateRequestDto implements PriceRangeValidatable {

    // 필수값: null 비허용
    @NotNull(message = "상품명은 필수")
    @Length(max=225)
    private String name;

    @NotNull(message = "정가는 필수")
    @Min(value = 1, message = "정가는 1 이상")
    private Integer listPrice;

    @NotNull(message = "판매가는 필수")
    @Min(value = 0, message = "판매가는 0 이상")
    private Integer price;

    @NotNull(message = "수량은 필수")
    @Min(value = 0, message = "수량은 0 이상")
    private Integer quantity;

    // 선택값: null 허용
    @Size(max = 1500, message = "상품 설명은 1500자 이하")
    private String description;

    @URL(message = "URL 형식 필수")
    @Size(max = 255, message = "이미지 URL은 255자 이하")
    private String imageUrl;

    @Size(max = 255, message = "카테고리는 255자 이하")
    private String category;
}