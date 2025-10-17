package com.example.uade.tpo.Farmacia.controllers.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderResponse {
    private Long orderId;
    private BigDecimal total;
    private String status;
}
