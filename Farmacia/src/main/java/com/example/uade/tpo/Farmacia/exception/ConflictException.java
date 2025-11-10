package com.example.uade.tpo.Farmacia.exception;

// Excepción para errores 409 Conflict
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
