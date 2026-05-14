package com.capstone.triplea.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // 기본 CRUD (save, findById, findAll, deleteById)는 JpaRepository가 제공
    // ✅ Pageable을 받으면 정렬 + 페이지네이션 모두 처리 가능
    // 현재는 정렬만 사용. 2단계(검색)에서 keyword 파라미터 추가 예정
    Page<Product> findAll(Pageable pageable);
}
