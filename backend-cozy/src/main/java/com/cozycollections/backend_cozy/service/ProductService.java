package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.model.Product;
import com.cozycollections.backend_cozy.request.AddProductRequest;
import com.cozycollections.backend_cozy.request.ProductUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    //private final ProductRepository productRepository;
    @Override
    public List<Product> getAllProducts() {
        return List.of();
    }

    @Override
    public List<Product> getProductsByCategoryAndBrand(String category, String brand) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByBrandAndName(String brand, String name) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByBrand(String brand) {
        return List.of();
    }

    @Override
    public List<Product> getProductsByName(String name) {
        return List.of();
    }

    @Override
    public Product getProductById(Long productId) {
        return null;
    }

    @Override
    public void deleteProductById(Long productId) {

    }

    @Override
    public Product addProduct(AddProductRequest product) {
        return null;
    }

    @Override
    public Product updateProduct(ProductUpdateRequest product, Long productId) {
        return null;
    }
}
