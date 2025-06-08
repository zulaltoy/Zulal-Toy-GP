package com.cozycollections.backend_cozy.service.Interfaces;

import com.cozycollections.backend_cozy.dtos.CartItemDto;
import com.cozycollections.backend_cozy.model.CartItem;

public interface ICartItemService {
    CartItem getCartItem(Long cartId, Long productId);
    void deleteCartItemFromCart(Long cartId,Long productId);
    CartItem addCartItemToCart(Long cartId,Long productId,int quantity);
    void updateCartItemQuantity(Long cartId,Long productId,int quantity);

    CartItemDto convertToCartItemDto(CartItem cartItem);
}
