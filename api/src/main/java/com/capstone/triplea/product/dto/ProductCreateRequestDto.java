package com.capstone.triplea.product.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;

/*
등록 요청 시 클라이언트가 보내는 데이터
price는 listPrice와 discountRate로 서버에서 계산하기 때문에 받지 않음
*/

@Getter
@Setter
public class ProductCreateRequestDto {
    @NotBlank(message = "상품명 입력 필수")
    @Length(max = 255)
    private String name;

    @Size(max = 500, message = "상품 설명은 500자 이하")
    private String description;

    @NotNull(message = "정가 입력 필수")
    @Min(value = 0, message = "정가는 0 이상")
    private Integer listPrice;

    @Min(value = 0, message = "판매가는 0 이상")
    private Integer price;

    @NotNull(message = "수량 입력 필수")
    @Min(value = 0, message = "수량은 0 이상")
    private Integer quantity;

    private String imageUrl;

    private String category;
}
