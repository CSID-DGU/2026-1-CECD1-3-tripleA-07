package com.capstone.triplea.product;

import com.capstone.triplea.product.dto.ProductCreateRequestDto;
//import com.capstone.triplea.product.dto.ProductResponseDto;
//import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

//@Mapper(componentModel = "spring")
//public interface ProductMapper {
//    ProductResponseDto toDto(Product product);
//    Product toEntity(ProductCreateRequestDto dto);
//}

// DTO를 Entity로 변환하는 로직을 분리하는 클래스

@Component
public class ProductMapper {
    public Product toEntity(ProductCreateRequestDto dto) {
        // 판매가 계산: 정가 * (1-할인율)
        int price = (int) Math.round(dto.getListPrice()*(1-dto.getDiscountRate()));

        return Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .listPrice(dto.getListPrice())
                .discountRate(dto.getDiscountRate())
                .price(price)
                .quantity(dto.getQuantity())
                .imageUrl(dto.getImageUrl())
                .category(dto.getCategory())
                .build();
        // id와 createdAt은 Product 파일의 @PrePersist에서 자동 세팅
    }
}
