package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.controllers.dto.CreateOrderRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CreateOrderResponse;
import com.example.uade.tpo.Farmacia.controllers.dto.OrderDTO;
import com.example.uade.tpo.Farmacia.controllers.dto.UpdateOrderStatusRequest;
import com.example.uade.tpo.Farmacia.entity.Order;
import com.example.uade.tpo.Farmacia.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER') or hasRole('PHARMACIST') or hasRole('ADMIN')")
public class OrderController {
  private final OrderService service;

  /**
   * POST /api/v1/orders - Crear nueva orden
   * Este endpoint recibe la información del pedido del frontend y crea la orden.
   */
  @PostMapping
  public ResponseEntity<CreateOrderResponse> createOrder(
      @RequestBody CreateOrderRequest request,
      Authentication auth) {
    
    String userEmail = auth.getName();
    
    log.info("📦 Creando orden para usuario: {}", userEmail);
    log.debug("Detalles: {} items, método de entrega: {}, método de pago: {}", 
              request.getItems() != null ? request.getItems().size() : 0,
              request.getDeliveryMethod(),
              request.getPaymentMethod());
    
    try {
      // Validaciones básicas
      if (request.getItems() == null || request.getItems().isEmpty()) {
        log.warn("❌ Intento de crear orden sin items - Usuario: {}", userEmail);
        throw new IllegalArgumentException("La orden debe contener al menos un producto");
      }
      
      for (CreateOrderRequest.OrderItemRequest item : request.getItems()) {
        if (item.getProductId() == null || item.getQuantity() == null || item.getQuantity() < 1) {
          log.warn("❌ Item inválido en la orden - ProductId: {}, Quantity: {}", 
                   item.getProductId(), item.getQuantity());
          throw new IllegalArgumentException("Todos los items deben tener productId y cantidad válida");
        }
      }
      
      // Crear la orden usando el servicio
      CreateOrderResponse response = service.createOrder(userEmail, request);
      
      log.info("✅ Orden creada exitosamente - OrderId: {}, Total: {}, Usuario: {}", 
               response.getOrderId(), response.getTotal(), userEmail);
      
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
      
    } catch (IllegalArgumentException e) {
      log.error("❌ Error de validación al crear orden - Usuario: {}, Error: {}", 
                userEmail, e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("❌ Error inesperado al crear orden - Usuario: {}, Error: {}", 
                userEmail, e.getMessage(), e);
      throw e;
    }
  }

  @GetMapping
  public ResponseEntity<List<OrderDTO>> myOrders(Authentication auth) {
    String userEmail = auth.getName();
    log.info("📋 GET /api/v1/orders - Usuario: {}", userEmail);
    
    List<OrderDTO> orders = service.myOrdersDTO(userEmail);
    
    log.info("✅ Órdenes recuperadas - Usuario: {}, Count: {}", userEmail, orders.size());
    return ResponseEntity.ok(orders);
  }

  @GetMapping("/{id}")
  public ResponseEntity<OrderDTO> get(@PathVariable Long id, Authentication auth) {
    String userEmail = auth.getName();
    log.info("📦 GET /api/v1/orders/{} - Usuario: {}", id, userEmail);
    
    try {
      OrderDTO order = service.getUserOrderDTO(id, userEmail);
      
      if (order == null) {
        log.warn("⚠️ Orden {} no encontrada o no pertenece al usuario {}", id, userEmail);
        return ResponseEntity.notFound().build();
      }
      
      log.info("✅ Orden recuperada - ID: {}, Usuario: {}, Total: {}, Items: {}", 
               id, userEmail, order.total(), order.items().size());
      return ResponseEntity.ok(order);
    } catch (Exception e) {
      log.error("❌ Error al recuperar orden {} - Usuario: {}, Error: {}", 
                id, userEmail, e.getMessage());
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * GET /api/v1/orders/all - Obtener todas las órdenes (Admin/Farmacéutico)
   * Este endpoint retorna TODAS las órdenes del sistema, sin filtrar por usuario.
   * Solo accesible para usuarios con rol PHARMACIST o ADMIN.
   */
  @GetMapping("/all")
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public ResponseEntity<List<OrderDTO>> getAllOrders(Authentication auth) {
    String userEmail = auth.getName();
    log.info("🔐 GET /api/v1/orders/all - Admin/Farmacéutico: {}", userEmail);
    
    try {
      List<OrderDTO> allOrders = service.getAllOrdersDTO();
      log.info("✅ Todas las órdenes recuperadas - Admin: {}, Total Orders: {}", 
               userEmail, allOrders.size());
      return ResponseEntity.ok(allOrders);
    } catch (Exception e) {
      log.error("❌ Error al recuperar todas las órdenes - Admin: {}, Error: {}", 
                userEmail, e.getMessage(), e);
      throw e;
    }
  }

  /**
   * PUT /api/v1/orders/{id}/status - Actualizar estado de orden (Farmacéutico/Admin)
   * Este endpoint permite cambiar el estado de una orden.
   * Frontend envía: { "status": "PENDING" | "PAID" | "CANCELLED" }
   */
  @PutMapping("/{id}/status")
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public ResponseEntity<OrderDTO> updateOrderStatus(
      @PathVariable Long id,
      @RequestBody UpdateOrderStatusRequest request,
      Authentication auth) {
    
    String userEmail = auth.getName();
    log.info("🔄 PUT /api/v1/orders/{}/status - Usuario: {}, Nuevo estado: {}", 
             id, userEmail, request.getStatus());
    
    try {
      if (request.getStatus() == null) {
        log.warn("❌ Estado no proporcionado en la solicitud - Orden: {}", id);
        throw new IllegalArgumentException("El estado es requerido");
      }
      
      OrderDTO updatedOrder = service.processOrder(id, request.getStatus());
      
      log.info("✅ Estado de orden actualizado - ID: {}, Nuevo estado: {}", 
               id, request.getStatus());
      return ResponseEntity.ok(updatedOrder);
      
    } catch (IllegalArgumentException | IllegalStateException e) {
      log.error("❌ Error de validación al actualizar orden {} - Error: {}", 
                id, e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("❌ Error inesperado al actualizar orden {} - Error: {}", 
                id, e.getMessage(), e);
      throw e;
    }
  }

  /**
   * PATCH /api/v1/orders/{id}/status - Actualizar estado de orden (Farmacéutico/Admin)
   * Endpoint alternativo con PATCH (mantiene compatibilidad)
   */
  @PatchMapping("/{id}/status")
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public ResponseEntity<OrderDTO> patchOrderStatus(
      @PathVariable Long id,
      @RequestParam Order.Status status,
      Authentication auth) {
    
    String userEmail = auth.getName();
    log.info("🔄 PATCH /api/v1/orders/{}/status - Usuario: {}, Nuevo estado: {}", 
             id, userEmail, status);
    
    try {
      OrderDTO updatedOrder = service.processOrder(id, status);
      log.info("✅ Estado de orden actualizado - ID: {}, Nuevo estado: {}", id, status);
      return ResponseEntity.ok(updatedOrder);
    } catch (Exception e) {
      log.error("❌ Error al actualizar orden {} - Error: {}", id, e.getMessage());
      throw e;
    }
  }
}
