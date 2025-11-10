package com.example.uade.tpo.Farmacia.service.impl;

import com.example.uade.tpo.Farmacia.controllers.dto.CreateOrderRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CreateOrderResponse;
import com.example.uade.tpo.Farmacia.controllers.dto.OrderDTO;
import com.example.uade.tpo.Farmacia.controllers.dto.OrderItemDTO;
import com.example.uade.tpo.Farmacia.controllers.dto.OrderSummaryDTO;
import com.example.uade.tpo.Farmacia.entity.Order;
import com.example.uade.tpo.Farmacia.entity.OrderItem;
import com.example.uade.tpo.Farmacia.entity.Product;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.exception.BadRequestException;
import com.example.uade.tpo.Farmacia.exceptions.NotFoundException;
import com.example.uade.tpo.Farmacia.repository.OrderItemRepository;
import com.example.uade.tpo.Farmacia.repository.OrderRepository;
import com.example.uade.tpo.Farmacia.repository.ProductRepository;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

  private final OrderRepository orders;
  private final UserRepository users;
  private final ProductRepository products;
  private final OrderItemRepository orderItems;

  @Override
  @Transactional
  public OrderSummaryDTO createOrderSummary(String email, CreateOrderRequest request) {
    log.info("📦 Iniciando creación de orden (OrderSummaryDTO) para: {}", email);
    
    // Reutilizar la lógica existente
    CreateOrderResponse response = createOrder(email, request);
    
    // Obtener la orden completa para mapearla
    Order order = orders.findById(response.getOrderId())
        .orElseThrow(() -> new NotFoundException("Orden recién creada no encontrada"));
    
    return toOrderSummaryDTO(order);
  }

  @Override
  @Transactional
  public CreateOrderResponse createOrder(String email, CreateOrderRequest request) {
    log.info("📦 Iniciando creación de orden para: {}", email);
    
    // 1. Validar usuario
    User user = users.findByEmail(email)
        .orElseThrow(() -> {
          log.error("❌ Usuario no encontrado: {}", email);
          return new NotFoundException("Usuario no encontrado");
        });
    
    // 2. Validar items no vacíos
    if (request.getItems() == null || request.getItems().isEmpty()) {
      log.error("❌ Intento de crear orden sin items - Usuario: {}", email);
      throw new IllegalArgumentException("La orden debe contener al menos un producto");
    }
    
    // 3. Validar y calcular total
    BigDecimal total = BigDecimal.ZERO;
    boolean hasRxProduct = false; // 🔴 Flag para detectar productos con receta
    
    for (CreateOrderRequest.OrderItemRequest item : request.getItems()) {
      if (item.getProductId() == null) {
        throw new IllegalArgumentException("El ID del producto no puede ser nulo");
      }
      if (item.getQuantity() == null || item.getQuantity() < 1) {
        throw new IllegalArgumentException("La cantidad debe ser al menos 1");
      }
      
      // Validar que el producto existe
      Product product = products.findById(item.getProductId())
          .orElseThrow(() -> {
            log.error("❌ Producto no encontrado: {}", item.getProductId());
            return new NotFoundException("Producto no encontrado: " + item.getProductId());
          });
      
      // Validar stock
      if (product.getStock() == null || product.getStock() < item.getQuantity()) {
        log.error("❌ Stock insuficiente - Producto: {}, Stock: {}, Solicitado: {}", 
                  product.getId(), product.getStock(), item.getQuantity());
        throw new IllegalStateException(
            "Stock insuficiente para el producto: " + product.getNombre() + 
            " (disponible: " + product.getStock() + ", solicitado: " + item.getQuantity() + ")"
        );
      }
      
      // 🔴 Detectar si el producto requiere receta
      if (product.getRequiresPrescription() != null && product.getRequiresPrescription()) {
        hasRxProduct = true;
        log.info("💊 Producto con receta detectado: {} - ID: {}", product.getNombre(), product.getId());
      }
      
      // Calcular subtotal
      BigDecimal unitPrice = product.getPrecio() != null ? product.getPrecio() : BigDecimal.ZERO;
      BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
      total = total.add(lineTotal);
    }
    
    // 3.5. 🔴 VALIDACIÓN RX: Si hay productos con receta, FORZAR método PICKUP
    if (hasRxProduct) {
      String deliveryMethod = request.getDeliveryMethod() != null ? 
          request.getDeliveryMethod().toUpperCase() : "";
      
      if (!"PICKUP".equals(deliveryMethod)) {
        log.error("❌ Intento de DELIVERY con productos RX - Usuario: {}, Método: {}", 
                  email, deliveryMethod);
        throw new BadRequestException(
            "Este pedido contiene medicamentos con receta (RX) que solo pueden retirarse en la farmacia. " +
            "Por favor, seleccione el método de entrega 'PICKUP' (Retiro en local)."
        );
      }
      
      log.info("✅ Validación RX pasada - Método PICKUP confirmado para usuario: {}", email);
    }
    
    // 4. Crear la orden con datos de delivery
    Order order = new Order();
    order.setUser(user);
    order.setTotal(total);
    order.setStatus(Order.Status.PENDING);
    
    // Guardar información de delivery
    order.setFullName(request.getFullName());
    order.setDeliveryEmail(request.getEmail());
    order.setDeliveryPhone(request.getPhone());
    order.setDeliveryMethod(request.getDeliveryMethod());
    order.setPaymentMethod(request.getPaymentMethod());
    
    // Guardar dirección si existe
    if (request.getAddress() != null) {
      order.setDeliveryStreet(request.getAddress().getStreet());
      order.setDeliveryCity(request.getAddress().getCity());
      order.setDeliveryZip(request.getAddress().getZip());
    }
    
    order = orders.save(order);
    
    log.info("✅ Orden creada con ID: {} para usuario: {}", order.getId(), email);
    
    // 5. Crear los items y descontar stock
    for (CreateOrderRequest.OrderItemRequest item : request.getItems()) {
      Product product = products.findById(item.getProductId()).orElseThrow();
      
      // Descontar stock
      product.setStock(product.getStock() - item.getQuantity());
      products.save(product);
      
      // Crear OrderItem
      OrderItem orderItem = new OrderItem();
      orderItem.setOrder(order);
      orderItem.setProduct(product);
      orderItem.setQuantity(item.getQuantity());
      orderItem.setUnitPrice(product.getPrecio() != null ? product.getPrecio() : BigDecimal.ZERO);
      orderItem.setUnitDiscount(product.getDescuento() != null ? product.getDescuento() : BigDecimal.ZERO);
      
      BigDecimal lineTotal = orderItem.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
      orderItem.setLineTotal(lineTotal);
      
      orderItems.save(orderItem);
      
      log.debug("📦 Item agregado - Producto: {}, Cantidad: {}, Precio unitario: {}", 
                product.getNombre(), item.getQuantity(), orderItem.getUnitPrice());
    }
    
    log.info("✅ Orden {} completada exitosamente - Total: {}, Items: {}", 
             order.getId(), total, request.getItems().size());
    
    // 6. Retornar respuesta
    return CreateOrderResponse.builder()
        .orderId(order.getId())
        .total(total)
        .status(order.getStatus().name())
        .build();
  }

  @Override
  public List<OrderDTO> myOrdersDTO(String email) {
    User user = users.findByEmail(email)
        .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    
    List<Order> userOrders = orders.findAllByUserIdWithItems(user.getId());
    log.info("📋 Consultando órdenes para usuario: {} - Encontradas: {}", email, userOrders.size());
    
    return userOrders.stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public List<OrderDTO> byUserIdDTO(Long userId) {
    List<Order> userOrders = orders.findAllByUserIdWithItems(userId);
    log.info("📋 Consultando órdenes para userId: {} - Encontradas: {}", userId, userOrders.size());
    
    return userOrders.stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public List<OrderDTO> getAllOrdersDTO() {
    log.info("🔐 Consultando TODAS las órdenes del sistema (Admin/Farmacéutico)");
    
    List<Order> allOrders = orders.findAllWithItems();
    log.info("✅ Total de órdenes en el sistema: {}", allOrders.size());
    
    return allOrders.stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public OrderDTO getUserOrderDTO(Long id, String email) {
    User user = users.findByEmail(email)
        .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    
    Order order = orders.findByIdAndUserIdWithItems(id, user.getId())
        .orElseThrow(() -> {
          log.warn("❌ Orden {} no encontrada o no pertenece al usuario {}", id, email);
          return new NotFoundException("Orden no encontrada");
        });
    
    log.info("📦 Consultando orden {} para usuario: {}", id, email);
    return toDTO(order);
  }

  @Override
  public OrderDTO setStatusDTO(Long id, Order.Status status) {
    Order o = orders.findById(id)
        .orElseThrow(() -> new NotFoundException("Orden no encontrada"));
    o.setStatus(status);
    return toDTO(orders.save(o));
  }

  @Override
  public OrderDTO processOrder(Long id, Order.Status newStatus) {
    log.info("🔄 Procesando orden {} - Nuevo estado: {}", id, newStatus);
    
    Order order = orders.findById(id)
        .orElseThrow(() -> {
          log.error("❌ Orden {} no encontrada", id);
          return new NotFoundException("Orden no encontrada con ID: " + id);
        });
    
    // Validar transiciones de estado
    validateStatusTransition(order.getStatus(), newStatus, id);
    
    // Actualizar el estado
    order.setStatus(newStatus);
    Order updatedOrder = orders.save(order);
    
    log.info("✅ Orden {} actualizada - Estado: {} -> {}", id, order.getStatus(), newStatus);
    
    return toDTO(updatedOrder);
  }

  @Override
  public OrderSummaryDTO processOrderSummary(Long id, Order.Status newStatus) {
    log.info("🔄 Procesando orden (OrderSummaryDTO) {} - Nuevo estado: {}", id, newStatus);
    
    Order order = orders.findById(id)
        .orElseThrow(() -> {
          log.error("❌ Orden {} no encontrada", id);
          return new NotFoundException("Orden no encontrada con ID: " + id);
        });
    
    // Validar transiciones de estado
    validateStatusTransition(order.getStatus(), newStatus, id);
    
    // Actualizar el estado
    Order.Status previousStatus = order.getStatus();
    order.setStatus(newStatus);
    Order updatedOrder = orders.save(order);
    
    log.info("✅ Orden {} actualizada - Estado: {} -> {}", id, previousStatus, newStatus);
    
    return toOrderSummaryDTO(updatedOrder);
  }

  @Override
  public OrderSummaryDTO markPickupComplete(Long orderId) {
    log.info("🏪 Farmacéutico marcando pickup completado - Orden: {}", orderId);
    
    // 1. Buscar la orden
    Order order = orders.findById(orderId)
        .orElseThrow(() -> {
          log.error("❌ Orden {} no encontrada", orderId);
          return new NotFoundException("Orden no encontrada con ID: " + orderId);
        });
    
    // 2. Validar que el método de entrega es PICKUP
    if (!"PICKUP".equalsIgnoreCase(order.getDeliveryMethod())) {
      log.error("❌ Intento de marcar pickup en orden con método: {} - Orden: {}", 
                order.getDeliveryMethod(), orderId);
      throw new BadRequestException(
          "Solo las órdenes con método de entrega PICKUP pueden marcarse como recogidas. " +
          "Esta orden usa: " + order.getDeliveryMethod()
      );
    }
    
    // 3. Validar que la orden contiene productos RX (opcional pero recomendado)
    boolean hasRxProduct = order.getItems().stream()
        .anyMatch(item -> {
          Product product = item.getProduct();
          return product.getRequiresPrescription() != null && product.getRequiresPrescription();
        });
    
    if (!hasRxProduct) {
      log.warn("⚠️ Orden {} no contiene productos RX pero se marca pickup completo", orderId);
    }
    
    // 4. Validar estado actual (solo PENDING o PROCESSING pueden completarse)
    if (order.getStatus() == Order.Status.COMPLETED) {
      log.warn("⚠️ Orden {} ya está COMPLETED", orderId);
      throw new BadRequestException("La orden ya está completada");
    }
    
    if (order.getStatus() == Order.Status.CANCELLED) {
      log.error("❌ Intento de completar orden cancelada: {}", orderId);
      throw new BadRequestException("No se puede completar una orden cancelada");
    }
    
    // 5. Marcar como COMPLETED
    order.setStatus(Order.Status.COMPLETED);
    
    // 6. Si el pago era PENDING y es CASH, marcarlo como PAID
    if (order.getPaymentStatus() == Order.PaymentStatus.PENDING && 
        "CASH".equalsIgnoreCase(order.getPaymentMethod())) {
      order.setPaymentStatus(Order.PaymentStatus.PAID);
      log.info("💰 Pago en efectivo marcado como PAID - Orden: {}", orderId);
    }
    
    Order completedOrder = orders.save(order);
    
    log.info("✅ Pickup completado exitosamente - Orden: {}, RX: {}", orderId, hasRxProduct);
    
    return toOrderSummaryDTO(completedOrder);
  }

  // ================= Helpers =================

  // Validar transiciones de estado permitidas
  private void validateStatusTransition(Order.Status currentStatus, Order.Status newStatus, Long orderId) {
    log.debug("Validando transición: {} -> {}", currentStatus, newStatus);
    
    // Estados finales no pueden cambiar
    if (currentStatus == Order.Status.COMPLETED) {
      log.warn("⚠️ Transición no permitida de COMPLETED a {} - Orden: {}", newStatus, orderId);
      throw new BadRequestException("Transición no permitida de COMPLETED a " + newStatus);
    }
    
    if (currentStatus == Order.Status.CANCELLED) {
      log.warn("⚠️ Transición no permitida de CANCELLED a {} - Orden: {}", newStatus, orderId);
      throw new BadRequestException("Transición no permitida de CANCELLED a " + newStatus);
    }
    
    // Validar transiciones específicas
    // PENDING -> PROCESSING, CONFIRMED, CANCELLED
    // PROCESSING -> COMPLETED, CANCELLED
    // CONFIRMED -> PROCESSING, CANCELLED
    
    if (currentStatus == Order.Status.PENDING) {
      if (newStatus != Order.Status.PROCESSING && 
          newStatus != Order.Status.CONFIRMED && 
          newStatus != Order.Status.CANCELLED) {
        log.warn("⚠️ Transición no permitida de PENDING a {} - Orden: {}", newStatus, orderId);
        throw new BadRequestException("Transición no permitida de PENDING a " + newStatus);
      }
    }
    
    if (currentStatus == Order.Status.PROCESSING) {
      if (newStatus != Order.Status.COMPLETED && newStatus != Order.Status.CANCELLED) {
        log.warn("⚠️ Transición no permitida de PROCESSING a {} - Orden: {}", newStatus, orderId);
        throw new BadRequestException("Transición no permitida de PROCESSING a " + newStatus);
      }
    }
  }

  // Mapear Order a OrderSummaryDTO
  private OrderSummaryDTO toOrderSummaryDTO(Order order) {
    // 🔴 Detectar si la orden contiene productos con receta
    boolean hasRxProduct = order.getItems().stream()
        .anyMatch(item -> {
          Product product = item.getProduct();
          return product.getRequiresPrescription() != null && product.getRequiresPrescription();
        });
    
    // Mapear items
    List<OrderSummaryDTO.OrderItemSummary> items = order.getItems()
        .stream()
        .map(item -> new OrderSummaryDTO.OrderItemSummary(
            item.getProduct().getId(),
            item.getProduct().getNombre(),
            item.getUnitPrice(),
            item.getQuantity(),
            item.getLineTotal()
        ))
        .collect(Collectors.toList());
    
    // Mapear delivery info
    OrderSummaryDTO.DeliveryInfo delivery = new OrderSummaryDTO.DeliveryInfo(
        order.getFullName(),
        order.getDeliveryStreet(),
        order.getDeliveryCity(),
        order.getDeliveryZip(),
        order.getDeliveryPhone(),
        order.getDeliveryEmail(),
        order.getDeliveryMethod()
    );
    
    // Mapear payment info
    OrderSummaryDTO.PaymentInfo payment = new OrderSummaryDTO.PaymentInfo(
        order.getPaymentMethod(),
        order.getPaymentStatus() != null ? order.getPaymentStatus().name() : "PENDING"
    );
    
    return new OrderSummaryDTO(
        order.getId(),
        order.getStatus().name(),
        order.getTotal(),
        order.getCreatedAt(),
        items,
        delivery,
        payment,
        hasRxProduct  // 🔴 Nuevo campo
    );
  }

  private OrderDTO toDTO(Order order) {
    // Mapear items
    List<OrderItemDTO> itemDTOs = order.getItems()
        .stream()
        .map(this::toItemDTO)
        .collect(Collectors.toList());
    
    // Usar el total guardado en la orden (más confiable)
    double total = order.getTotal() != null ? 
        order.getTotal().doubleValue() : 0.0;
    
    // Formatear fecha
    DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
    String createdAt = order.getCreatedAt() != null ? 
        formatter.format(order.getCreatedAt()) : null;
    
    // Mapear todos los campos planos de entrega y pago
    return new OrderDTO(
        order.getId(),
        order.getStatus() != null ? order.getStatus().name() : "PENDING",
        total,
        itemDTOs,
        order.getFullName() != null ? order.getFullName() : "",
        order.getDeliveryStreet() != null ? order.getDeliveryStreet() : "",
        order.getDeliveryCity() != null ? order.getDeliveryCity() : "",
        order.getDeliveryZip() != null ? order.getDeliveryZip() : "",
        order.getDeliveryEmail() != null ? order.getDeliveryEmail() : "",
        order.getDeliveryPhone() != null ? order.getDeliveryPhone() : "",
        order.getDeliveryMethod() != null ? order.getDeliveryMethod() : "",
        order.getPaymentMethod() != null ? order.getPaymentMethod() : "",
        createdAt
    );
  }

  private OrderItemDTO toItemDTO(OrderItem item) {
    double unitPrice = item.getUnitPrice() != null ? 
        item.getUnitPrice().doubleValue() : 0.0;
    int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
    double lineTotal = unitPrice * quantity;
    
    return new OrderItemDTO(
        item.getProduct().getId(),
        item.getProduct().getNombre(),
        unitPrice,
        quantity,
        lineTotal
    );
  }
}