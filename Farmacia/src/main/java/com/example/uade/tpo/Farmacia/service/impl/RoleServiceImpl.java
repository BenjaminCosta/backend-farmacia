package com.example.uade.tpo.Farmacia.service.impl;

import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.repository.RoleRepository;
import com.example.uade.tpo.Farmacia.service.RoleService;

import exceptions.UserAlreadyExistsException;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Role saveRole(Role role) {
        if(roleRepository.findByName(role.getName()).isPresent()) {
            throw new UserAlreadyExistsException("Este rol ya existe");
        }
        return roleRepository.save(role);
    }
    
    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }
}
