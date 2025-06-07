package com.cozycollections.backend_cozy.controller;

import java.util.List;
import java.util.Map;

import com.cozycollections.backend_cozy.request.PaymentRequest;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/user/{userId}/orders")
    public ResponseEntity<ApiResponse> getOrdersFromUser(@PathVariable Long userId) {
        List<OrderDto> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(new ApiResponse("Fetched orders successfully", orders));
    }

    @PostMapping("/user/{userId}/place-order")
    public ResponseEntity<ApiResponse> createOrder(@PathVariable Long userId) {
        Order order = orderService.placeOrder(userId);
        OrderDto orderDto = orderService.convertOrderToDto(order);
        return ResponseEntity.ok(new ApiResponse("Order placed successfully", orderDto));
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) throws StripeException {
        String clientSecret = orderService.createPaymentIntent(paymentRequest);
        return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
    }

}
