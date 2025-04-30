package com.cozycollections.backend_cozy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cozycollections.backend_cozy.model.Cart;
import com.cozycollections.backend_cozy.model.User;
import com.cozycollections.backend_cozy.response.ApiResponse;
import com.cozycollections.backend_cozy.service.Interfaces.ICartItemService;
import com.cozycollections.backend_cozy.service.Interfaces.ICartService;
import com.cozycollections.backend_cozy.service.Interfaces.IUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/cartItems")
public class CartItemController {
    private final ICartItemService cartItemService;
    private final IUserService userService;
    private final ICartService cartService;

    @PostMapping("/item/add")
    public ResponseEntity<ApiResponse> addItemToCart(@RequestParam Long productId, @RequestParam int quantity) {
        User user = userService.getAuthenticatedUser();
        Cart cart = cartService.createCart(user);
        cartItemService.addCartItemToCart(cart.getId(), productId, quantity);
        return ResponseEntity.ok(new ApiResponse("Item added to cart successfully", null));
    }

    @PutMapping("/cart/{cartId}/item/{cartItemId}/update")
    public ResponseEntity<ApiResponse> updateCartItem(@RequestParam int quantity, @RequestParam Long cartItemId,
            @RequestParam Long cartId) {
        cartItemService.updateCartItemQuantity(cartId, cartItemId, quantity);
        return ResponseEntity.ok(new ApiResponse("Cart item updated successfully", null));
    }

    @DeleteMapping("/cart/{cartId}/item/{cartItemId}/delete")
    public ResponseEntity<ApiResponse> deleteCartItem(@RequestParam Long cartItemId, @RequestParam Long cartId) {
        cartItemService.deleteCartItemFromCart(cartId, cartItemId);
        return ResponseEntity.ok(new ApiResponse("Cart item deleted successfully", null));
    }
}
