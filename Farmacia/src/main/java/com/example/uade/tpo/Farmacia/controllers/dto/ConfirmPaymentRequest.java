package com.example.uade.tpo.Farmacia.controllers.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ConfirmPaymentRequest {
    private String paymentProvider;
    private String paymentId;
    private BigDecimal amount;
}
