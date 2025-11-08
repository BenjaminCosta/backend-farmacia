package com.example.uade.tpo.Farmacia.controllers.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentIntentResponse {
    private String clientSecret;
    private String paymentIntentId;
}
