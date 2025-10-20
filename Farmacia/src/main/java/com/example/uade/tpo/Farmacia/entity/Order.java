package com.example.uade.tpo.Farmacia.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Getter @Setter
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

  public enum Status { PENDING, PROCESSING, COMPLETED, CANCELLED }

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal total;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", length = 20, nullable = false)
  private Status status = Status.PENDING;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  // Delivery information
  @Column(name = "full_name")
  private String fullName;
  
  @Column(name = "delivery_email")
  private String deliveryEmail;
  
  @Column(name = "delivery_phone")
  private String deliveryPhone;
  
  @Column(name = "delivery_street")
  private String deliveryStreet;
  
  @Column(name = "delivery_city")
  private String deliveryCity;
  
  @Column(name = "delivery_zip")
  private String deliveryZip;
  
  @Column(name = "delivery_method")
  private String deliveryMethod;
  
  @Column(name = "payment_method")
  private String paymentMethod;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<OrderItem> items = new ArrayList<>();
}
