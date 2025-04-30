package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.model.Cart;
import com.cozycollections.backend_cozy.model.User;
import com.cozycollections.backend_cozy.repository.CartItemRepository;
import com.cozycollections.backend_cozy.repository.CartRepository;
import com.cozycollections.backend_cozy.service.Interfaces.ICartService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;

    @Override
    public Cart getCartByCartId(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(()-> new EntityNotFoundException("Cart not found"));
        BigDecimal totalAmount = cart.getTotalAmount();
        cart.setTotalAmount(totalAmount);
        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findCartByUserId(userId);
    }

    @Override
    public void deleteCartByCartId(Long cartId) {

        Cart cart = getCartByCartId(cartId);
        cartItemRepository.deleteCartItemsByCartId(cartId);
        cart.clearCart();
        cartRepository.deleteById(cartId);
    }

    @Override
    public Cart createCart(User user) {
        return Optional.ofNullable(getCartByUserId(user.getId()))
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    @Override
    public BigDecimal getCartTotal(Long cartId) {
        Cart cart = getCartByCartId(cartId);
        return cart.getTotalAmount();
    }
}
