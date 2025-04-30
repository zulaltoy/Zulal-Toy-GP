package com.cozycollections.backend_cozy.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cozycollections.backend_cozy.dtos.OrderDto;
import com.cozycollections.backend_cozy.model.Order;
import com.cozycollections.backend_cozy.response.ApiResponse;
import com.cozycollections.backend_cozy.service.Interfaces.IOrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final IOrderService orderService;

    @GetMapping("/user/{userId}/order")
    public ResponseEntity<ApiResponse> getOrdersFromUser(@PathVariable Long userId) {
        List<OrderDto> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(new ApiResponse("Fetched orders successfully", orders));
    }

    @PostMapping("/user/order")
    public ResponseEntity<ApiResponse> createOrder(@RequestParam Long userId) {
        Order order = orderService.placeOrder(userId);
        OrderDto orderDto = orderService.convertOrderToDto(order);
        return ResponseEntity.ok(new ApiResponse("Order placed successfully", orderDto));
    }

}
