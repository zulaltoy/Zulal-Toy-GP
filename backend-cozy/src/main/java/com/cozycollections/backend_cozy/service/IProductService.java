package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.model.Product;
import com.cozycollections.backend_cozy.request.AddProductRequest;
import com.cozycollections.backend_cozy.request.ProductUpdateRequest;

import java.util.List;

public interface IProductService {
    List<Product> getAllProducts();
    List<Product> getProductsByCategoryAndBrand(String category, String brand);
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByBrandAndName(String brand, String name);
    List<Product> getProductsByBrand(String brand);
    List<Product> getProductsByName(String name);
    Product getProductById(Long productId);
    void deleteProductById(Long productId);
    Product addProduct(AddProductRequest product);
    Product updateProduct(ProductUpdateRequest product, Long productId);
}
