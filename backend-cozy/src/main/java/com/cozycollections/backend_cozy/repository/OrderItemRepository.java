package com.cozycollections.backend_cozy.repository;

import com.cozycollections.backend_cozy.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findOrderItemByProductId(Long productId);
}
