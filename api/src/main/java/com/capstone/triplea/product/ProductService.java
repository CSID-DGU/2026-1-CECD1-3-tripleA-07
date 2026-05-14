package com.capstone.triplea.product;

import com.capstone.triplea.product.dto.ProductCreateRequestDto;
import com.capstone.triplea.product.dto.ProductResponseDto;
import com.capstone.triplea.product.dto.ProductUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    // ADM_PRD_001: 상품 등록
    @Transactional
    public ProductResponseDto createProduct(ProductCreateRequestDto dto) {
        Product product = productMapper.toEntity(dto);
        Product saved =  productRepository.save(product);
        return productMapper.toDto(saved);
    }

    // ADM_PRD_002-1: 상품 수정
    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductUpdateRequestDto dto) {
        Product product = findProductThrow(id);
        productMapper.updateEntity(dto, product); // null 필드는 자동으로 건너뜀
        return productMapper.toDto(product);
    }

    // AME_PRD_002-2: 상품 삭제

    // AME_PRD_003: 상품 조회

    // 공통: 없으면 404
    private Product findProductThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(
                        "상품을 찾을 수 없음 (id = " + id + ")"
                ));
    }
}
