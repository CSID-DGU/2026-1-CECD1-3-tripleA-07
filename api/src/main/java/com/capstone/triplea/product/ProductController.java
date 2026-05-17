package com.capstone.triplea.product;

import com.capstone.triplea.product.dto.ProductCreateRequestDto;
import com.capstone.triplea.product.dto.ProductResponseDto;
import com.capstone.triplea.product.dto.ProductUpdateRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Product", description = "상품 API")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ADM_PRD_001: POST api/v1/products
    @PostMapping
    @Operation(summary = "상품 등록", description = "상품 등록을 수행하는 API")
    public ResponseEntity<ProductResponseDto> createProduct(
            @Valid @RequestBody ProductCreateRequestDto dto) {
        ProductResponseDto response = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ADM_PRD_002-1: PATCH api/v1/products/{id} - 상품 수정
    @PatchMapping("/{id}")
    @Operation(summary = "상품 수정", description = "상품 ID로 상품 수정을 수행하는 API (null 필드 무시)")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequestDto dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    // ADM_PRD_002-2: DELETE api/v1/products/{id} - 상품 삭제
    @DeleteMapping("/{id}")
    @Operation(summary = "상품 삭제", description = "상품 ID로 상품 삭제를 수행하는 API")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // ADM_PRD_003: GET api/v1/products - 상품 조회 (정렬 + 검색 + 페이지네이션)
    @GetMapping
    @Operation(
            summary = "상품 목록 조회",
            description = "keyword: 상품명 검색 | sort (정렬 종류): createdAtDesc(기본) | priceAsc | priceDesc | nameAsc | quantityDesc"
    )
    public ResponseEntity<Page<ProductResponseDto>> getProducts(
            // 검색어 없으면 -> 전체
            @RequestParam(required = false) String keyword,

            // 잘못된 값 -> 400 에러 자동 반환
            // 기본값 -> CREATED_AT_DESC (최신순)
            @RequestParam(defaultValue = "CREATED_AT_DESC") ProductSortType sort,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(productService.getProducts(keyword, sort, page, size));
    }
}
