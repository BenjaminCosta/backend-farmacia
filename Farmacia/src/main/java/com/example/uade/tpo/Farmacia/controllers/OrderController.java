package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.controllers.dto.OrderDTO;
import com.example.uade.tpo.Farmacia.entity.Order;
import com.example.uade.tpo.Farmacia.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER') or hasRole('PHARMACIST') or hasRole('ADMIN')")
public class OrderController {
  private final OrderService service;

  @GetMapping
  public List<OrderDTO> myOrders(Authentication auth) {
    return service.myOrdersDTO(auth.getName()); // email del token
  }

  @GetMapping("/{id}")
  public OrderDTO get(@PathVariable Long id, Authentication auth) { 
    return service.getUserOrderDTO(id, auth.getName()); 
  }

  @PatchMapping("/{id}/status")
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public OrderDTO changeStatus(@PathVariable Long id,
                            @RequestParam Order.Status status) {
    return service.setStatusDTO(id, status);
  }
}
