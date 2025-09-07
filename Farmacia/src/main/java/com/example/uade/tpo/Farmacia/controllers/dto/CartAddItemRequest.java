package com.example.uade.tpo.Farmacia.controllers.dto;

import javax.validation.constraints.Min;

import jakarta.annotation.constraints.NotNull;

import jakarta.annotation.Nonnull;


public class CartAddItemRequest {
    
    @NotNull 
    private Long productId;

    @Nonnull
    @Min(1)
    private Integer quantity;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }


}
