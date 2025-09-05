package exceptions;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String,Object>> handleIllegalState(IllegalStateException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            Map.of(
                    "timestamp", Instant.now().toString(),
                        "error", "Bad Request",
                        "message", ex.getMessage()
            )
        );
    }

@ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<Map<String,Object>> handleIllegalArg(IllegalArgumentException ex){
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "timestamp", Instant.now().toString(),
                        "error", "Bad Request",
                        "message", ex.getMessage()
                )
    );
}
}
