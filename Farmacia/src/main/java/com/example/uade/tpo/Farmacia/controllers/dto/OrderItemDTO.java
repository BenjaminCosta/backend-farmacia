package com.example.uade.tpo.Farmacia.controllers.dto;

public record OrderItemDTO(
    Long productId,
    String productName,
    Double unitPrice,
    Integer quantity,
    Double lineTotal
) {}