package com.example.uade.tpo.Farmacia.service.impl;

import com.example.uade.tpo.Farmacia.controllers.dto.CreatePaymentIntentRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.PaymentIntentResponse;
import com.example.uade.tpo.Farmacia.entity.Order;
import com.example.uade.tpo.Farmacia.repository.OrderRepository;
import com.example.uade.tpo.Farmacia.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;

    @Value("${stripe.api.key:}")
    private String stripeApiKey;

    public PaymentServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public PaymentIntentResponse createPaymentIntent(CreatePaymentIntentRequest request, Long userId) {
        try {
            Stripe.apiKey = stripeApiKey;

            Order order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Check if user owns the order
            if (order.getUser() == null || order.getUser().getId() != userId) {
                throw new RuntimeException("Unauthorized access to order");
            }

            // Convert amount to cents (Stripe requires smallest currency unit)
            long amountInCents = request.getAmount().multiply(BigDecimal.valueOf(100)).longValue();

            Map<String, String> metadata = new HashMap<>();
            metadata.put("orderId", order.getId().toString());
            metadata.put("userId", userId.toString());

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(request.getCurrency() != null ? request.getCurrency().toLowerCase() : "usd")
                    .putAllMetadata(metadata)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            return new PaymentIntentResponse(
                    paymentIntent.getClientSecret(),
                    paymentIntent.getId()
            );

        } catch (StripeException e) {
            throw new RuntimeException("Error creating payment intent: " + e.getMessage(), e);
        }
    }

    @Override
    public PaymentIntentResponse createTemporaryPaymentIntent(CreatePaymentIntentRequest request, Long userId) {
        try {
            Stripe.apiKey = stripeApiKey;

            // Validar amount
            if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Invalid amount: must be greater than 0");
            }

            // Convert amount to cents (Stripe requires smallest currency unit)
            long amountInCents = request.getAmount().multiply(BigDecimal.valueOf(100)).longValue();

            // Validar que el monto en centavos sea al menos 50 (mínimo de Stripe)
            if (amountInCents < 50) {
                throw new RuntimeException("Amount too small: minimum is 0.50 " + 
                    (request.getCurrency() != null ? request.getCurrency().toUpperCase() : "USD"));
            }

            Map<String, String> metadata = new HashMap<>();
            metadata.put("userId", userId.toString());
            metadata.put("temporary", "true");

            // Determinar moneda (por defecto ARS)
            String currency = request.getCurrency() != null ? 
                request.getCurrency().toLowerCase() : "ars";

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(currency)
                    .putAllMetadata(metadata)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            return new PaymentIntentResponse(
                    paymentIntent.getClientSecret(),
                    paymentIntent.getId()
            );

        } catch (StripeException e) {
            throw new RuntimeException("Error creating temporary payment intent: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean verifyPayment(String paymentId) {
        try {
            Stripe.apiKey = stripeApiKey;
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentId);
            return "succeeded".equals(paymentIntent.getStatus());
        } catch (StripeException e) {
            throw new RuntimeException("Error verifying payment: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public Order confirmPayment(Long orderId, String paymentId, String paymentProvider) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Verify payment with Stripe
        if ("STRIPE".equalsIgnoreCase(paymentProvider)) {
            boolean isPaymentSuccessful = verifyPayment(paymentId);
            if (!isPaymentSuccessful) {
                throw new RuntimeException("Payment verification failed");
            }
        }

        // Update order status
        order.setPaymentMethod("CARD");
        order.setPaymentStatus(Order.PaymentStatus.PAID);
        order.setStatus(Order.Status.CONFIRMED);
        order.setShippingStatus(Order.ShippingStatus.PENDING_SHIPMENT);
        order.setPaidAt(Instant.now());
        order.setTotalPaid(order.getTotal());

        return orderRepository.save(order);
    }
}
