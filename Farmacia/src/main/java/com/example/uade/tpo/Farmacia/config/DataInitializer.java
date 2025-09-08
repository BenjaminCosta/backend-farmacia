package com.example.uade.tpo.Farmacia.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;

    @PostConstruct
    public void initData() {
        // Crear roles por defecto si no existen
        createRoleIfNotExists("USER", "Usuario estándar");
        createRoleIfNotExists("ADMIN", "Administrador del sistema");
        createRoleIfNotExists("CUSTOMER", "Cliente de la farmacia");
        createRoleIfNotExists("PHARMACIST", "Farmacéutico");
    }

    private void createRoleIfNotExists(String name, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role(name, description);
            roleRepository.save(role);
            System.out.println("Rol creado: " + name);
        }
    }
}
