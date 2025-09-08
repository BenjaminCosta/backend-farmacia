package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.OrderDTO;
import com.example.uade.tpo.Farmacia.entity.Order;
import com.example.uade.tpo.Farmacia.entity.OrderItem;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.repository.OrderRepository;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
  private final OrderRepository orders;
  private final UserRepository users;

  public List<Order> myOrders(String email) {
    return orders.findByUserEmail(email);
  }

  public List<OrderDTO> myOrdersDTO(String email) {
    return myOrders(email).stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public List<Order> byUserId(Long userId) {
    return orders.findByUserId(userId);
  }

  public Order get(Long id) {
    return orders.findById(id).orElseThrow(() -> new NotFoundException("Orden no encontrada"));
  }

  public Order getUserOrder(Long id, String email) {
    User user = users.findByEmail(email).orElseThrow(() -> 
        new NotFoundException("Usuario no encontrado"));
    Order order = orders.findById(id).orElseThrow(() -> 
        new NotFoundException("Orden no encontrada"));
    
    if (order.getUser().getId() != user.getId()) {
        throw new IllegalStateException("No tiene permisos para ver esta orden");
    }
    
    return order;
  }

  public OrderDTO getUserOrderDTO(Long id, String email) {
    return convertToDTO(getUserOrder(id, email));
  }

  public Order setStatus(Long id, Order.Status status) {
    Order o = get(id);
    o.setStatus(status);
    return orders.save(o);
  }

  public OrderDTO setStatusDTO(Long id, Order.Status status) {
    return convertToDTO(setStatus(id, status));
  }

  private OrderDTO convertToDTO(Order order) {
    OrderDTO dto = new OrderDTO();
    dto.setId(order.getId());
    dto.setUserEmail(order.getUser().getEmail());
    dto.setUserName(order.getUser().getName());
    dto.setStatus(order.getStatus());
    dto.setTotal(order.getTotal());
    dto.setCreatedAt(order.getCreatedAt());
    
    List<OrderDTO.OrderItemDTO> itemDTOs = order.getItems().stream()
        .map(this::convertItemToDTO)
        .collect(Collectors.toList());
    dto.setItems(itemDTOs);
    
    return dto;
  }

  private OrderDTO.OrderItemDTO convertItemToDTO(OrderItem item) {
    OrderDTO.OrderItemDTO dto = new OrderDTO.OrderItemDTO();
    dto.setId(item.getId());
    dto.setProductName(item.getProduct().getNombre()); // campo es 'nombre', no 'name'
    dto.setQuantity(item.getQuantity());
    dto.setUnitPrice(item.getUnitPrice());
    dto.setLineTotal(item.getLineTotal());
    return dto;
  }
}
