package com.capstone.triplea.product;

import com.capstone.triplea.product.dto.ProductCreateRequestDto;
import com.capstone.triplea.product.dto.ProductResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Product", description = "상품 API")
public class ProductController {
    @Autowired
    ProductService productService;

    @PostMapping("")
    @Operation(summary = "상품 등록 API", description = "상품 등록을 수행하는 API입니다.")
    public ProductResponseDto register(@RequestBody @Valid ProductCreateRequestDto request) {
        return productService.createProduct(request);
    }
}
