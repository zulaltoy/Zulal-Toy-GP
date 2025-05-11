package com.cozycollections.backend_cozy.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cozycollections.backend_cozy.dtos.ProductDto;
import com.cozycollections.backend_cozy.model.Product;
import com.cozycollections.backend_cozy.request.AddProductRequest;
import com.cozycollections.backend_cozy.request.ProductUpdateRequest;
import com.cozycollections.backend_cozy.response.ApiResponse;
import com.cozycollections.backend_cozy.service.Interfaces.IProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/products")
public class ProductController {
    private final IProductService productService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDto> productDtos = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Products fetched successfully", productDtos));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        ProductDto productDto = productService.convertProductToDto(product);
        return ResponseEntity.ok(new ApiResponse("Product fetched successfully", productDto));
    }

    @PutMapping("/{productId}/update")
    public ResponseEntity<ApiResponse> updateProduct(@RequestBody ProductUpdateRequest productUpdateRequest,
            @PathVariable Long productId) {
        Product product = productService.updateProduct(productUpdateRequest, productId);
        ProductDto productDto = productService.convertProductToDto(product);
        return ResponseEntity.ok(new ApiResponse("Product updated successfully", productDto));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody AddProductRequest addProductRequest) {
        Product product = productService.addProduct(addProductRequest);
        ProductDto productDto = productService.convertProductToDto(product);
        return ResponseEntity.ok(new ApiResponse("Product added successfully", productDto));
    }

    @DeleteMapping("/{productId}/delete")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long productId) {
        productService.deleteProductById(productId);
        return ResponseEntity.ok(new ApiResponse("Product deleted successfully", productId));

    }

    @GetMapping("/by/brand-and-name")
    public ResponseEntity<ApiResponse> getProductsByBrandAndName(@RequestParam String brandName,
            @RequestParam String productName) {

        List<Product> products = productService.getProductsByBrandAndName(brandName, productName);
        List<ProductDto> productDtos = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Products by brand fetched successfully", productDtos));
    }

    @GetMapping("/by-brand")
    public ResponseEntity<ApiResponse> findProductsByBrand(@RequestParam String brandName) {
        List<Product> products = productService.getProductsByBrand(brandName);
        List<ProductDto> productDtos = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Products by brand name fetched successfully", productDtos));
    }

    @GetMapping("/by/category-and-brand")
    public ResponseEntity<ApiResponse> getProductsByCategoryAndBrand(@RequestParam String categoryName,
            @RequestParam String brandName) {
        List<Product> products = productService.getProductsByCategoryAndBrand(categoryName, brandName);
        List<ProductDto> productDtos = productService.getConvertedProducts(products);
        return ResponseEntity
                .ok(new ApiResponse("Products by category and brand name fetched successfully", productDtos));
    }

    @GetMapping("/by-name/{name}")
    public ResponseEntity<ApiResponse> getProductsByName(@PathVariable String name) {
        List<Product> products = productService.getProductsByName(name);
        List<ProductDto> productDtos = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Products by name fetched successfully", productDtos));
    }

    @GetMapping("/by-category/{category}")
    public ResponseEntity<ApiResponse> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        List<ProductDto> productDtos = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Products by category fetched successfully", productDtos));
    }

}
