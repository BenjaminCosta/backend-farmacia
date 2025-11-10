package com.example.uade.tpo.Farmacia.controllers.dto;

public record ProductDTO(
    Long id,
    String name,
    String description,
    Double price,
    Integer stock,
    Double discount,
    Boolean requiresPrescription,
    Long categoryId,
    String categoryName
) {}
