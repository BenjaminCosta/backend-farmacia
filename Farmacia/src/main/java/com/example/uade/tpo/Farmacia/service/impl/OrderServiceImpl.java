package com.example.uade.tpo.Farmacia.service.impl;

import com.example.uade.tpo.Farmacia.controllers.dto.OrderDTO;
import com.example.uade.tpo.Farmacia.controllers.dto.OrderItemDTO;
import com.example.uade.tpo.Farmacia.entity.Order;
import com.example.uade.tpo.Farmacia.entity.OrderItem;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.exceptions.NotFoundException;
import com.example.uade.tpo.Farmacia.repository.OrderRepository;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.service.OrderService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

  private final OrderRepository orders;
  private final UserRepository users;

  @Override
  public List<OrderDTO> myOrdersDTO(String email) {
    return orders.findByUserEmail(email)
        .stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public List<OrderDTO> byUserIdDTO(Long userId) {
    return orders.findByUserId(userId)
        .stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public OrderDTO getUserOrderDTO(Long id, String email) {
    return toDTO(getUserOrder(id, email));
  }

  @Override
  public OrderDTO setStatusDTO(Long id, Order.Status status) {
    Order o = orders.findById(id)
        .orElseThrow(() -> new NotFoundException("Orden no encontrada"));
    o.setStatus(status);
    return toDTO(orders.save(o));
  }

  // ================= Helpers =================

  private Order getUserOrder(Long id, String email) {
    User user = users.findByEmail(email)
        .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    Order order = orders.findById(id)
        .orElseThrow(() -> new NotFoundException("Orden no encontrada"));

    // Null-safe comparison de IDs
    Long orderUserId = (order.getUser() != null) ? order.getUser().getId() : null;
    Long requestUserId = user.getId();
    if (orderUserId == null || requestUserId == null || !orderUserId.equals(requestUserId)) {
      throw new IllegalStateException("No tiene permisos para ver esta orden");
    }
    return order;
  }

  private OrderDTO toDTO(Order order) {
    OrderDTO dto = new OrderDTO();
    dto.setId(order.getId());
    dto.setUserEmail(order.getUser().getEmail());
    dto.setUserName(order.getUser().getName());
    dto.setStatus(order.getStatus()); // enum Order.Status
    dto.setTotal(order.getTotal());
    dto.setCreatedAt(order.getCreatedAt());

    List<OrderItemDTO> items = order.getItems()
        .stream()
        .map(this::toItemDTO)
        .collect(Collectors.toList());
    dto.setItems(items);

    return dto;
  }

  private OrderItemDTO toItemDTO(OrderItem it) {
    OrderItemDTO dto = new OrderItemDTO();
    dto.setId(it.getId());
    dto.setProductName(it.getProduct().getNombre()); // 'nombre' en Product
    dto.setQuantity(it.getQuantity());
    dto.setUnitPrice(it.getUnitPrice());
    dto.setLineTotal(it.getLineTotal());
    return dto;
  }
}