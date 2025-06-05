package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.dtos.ImageDto;
import com.cozycollections.backend_cozy.dtos.ProductDto;
import com.cozycollections.backend_cozy.model.*;
import com.cozycollections.backend_cozy.repository.*;
import com.cozycollections.backend_cozy.request.AddProductRequest;
import com.cozycollections.backend_cozy.request.ProductUpdateRequest;
import com.cozycollections.backend_cozy.service.Interfaces.IProductService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;
    private final ImageRepository imageRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryName(category);
    }

    @Override
    public List<Product> getProductsByName(String name) {
        return Optional.ofNullable(productRepository.findByProductName(name))
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }
    @Override
    public List<Product> findDistinctProductsByName(){
        List<Product> products = getAllProducts();
        Map<String, Product> distinctProductMap = products.stream()
                .collect(Collectors.toMap(
                        Product :: getName,
                        product -> product,
                        (existing, replacement) -> existing));
        return new ArrayList<>(distinctProductMap.values());
    }

    @Override
    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    @Override
    public void deleteProductById(Long productId) {

        productRepository.findById(productId)
                .ifPresentOrElse(product -> {
                    List<CartItem> cartItems = cartItemRepository.findCartItemByProductId(productId);
                    cartItems.forEach(cartItem -> {
                        Cart cart = cartItem.getCart();
                        cart.removeItem(cartItem);
                        cartItemRepository.delete(cartItem);
                    });

                    List<OrderItem> orderItems = orderItemRepository.findOrderItemByProductId(productId);
                    orderItems.forEach(orderItem -> {
                        orderItem.setProduct(null);
                        orderItemRepository.save(orderItem);
                    });
                    Optional.ofNullable(product.getCategory())
                            .ifPresent(category -> category.getProducts().remove(product));
                    product.setCategory(null);
                    productRepository.deleteById(product.getId());
                }, () -> {
                    throw new EntityNotFoundException("Product not found!");
                });
    }

    @Override
    public Product addProduct(AddProductRequest productRequest) {
        if (productExists(productRequest.getName())) {
            throw new EntityExistsException(productRequest.getName() + "Product already exists");
        }
        Category category = Optional.ofNullable(categoryRepository.findByName(productRequest.getCategory().getName()))
                .orElseGet(() -> {
                    Category newCategory = new Category(productRequest.getCategory().getName());
                    return categoryRepository.save(newCategory);
                });
        productRequest.setCategory(category);
        return productRepository.save(createProduct(productRequest, category));

    }

    private boolean productExists(String name) {
        return productRepository.existsByName(name);
    }

    public Product createProduct(AddProductRequest productRequest, Category category) {
        return new Product(
                productRequest.getName(),
                productRequest.getDescription(),
                productRequest.getPrice(),
                productRequest.getInventory(),
                productRequest.getMaterial(),
                productRequest.getProductCode(),
                productRequest.getColor(),
                productRequest.getWidth(),
                productRequest.getHeight(),
                productRequest.getWidthUnit(),
                productRequest.getHeightUnit(),
                productRequest.getLength(),
                productRequest.getLengthUnit(),
                productRequest.getWeight(),
                category,
                productRequest.getWeightUnit()

        );

    }

    @Override
    public Product updateProduct(ProductUpdateRequest productRequest, Long productId) {
        return productRepository.findById(productId)
                .map(existingProduct -> updateExistingProduct(existingProduct, productRequest))
                .map(productRepository::save)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    private Product updateExistingProduct(Product existingProduct, ProductUpdateRequest productUpdateRequest) {
        existingProduct.setName(productUpdateRequest.getName());
        existingProduct.setDescription(productUpdateRequest.getDescription());
        existingProduct.setPrice(productUpdateRequest.getPrice());
        existingProduct.setInventory(productUpdateRequest.getInventory());
        existingProduct.setMaterial(productUpdateRequest.getMaterial());
        existingProduct.setProductCode(productUpdateRequest.getProductCode());
        existingProduct.setColor(productUpdateRequest.getColor());
        existingProduct.setWidth(productUpdateRequest.getWidth());
        existingProduct.setHeight(productUpdateRequest.getHeight());
        existingProduct.setWeight(productUpdateRequest.getWeight());
        existingProduct.setWeightUnit(productUpdateRequest.getWeightUnit());
        Category category = categoryRepository.findByName(productUpdateRequest.getCategory().getName());
        existingProduct.setCategory(category);
        return productRepository.save(existingProduct);
    }

    @Override
    public List<ProductDto> getConvertedProducts(List<Product> products) {
        return products.stream().map(this::convertProductToDto).toList();
    }

    @Override
    public ProductDto convertProductToDto(Product product) {
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        List<Image> images = imageRepository.findImagesByProductId(product.getId());

        List<ImageDto> imageDtos = images.stream()
                .map(image -> modelMapper.map(image, ImageDto.class))
                .toList();
        productDto.setImages(imageDtos);
        return productDto;

    }

    @Override
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findAllByCategoryId(categoryId);
    }

}
