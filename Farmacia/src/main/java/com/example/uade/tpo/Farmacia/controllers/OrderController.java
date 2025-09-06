package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.entity.Order;
import com.example.uade.tpo.Farmacia.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
  private final OrderService service;

  @GetMapping
  public List<Order> list(Authentication auth,
                          @RequestParam(required = false) Long userId) {
    if (userId != null) return service.byUserId(userId);
    return service.myOrders(auth.getName()); // email del token
  }

  @GetMapping("/{id}")
  public Order get(@PathVariable Long id) { return service.get(id); }

  @PatchMapping("/{id}/status")
  public Order changeStatus(@PathVariable Long id,
                            @RequestParam Order.Status status) {
    return service.setStatus(id, status);
  }
}
