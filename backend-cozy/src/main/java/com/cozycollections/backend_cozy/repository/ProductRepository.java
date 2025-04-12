package com.cozycollections.backend_cozy.repository;

import com.cozycollections.backend_cozy.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByNameAndBrand(String name, String brand);
    List<Product> findByBrand(String brand);
    List<Product> findByNameAndBrand(String name, String brand);
    List<Product> findByCategoryNameAndBrand(String categoryName, String brand);
    List<Product> findByCategoryName(String categoryName);
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%',:name,'%'))")
    List<Product> findByProductName(String productName);
}
