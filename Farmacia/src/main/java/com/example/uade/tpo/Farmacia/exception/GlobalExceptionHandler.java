package com.example.uade.tpo.Farmacia.exception;

import com.example.uade.tpo.Farmacia.exceptions.NotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Maneja errores de validación (@Valid)
     * Retorna 400 Bad Request con los errores de cada campo
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("message", "Error de validación");
        response.put("errors", errors);
        
        log.warn("Validation error: {}", errors);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Maneja credenciales incorrectas en login
     * Retorna 401 Unauthorized
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.UNAUTHORIZED.value());
        response.put("message", ex.getMessage() != null ? ex.getMessage() : "Email o contraseña incorrectos");
        
        log.warn("Authentication failed: {}", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * Maneja recursos no encontrados (productos, categorías, usuarios, etc.)
     * Retorna 404 Not Found
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFoundException(NotFoundException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.NOT_FOUND.value());
        response.put("message", ex.getMessage() != null ? ex.getMessage() : "Recurso no encontrado");
        
        log.warn("Resource not found: {}", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Maneja errores de lógica de negocio (email duplicado, campos vacíos, etc.)
     * Retorna 400 Bad Request
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("message", ex.getMessage() != null ? ex.getMessage() : "Solicitud inválida");
        
        log.warn("Business logic error: {}", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Maneja violaciones de integridad de datos (duplicados, FK, etc.)
     * Retorna 409 Conflict
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.CONFLICT.value());
        
        String message = "Conflicto de integridad de datos";
        if (ex.getMessage() != null) {
            if (ex.getMessage().contains("Duplicate entry")) {
                message = "Ya existe un registro con esos datos";
            } else if (ex.getMessage().contains("foreign key constraint")) {
                message = "No se puede eliminar porque está siendo utilizado";
            }
        }
        response.put("message", message);
        
        log.warn("Data integrity violation: {}", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * Maneja errores de runtime (problemas con guardado, token, etc.)
     * Retorna 500 Internal Server Error
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("message", "Error interno del servidor");
        
        // Log el error completo pero no lo exponemos al cliente por seguridad
        log.error("Runtime error: {}", ex.getMessage(), ex);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Maneja cualquier otra excepción no controlada
     * Retorna 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("message", "Error interno del servidor");
        
        // Log el error completo pero no lo exponemos al cliente por seguridad
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
