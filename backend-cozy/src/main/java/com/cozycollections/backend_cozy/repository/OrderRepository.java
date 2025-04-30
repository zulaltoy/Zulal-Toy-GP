package com.cozycollections.backend_cozy.repository;
import com.cozycollections.backend_cozy.model.Order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
public interface OrderRepository extends JpaRepository<Order, Long> {
 
    List<Order> findByUserId(Long userId);

}
