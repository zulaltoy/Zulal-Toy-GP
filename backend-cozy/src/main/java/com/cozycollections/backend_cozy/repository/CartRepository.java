package com.cozycollections.backend_cozy.repository;

import com.cozycollections.backend_cozy.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findCartByUserId(Long userId);
}
