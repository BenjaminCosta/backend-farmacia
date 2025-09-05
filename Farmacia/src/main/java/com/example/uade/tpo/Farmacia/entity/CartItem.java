package com.example.uade.tpo.Farmacia.entity;

import java.math.BigDecimal;

import javax.validation.constraints.Min;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@Entity
@Table(name = "cart_items", uniqueConstraints= @UniqueConstraint (columnNames= {"cart_id", "product_id"}))
public class CartItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cart_id", nullable=false)
    private Cart cart;

    @ManyToOne(optional=false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Min(1)
    @Column(nullable=false)
    private Integer quantity;

    @Column(nullable=false,precision=10,scale=2)
    private BigDecimal unitPrice; //precio al momento d agregar

    @Column(precision=10,scale=2)
    private BigDecimal unitDiscount; //descuento por unidad

    @Column(nullable=false, precision=10, scale=2)
    private BigDecimal lineTotal;   //quantity * (unitPrice- unitDiscount)

    public void recomputeLineTotal(){
        BigDecimal d = (unitDiscount == null ? BigDecimal.ZERO : unitDiscount);
        this.lineTotal= unitPrice.subtract(d).max(BigDecimal.ZERO).multiply(new BigDecimal(quantity));
    }

}