package com.example.uade.tpo.Farmacia.controllers.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreatePaymentIntentRequest {
    private BigDecimal amount;
    private String currency;
    private Long orderId;
}
