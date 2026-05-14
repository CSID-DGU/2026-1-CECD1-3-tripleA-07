package com.capstone.triplea.product;

import com.capstone.triplea.product.dto.ProductCreateRequestDto;
import com.capstone.triplea.product.dto.ProductResponseDto;
import com.capstone.triplea.product.dto.ProductUpdateRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Product", description = "상품 API")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // AME_PRD_001: Post api/products
    @PostMapping
    @Operation(summary = "상품 등록", description = "상품 등록을 수행하는 API")
    public ResponseEntity<ProductResponseDto> createProduct(
            @Valid @RequestBody ProductCreateRequestDto dto) {
        ProductResponseDto response = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // AME_PRD_002-1: PATCH api/products/{id} - 상품 수정
    @PatchMapping("/{id}")
    @Operation(summary = "상품 수정", description = "상품 ID로 상품 수정을 수행하는 API (null 필드 무시)")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequestDto dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    // AME_PRD_002-2: DELETE api/products/{id} - 상품 삭제
    @DeleteMapping("/{id}")
    @Operation(summary = "상품 삭제 API", description = "상품 ID로 상품 삭제를 수행하는 API")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // AME_PRD_003: GET api/products/{id} - 상품 전체 조회
}
