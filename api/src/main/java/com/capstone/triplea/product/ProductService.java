package com.capstone.triplea.product;

import com.capstone.triplea.product.dto.ProductCreateRequestDto;
import com.capstone.triplea.product.dto.ProductResponseDto;
import com.capstone.triplea.product.dto.ProductUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    // AME_PRD_003-1: 상품 전체 목록 조회 + (기본) 최신순 정렬
    /*
     * Pageable pageable -> 페이지네이션+정렬
     * String name -> 검색 조건 (Specification 또는 QueryDSL)
     */
    @Transactional
    public List<ProductResponseDto> getProducts() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toDto)
                .toList();
    }
    // [TODO] 정렬 방법 선택 가능하게 구현
    /*
     * 1. priceAsc: 가격 낮은순
     * 2. priceDesc: 가격 높은순
     * 3. (nameAsc: 상품명 가나다순) 필요한가,,?
     * 4. QuantityDesc: 재고 많은순
     */

    // AME_PRD_003-2: 상품명 검색

    // AME_PRD_003-3: 페이지네이션

    // 공통: 없으면 404
    private Product findProductThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(
                        "상품을 찾을 수 없음 (id = " + id + ")"
                ));
    }
}
