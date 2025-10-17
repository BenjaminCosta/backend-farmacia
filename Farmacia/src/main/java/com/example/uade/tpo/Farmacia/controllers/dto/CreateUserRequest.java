package com.example.uade.tpo.Farmacia.controllers.dto;

public record CreateUserRequest(
    String email,
    String name,
    String password,
    Long roleId
) {}
