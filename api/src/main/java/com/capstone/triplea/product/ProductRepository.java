package com.capstone.triplea.product;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // 기본 CRUD (save, findById, findAll, deleteById)는 JpaRepository가 제공
    // [TODO] 검색 기능은 나중에 추가
}
