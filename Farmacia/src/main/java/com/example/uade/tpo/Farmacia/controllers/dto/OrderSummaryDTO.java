package com.example.uade.tpo.Farmacia.controllers.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

// DTO completo para checkout y actualizaciones de estado
public record OrderSummaryDTO(
    Long id,
    String status,
    BigDecimal total,
    Instant createdAt,
    List<OrderItemSummary> items,
    DeliveryInfo delivery,
    PaymentInfo payment
) {
    // Items con información completa del producto
    public record OrderItemSummary(
        Long productId,
        String name,
        BigDecimal price,
        Integer quantity,
        BigDecimal subtotal
    ) {}
    
    // Información de entrega
    public record DeliveryInfo(
        String fullName,
        String street,
        String city,
        String zip,
        String phone,
        String email,
        String method
    ) {}
    
    // Información de pago
    public record PaymentInfo(
        String method,
        String status
    ) {}
}
