package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.CreatePaymentIntentRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.PaymentIntentResponse;
import com.example.uade.tpo.Farmacia.entity.Order;

public interface PaymentService {
    PaymentIntentResponse createPaymentIntent(CreatePaymentIntentRequest request, Long userId);
    PaymentIntentResponse createTemporaryPaymentIntent(CreatePaymentIntentRequest request, Long userId);
    boolean verifyPayment(String paymentId);
    Order confirmPayment(Long orderId, String paymentId, String paymentProvider);
}
