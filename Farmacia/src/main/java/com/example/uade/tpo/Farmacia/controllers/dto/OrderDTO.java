package com.example.uade.tpo.Farmacia.controllers.dto;

import java.util.List;

public record OrderDTO(
    Long id,
    String status,
    Double total,
    List<OrderItemDTO> items,
    String fullName,
    String deliveryStreet,
    String deliveryCity,
    String deliveryZip,
    String deliveryEmail,
    String deliveryPhone,
    String deliveryMethod,
    String paymentMethod,
    String createdAt
) {}
