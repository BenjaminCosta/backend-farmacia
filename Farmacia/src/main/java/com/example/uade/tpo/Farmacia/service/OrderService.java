package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.OrderDTO;
import com.example.uade.tpo.Farmacia.entity.Order;

import java.util.List;

public interface OrderService {

  List<OrderDTO> myOrdersDTO(String email);
  OrderDTO getUserOrderDTO(Long id, String email);
  OrderDTO setStatusDTO(Long id, Order.Status status);
  List<OrderDTO> byUserIdDTO(Long userId);
}
