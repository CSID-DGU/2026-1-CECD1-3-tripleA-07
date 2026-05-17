package com.capstone.triplea.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // keyword 없음: Pageable을 받으면 정렬 + 페이지네이션 모두 처리 가능
    Page<Product> findAll(Pageable pageable);

    // keyword 있음: 상품명 부분 검색 + 정렬
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
