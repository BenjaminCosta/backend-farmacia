package com.example.uade.tpo.Farmacia.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120)
  private String nombre;

  @Column(length = 500)
  private String descripcion;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal precio;

  @Column(nullable = false)
  private Integer stock;

  @Column(precision = 10, scale = 2)
  private BigDecimal descuento;

  @Column(nullable = false)
  private Boolean requiresPrescription = false;

  @ManyToOne(optional = false)
  @JoinColumn(name = "category_id", nullable = false)
  private Category category;

  // Métodos adicionales para compatibilidad
  public BigDecimal getPrecio() {
    return precio;
  }
  
  public void setPrecio(BigDecimal precio) {
    this.precio = precio;
  }
  
  public BigDecimal getDescuento() {
    return descuento;
  }
  
  public void setDescuento(BigDecimal descuento) {
    this.descuento = descuento;
  }
  
  public Integer getStock() {
    return stock;
  }
  
  public void setStock(Integer stock) {
    this.stock = stock;
  }
}