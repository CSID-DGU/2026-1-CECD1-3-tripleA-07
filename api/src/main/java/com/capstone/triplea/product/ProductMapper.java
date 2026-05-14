package com.capstone.triplea.product;

import com.capstone.triplea.product.dto.ProductCreateRequestDto;
import com.capstone.triplea.product.dto.ProductResponseDto;
import com.capstone.triplea.product.dto.ProductUpdateRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponseDto toDto(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toEntity(ProductCreateRequestDto dto);

    // 기존 엔티티에 수정 필드만 덮어쓰기
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ProductUpdateRequestDto dto, @MappingTarget Product product);
}
