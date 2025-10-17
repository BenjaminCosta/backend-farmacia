package com.example.uade.tpo.Farmacia.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.example.uade.tpo.Farmacia.controllers.dto.CartResponse;
import com.example.uade.tpo.Farmacia.controllers.dto.UpdateQuantityRequest;
import com.example.uade.tpo.Farmacia.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER') or hasRole('PHARMACIST') or hasRole('ADMIN')")
public class CartController {
    
    private final CartService service;

    private String currentEmail(Authentication auth) {
        return auth.getName(); // email del JWT
    }

    // GET /cart
    @GetMapping
    public CartResponse getCart(Authentication auth) {
        return service.getCart(currentEmail(auth));
    }

    // POST /cart/items?productId={id}&quantity={n}
    @PostMapping("/items")
    public CartResponse addItem(
        @RequestParam Long productId,
        @RequestParam Integer quantity,
        Authentication auth
    ) {
        return service.addItemByParams(currentEmail(auth), productId, quantity);
    }

    // PATCH /cart/items/{itemId} - with JSON body
    @PatchMapping("/items/{itemId}")
    public CartResponse updateItem(
        @PathVariable Long itemId,
        @RequestBody UpdateQuantityRequest request,
        Authentication auth
    ) {
        return service.updateItemQuantity(currentEmail(auth), itemId, request.getQuantity());
    }

    // DELETE /cart/items/{itemId}
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId, Authentication auth) {
        service.removeItem(currentEmail(auth), itemId);
        return ResponseEntity.noContent().build();
    }

    // POST /cart/checkout
    @PostMapping("/checkout")
    public ResponseEntity<Long> checkout(Authentication auth) {
        Long orderId = service.checkout(currentEmail(auth));
        return ResponseEntity.ok(orderId);
    }
}