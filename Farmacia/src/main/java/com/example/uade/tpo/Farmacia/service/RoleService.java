package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.entity.Role;

import java.util.List;
import java.util.Optional;

public interface RoleService {
    Role saveRole(Role role);
    List<Role> getAllRoles();
    Optional<Role> getRoleByName(String name);
}
