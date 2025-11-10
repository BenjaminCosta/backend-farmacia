package com.example.uade.tpo.Farmacia.controllers.dto;

import lombok.Data;

@Data
public class CreateProductRequest {
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Double descuento;
    private Boolean requiresPrescription = false; // Default: venta libre
    private CategoryRef category;
    
    @Data
    public static class CategoryRef {
        private Long id;
    }
}
