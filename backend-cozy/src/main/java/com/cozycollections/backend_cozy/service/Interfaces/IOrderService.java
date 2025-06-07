package com.cozycollections.backend_cozy.service.Interfaces;

import com.cozycollections.backend_cozy.dtos.OrderDto;
import com.cozycollections.backend_cozy.model.Order;
import com.cozycollections.backend_cozy.request.PaymentRequest;
import com.stripe.exception.StripeException;

import java.util.List;

public interface IOrderService {
    Order placeOrder(Long userId);
    List<OrderDto> getUserOrders(Long userId);

    String createPaymentIntent(PaymentRequest request) throws StripeException;

    OrderDto convertOrderToDto(Order order);
}
