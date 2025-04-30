package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.model.Cart;
import com.cozycollections.backend_cozy.model.CartItem;
import com.cozycollections.backend_cozy.model.Product;
import com.cozycollections.backend_cozy.repository.CartItemRepository;
import com.cozycollections.backend_cozy.repository.CartRepository;
import com.cozycollections.backend_cozy.service.Interfaces.ICartItemService;
import com.cozycollections.backend_cozy.service.Interfaces.ICartService;
import com.cozycollections.backend_cozy.service.Interfaces.IProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartItemService implements ICartItemService {
    private final ICartService cartService;
    private final IProductService productService;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;

    @Override
    public CartItem getCartItem(Long cartId, Long productId) {
        Cart cart = cartService.getCartByCartId(cartId);
        return cart.getCartItems()
                .stream()
                .filter(cartItem -> cartItem.getProduct().getId().equals(productId))
                .findFirst().orElseThrow(() -> new EntityNotFoundException("CartItem not found"));
    }

    @Override
    public void deleteCartItemFromCart(Long cartId, Long productId) {

        Cart cart = cartService.getCartByCartId(cartId);
        CartItem cartItem = getCartItem(cartId, productId);
        cart.removeItem(cartItem);
        cartRepository.save(cart);
    }

    @Override
    public void addCartItemToCart(Long cartId, Long productId, int quantity) {

        Cart cart = cartService.getCartByCartId(cartId);
        Product product = productService.getProductById(productId);
        CartItem cartItem = cart.getCartItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst().orElse(new CartItem());
        if (cartItem.getId() == 0) { // ==null
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(product.getPrice());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }
        cartItem.setTotalPrice();
        cart.addItem(cartItem);
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
    }

    @Override
    public void updateCartItemQuantity(Long cartId, Long productId, int quantity) {
 Cart cart = cartService.getCartByCartId(cartId);
 cart.getCartItems().stream()
 .filter(cartItem -> cartItem.getProduct().getId().equals(productId))
    .findFirst().ifPresent(item ->{
        item.setQuantity(quantity);
        item.setUnitPrice(item.getProduct().getPrice());
        item.setTotalPrice();
    });
    BigDecimal totalAmount = cart.getCartItems()
            .stream()
            .map(CartItem::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    cart.setTotalAmount(totalAmount);
    cartRepository.save(cart);
 
    }
}
