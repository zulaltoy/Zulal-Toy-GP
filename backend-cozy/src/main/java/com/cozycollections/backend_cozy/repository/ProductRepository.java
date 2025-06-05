package com.cozycollections.backend_cozy.repository;

import com.cozycollections.backend_cozy.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByName(String name);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%',:name,'%'))")
    List<Product> findByProductName(String name);

    List<Product> findByCategoryName(String category);

    List<Product> findAllByCategoryId(Long categoryId);
}
