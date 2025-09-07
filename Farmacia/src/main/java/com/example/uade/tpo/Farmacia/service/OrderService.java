package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.entity.Order;
import com.example.uade.tpo.Farmacia.repository.OrderRepository;
import exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
  private final OrderRepository orders;

  public List<Order> myOrders(String email) {
    return orders.findByUserEmail(email);
  }

  public List<Order> byUserId(Long userId) {
    return orders.findByUserId(userId);
  }

  public Order get(Long id) {
    return orders.findById(id).orElseThrow(() -> new NotFoundException("Orden no encontrada"));
  }

  public Order setStatus(Long id, Order.Status status) {
    Order o = get(id);
    o.setStatus(status);
    return orders.save(o);
  }
}
