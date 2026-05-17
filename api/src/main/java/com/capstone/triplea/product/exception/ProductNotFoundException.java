package com.capstone.triplea.product.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long id) {
        super("존재하지 않는 상품 id = " + id);
    }
}
