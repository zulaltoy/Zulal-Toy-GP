package com.cozycollections.backend_cozy.service.Interfaces;

import com.cozycollections.backend_cozy.dtos.ProductDto;
import com.cozycollections.backend_cozy.model.Product;
import com.cozycollections.backend_cozy.request.AddProductRequest;
import com.cozycollections.backend_cozy.request.ProductUpdateRequest;

import java.util.List;

public interface IProductService {
    List<Product> getAllProducts();

    List<Product> getProductsByCategory(String category);

    List<Product> getProductsByName(String name);

    Product getProductById(Long productId);

    void deleteProductById(Long productId);

    Product addProduct(AddProductRequest productRequest);

    Product updateProduct(ProductUpdateRequest productRequest, Long productId);

    List<ProductDto> getConvertedProducts(List<Product> products);

    ProductDto convertProductToDto(Product product);

    List<Product> getProductsByCategoryId(Long categoryId);
}
