package com.example.uade.tpo.Farmacia.controllers.dto;

public record DeliveryDTO(
    String fullName,
    String email,
    String phone,
    String street,
    String city,
    String zip,
    String method
) {}
