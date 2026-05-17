package com.capstone.triplea.product;

import com.capstone.triplea.product.dto.ProductCreateRequestDto;
import com.capstone.triplea.product.dto.ProductResponseDto;
import com.capstone.triplea.product.dto.ProductUpdateRequestDto;
import com.capstone.triplea.product.exception.ProductNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    // ADM_PRD_002-2: 상품 삭제
    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProductThrow(id);
        productRepository.delete(product);
    }

    // ADM_PRD_003: 상품 전체 목록 조회 + (기본) 최신순 정렬 + 검색
    /*
     * Pageable pageable -> 페이지네이션+정렬
     * String name -> 검색 조건 (Specification 또는 QueryDSL)
     */
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> getProducts(
            String keyword, ProductSortType sortType, int page, int size) {
        // Sort sorting = resolveSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortType.toSort());

        // keyword 유무에 따라 분기
        Page<Product> result = (keyword != null && !keyword.isBlank())
                ? productRepository.findByNameContainingIgnoreCase(keyword, pageable)
                : productRepository.findAll(pageable);

        return result.map(productMapper::toDto);
    }

    // 공통: 없으면 404
    private Product findProductThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
