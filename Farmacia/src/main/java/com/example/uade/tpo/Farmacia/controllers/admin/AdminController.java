package com.example.uade.tpo.Farmacia.controllers.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.uade.tpo.Farmacia.controllers.auth.AuthenticationResponse;
import com.example.uade.tpo.Farmacia.controllers.dto.AdminCreateUserRequest;
import com.example.uade.tpo.Farmacia.service.AdminUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminUserService adminUserService;

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthenticationResponse> createUser(
            @RequestBody AdminCreateUserRequest request) {
        AuthenticationResponse response = adminUserService.createUserWithRole(request);
        return ResponseEntity.ok(response);
    }
}
