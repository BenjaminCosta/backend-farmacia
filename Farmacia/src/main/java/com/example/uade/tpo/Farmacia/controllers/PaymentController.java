package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.controllers.dto.ConfirmPaymentRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CreatePaymentIntentRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.PaymentIntentResponse;
import com.example.uade.tpo.Farmacia.entity.Order;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
            @RequestBody CreatePaymentIntentRequest request,
            Authentication auth) {
        
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        PaymentIntentResponse response = paymentService.createPaymentIntent(request, user.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-intent-temp")
    public ResponseEntity<PaymentIntentResponse> createTemporaryPaymentIntent(
            @RequestBody CreatePaymentIntentRequest request,
            Authentication auth) {
        
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create payment intent without order (orderId will be null)
        PaymentIntentResponse response = paymentService.createTemporaryPaymentIntent(request, user.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/orders/{orderId}/pay")
    public ResponseEntity<Order> confirmPayment(
            @PathVariable Long orderId,
            @RequestBody ConfirmPaymentRequest request,
            Authentication auth) {
        
        Order order = paymentService.confirmPayment(orderId, request.getPaymentId(), request.getPaymentProvider());
        return ResponseEntity.ok(order);
    }
}
