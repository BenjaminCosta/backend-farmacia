package com.example.uade.tpo.Farmacia.controllers.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.Farmacia.controllers.dto.AdminUserDTO;
import com.example.uade.tpo.Farmacia.controllers.dto.CreateUserRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.RoleDTO;
import com.example.uade.tpo.Farmacia.controllers.dto.UpdateUserRoleRequest;
import com.example.uade.tpo.Farmacia.service.AdminUserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminUserService adminUserService;

    /**
     * GET /api/v1/admin/users - Listar todos los usuarios
     */
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        log.info("📋 GET /api/v1/admin/users - Listando usuarios");
        List<AdminUserDTO> users = adminUserService.getAllUsers();
        log.info("✅ {} usuarios encontrados", users.size());
        return ResponseEntity.ok(users);
    }
    
    /**
     * GET /api/v1/admin/users/{id} - Obtener un usuario por ID
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserDTO> getUserById(@PathVariable Long id) {
        log.info("🔍 GET /api/v1/admin/users/{} - Buscando usuario", id);
        AdminUserDTO user = adminUserService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * POST /api/v1/admin/users - Crear un nuevo usuario
     */
    @PostMapping("/users")
    public ResponseEntity<AdminUserDTO> createUser(@RequestBody CreateUserRequest request) {
        log.info("➕ POST /api/v1/admin/users - Creando usuario: {}", request.email());
        
        try {
            AdminUserDTO createdUser = adminUserService.createUser(request);
            log.info("✅ Usuario creado exitosamente: {}", createdUser.email());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            log.error("❌ Error al crear usuario: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * PUT /api/v1/admin/users/{id}/role - Actualizar el rol de un usuario
     */
    @PutMapping("/users/{id}/role")
    public ResponseEntity<AdminUserDTO> updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateUserRoleRequest request) {
        
        log.info("🔄 PUT /api/v1/admin/users/{}/role - Actualizando rol", id);
        
        try {
            AdminUserDTO updatedUser = adminUserService.updateUserRole(id, request);
            log.info("✅ Rol actualizado exitosamente");
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            log.error("❌ Error al actualizar rol: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * DELETE /api/v1/admin/users/{id} - Eliminar un usuario
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("🗑️ DELETE /api/v1/admin/users/{} - Eliminando usuario", id);
        
        try {
            adminUserService.deleteUser(id);
            log.info("✅ Usuario eliminado exitosamente");
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("❌ Error al eliminar usuario: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * GET /api/v1/admin/roles - Listar todos los roles disponibles
     */
    @GetMapping("/roles")
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        log.info("📋 GET /api/v1/admin/roles - Listando roles");
        List<RoleDTO> roles = adminUserService.getAllRoles();
        log.info("✅ {} roles encontrados", roles.size());
        return ResponseEntity.ok(roles);
    }
}
