package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.dtos.ImageDto;
import com.cozycollections.backend_cozy.dtos.ProductDto;
import com.cozycollections.backend_cozy.model.*;
import com.cozycollections.backend_cozy.repository.*;
import com.cozycollections.backend_cozy.request.AddProductRequest;
import com.cozycollections.backend_cozy.request.ProductUpdateRequest;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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
    public List<Product> getProductsByCategoryAndBrand(String category, String brand) {
        return productRepository.findByCategoryNameAndBrand(category, brand);
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryName(category);
    }

    @Override
    public List<Product> getProductsByBrandAndName(String brand, String name) {
        return productRepository.findByNameAndBrand(brand, name);
    }

    @Override
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    @Override
    public List<Product> getProductsByName(String name) {
        return productRepository.findByProductName(name);
    }

    @Override
    public Product getProductById(Long productId) {
        return productRepository.findById(productId).orElseThrow(()->new EntityNotFoundException("Product not found"));
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
        if(productExists(productRequest.getName(),productRequest.getBrand())){
            throw new EntityExistsException(productRequest.getName()+"Product already exists");
        }
        Category category = Optional.ofNullable(categoryRepository.findByName(productRequest.getCategory().getName()))
                .orElseGet(()->{
                    Category newCategory = new Category(productRequest.getCategory().getName());
                    return categoryRepository.save(newCategory);
                });
        productRequest.setCategory(category);
        return productRepository.save(createProduct(productRequest,category));

    }
    private boolean productExists(String name, String brand) {
        return productRepository.existsByNameAndBrand(name, brand);
    }

    public Product createProduct(AddProductRequest productRequest, Category category) {
        return  new Product(
                productRequest.getName(),
                productRequest.getDescription(),
                productRequest.getPrice(),
                productRequest.getInventory(),
                productRequest.getMaterial(),
                productRequest.getBrand(),
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
                .map(existingProduct->updateExistingProduct(existingProduct,productRequest))
                .map(productRepository::save)
                .orElseThrow(()->new EntityNotFoundException("Product not found"));
    }
    private Product updateExistingProduct(Product existingProduct, ProductUpdateRequest productUpdateRequest) {
        existingProduct.setName(productUpdateRequest.getName());
        existingProduct.setDescription(productUpdateRequest.getDescription());
        existingProduct.setPrice(productUpdateRequest.getPrice());
        existingProduct.setInventory(productUpdateRequest.getInventory());
        existingProduct.setMaterial(productUpdateRequest.getMaterial());
        existingProduct.setBrand(productUpdateRequest.getBrand());
        existingProduct.setProductCode(productUpdateRequest.getProductCode());
        existingProduct.setColor(productUpdateRequest.getColor());
        existingProduct.setWidth(productUpdateRequest.getWidth());
        existingProduct.setHeight(productUpdateRequest.getHeight());
        existingProduct.setWeight(productUpdateRequest.getWeight());
        existingProduct.setWeightUnit(productUpdateRequest.getWeightUnit());
        Category category =categoryRepository.findByName(productUpdateRequest.getCategory().getName());
        existingProduct.setCategory(category);
        return productRepository.save(existingProduct);
    }
    @Override
    public List<ProductDto> getConvertedProducts(List<Product> products) {
        return products.stream().map(this::convertToDto).toList();
    }

    @Override
    public ProductDto convertToDto(Product product) {
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        List<Image> images = imageRepository.findImagesByProductId(product.getId());

        List<ImageDto> imageDtos = images.stream()
                .map(image -> modelMapper.map(image, ImageDto.class))
                    .toList();
                productDto.setImages(imageDtos);
                return productDto;

    }

}
