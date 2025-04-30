package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.dtos.OrderDto;
import com.cozycollections.backend_cozy.enums.OrderStatus;
import com.cozycollections.backend_cozy.model.Cart;
import com.cozycollections.backend_cozy.model.Order;
import com.cozycollections.backend_cozy.model.OrderItem;
import com.cozycollections.backend_cozy.model.Product;
import com.cozycollections.backend_cozy.repository.OrderRepository;
import com.cozycollections.backend_cozy.repository.ProductRepository;
import com.cozycollections.backend_cozy.service.Interfaces.ICartService;
import com.cozycollections.backend_cozy.service.Interfaces.IOrderService;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ICartService cartService;
    private final ModelMapper modelMapper;

    @Transactional
    @Override
    public Order placeOrder(Long userId) {

        Cart cart = cartService.getCartByUserId(userId);
        Order order = createOrder(cart);
        List<OrderItem> orderItems = createOrderItems(order,cart);
        order.setOrderItems(new HashSet<>(orderItems));
        order.setTotalAmount(calculateTotalAmount(orderItems));
        Order savedOrder = orderRepository.save(order);
        cartService.deleteCartByCartId(cart.getId());
        return savedOrder;
    }
    private BigDecimal calculateTotalAmount(List<OrderItem> orderItems) {
        return orderItems.stream()
                .map(item-> item.getPrice()
                .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return cart.getCartItems().stream()
                .map(cartItem->{
                    Product product = cartItem.getProduct();
                    product.setInventory(product.getInventory() - cartItem.getQuantity());
                    productRepository.save(product);
                    return new OrderItem(
                        cartItem.getQuantity(),
                        cartItem.getUnitPrice(),
                        order,
                        product);
                }).toList();
    }
    private Order createOrder(Cart cart){
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());
       

        return order;
    }

    @Override
    public List<OrderDto> getUserOrders(Long userId) {
       List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::convertOrderToDto)
                .toList();
    }

    @Override
    public OrderDto convertOrderToDto(Order order) {
        return modelMapper.map(order, OrderDto.class);
    }
}
