package com.cozycollections.backend_cozy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cozycollections.backend_cozy.model.Cart;
import com.cozycollections.backend_cozy.response.ApiResponse;
import com.cozycollections.backend_cozy.service.Interfaces.ICartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/carts")
public class CartController {
    private final ICartService cartService;

    @GetMapping("/user/{userId}/cart")
    public ResponseEntity<ApiResponse> getUserCart(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(new ApiResponse("Fetched cart successfully", cart));
    }

    @DeleteMapping("/cart/{cartId}/clear")
    public void clearCart(@PathVariable Long cartId) {
        cartService.deleteCartByCartId(cartId);

    }

}
