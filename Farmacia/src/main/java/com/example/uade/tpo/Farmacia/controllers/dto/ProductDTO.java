package com.example.uade.tpo.Farmacia.controllers.dto;

public record ProductDTO(
    Long id,
    String name,
    String description,
    Double price,
    Integer stock,
    Double discount,
    Long categoryId,
    String categoryName
) {}
