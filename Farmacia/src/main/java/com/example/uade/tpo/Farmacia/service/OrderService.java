package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.CreateOrderRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CreateOrderResponse;
import com.example.uade.tpo.Farmacia.controllers.dto.OrderDTO;
import com.example.uade.tpo.Farmacia.controllers.dto.OrderSummaryDTO;
import com.example.uade.tpo.Farmacia.entity.Order;

import java.util.List;

public interface OrderService {

  // Crear orden - ahora retorna OrderSummaryDTO completo
  OrderSummaryDTO createOrderSummary(String email, CreateOrderRequest request);
  
  // Método legacy para compatibilidad
  CreateOrderResponse createOrder(String email, CreateOrderRequest request);
  
  // Procesar orden - ahora retorna OrderSummaryDTO actualizado
  OrderSummaryDTO processOrderSummary(Long id, Order.Status newStatus);
  
  // Métodos existentes
  List<OrderDTO> myOrdersDTO(String email);
  OrderDTO getUserOrderDTO(Long id, String email);
  OrderDTO setStatusDTO(Long id, Order.Status status);
  OrderDTO processOrder(Long id, Order.Status newStatus);
  List<OrderDTO> byUserIdDTO(Long userId);
  List<OrderDTO> getAllOrdersDTO();
}
