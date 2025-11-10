package com.example.uade.tpo.Farmacia.exception;

// Excepción para errores 404 Not Found
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
