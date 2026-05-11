package com.capstone.triplea.product;

import com.capstone.triplea.product.dto.ProductCreateRequestDto;
import com.capstone.triplea.product.dto.ProductResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
// @Transactional
@RequiredArgsConstructor
public class ProductService {
//    @Autowired
//    ProductRepository productRepository;
//    @Autowired
//    ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    // ADM_PRD_001: 상품 등록
    @Transactional
    public ProductResponseDto createProduct(ProductCreateRequestDto dto) {
//        Product result = productRepository.save(productMapper.toEntity(dto));
//        return productMapper.toDto(result);
        Product product = productMapper.toEntity(dto);
        Product saved =  productRepository.save(product);
        return new ProductResponseDto(saved);
    }
}
