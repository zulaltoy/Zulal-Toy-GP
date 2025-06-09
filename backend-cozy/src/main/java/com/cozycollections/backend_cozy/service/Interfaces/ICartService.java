package com.cozycollections.backend_cozy.service.Interfaces;

import com.cozycollections.backend_cozy.dtos.CartDto;
import com.cozycollections.backend_cozy.model.Cart;
import com.cozycollections.backend_cozy.model.User;

import java.math.BigDecimal;

public interface ICartService {
    Cart getCartByCartId(Long cartId);
    Cart getCartByUserId(Long userId);
    void deleteCartByCartId(Long cartId);
    Cart createCart(User user);
    BigDecimal getCartTotal(Long cartId);

    CartDto convertCartToDto(Cart cart);
}
