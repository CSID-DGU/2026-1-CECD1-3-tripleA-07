package com.capstone.triplea.product.dto;

import com.capstone.triplea.common.validator.GreaterThan;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;

/*
등록 요청 시 클라이언트가 보내는 데이터
price는 listPrice와 discountRate로 서버에서 계산하기 때문에 받지 않음
*/

@Getter
@Setter
@GreaterThan(
        field = "listPrice",
        comparedField = "price",
        message = "판매가는 정가 이하여야 합니다"
)
public class ProductCreateRequestDto {
    @NotBlank(message = "상품명 입력 필수")
    @Length(max = 255)
    private String name;

    @Size(max = 1500, message = "상품 설명은 1500자 이하")
    private String description;

    @NotNull(message = "정가 입력 필수")
    @Min(value = 1, message = "정가는 1 이상")
    private Integer listPrice;

    @NotNull(message = "판매가 입력 필수")
    @Min(value = 0, message = "판매가는 0 이상")
    private Integer price;

    @NotNull(message = "수량 입력 필수")
    @Min(value = 0, message = "수량은 0 이상")
    private Integer quantity;

    @URL(message = "URL 형식 필수")
    @Size(max = 255, message = "이미지 URL은 255자 이하")
    private String imageUrl;

    @Size(max = 255, message = "카테고리는 255자 이하")
    private String category;
}
