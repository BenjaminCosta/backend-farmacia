package com.example.uade.tpo.Farmacia.service.impl;

import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.repository.RoleRepository;
import com.example.uade.tpo.Farmacia.service.UserService;

import exceptions.UserAlreadyExistsException;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public User createUser(String username, String password, String email, String roleName) {

        if(userRepository.findByUsername(username).isPresent()) {
            throw new UserAlreadyExistsException("Este usuario ya existe");
        }

        if(userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("Este email ya ha sido registrado");
        }

        Optional<Role> roleOpt = roleRepository.findByName(roleName);
        if(roleOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Este rol no existe");
        }
        Role role = roleOpt.get();

        User user = new User(username, password, email, role);
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
}


}
