package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.CreateOrderRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CreateOrderResponse;
import com.example.uade.tpo.Farmacia.controllers.dto.OrderDTO;
import com.example.uade.tpo.Farmacia.entity.Order;

import java.util.List;

public interface OrderService {

  CreateOrderResponse createOrder(String email, CreateOrderRequest request);
  List<OrderDTO> myOrdersDTO(String email);
  OrderDTO getUserOrderDTO(Long id, String email);
  OrderDTO setStatusDTO(Long id, Order.Status status);
  List<OrderDTO> byUserIdDTO(Long userId);
  List<OrderDTO> getAllOrdersDTO();
}
