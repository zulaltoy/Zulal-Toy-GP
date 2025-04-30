package com.cozycollections.backend_cozy.repository;

import com.cozycollections.backend_cozy.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findCartItemByProductId(Long productId);

    void deleteCartItemsByCartId(Long cartId);
}
