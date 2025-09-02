package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.*;
import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.repository.RoleRepository;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    

    public User createUser(String username, String Password, String email){
        if(userRepository.findByUsername(username).isPresent){
            throw new UserAlreadyExistsException("Este usuario ya existe");}}

        if(userRepository.findByEmail(email).isPresent()){
            throw new UserAlreadyExistsException("Este email ya ha sido registrado");}

        Role role = roleRepository.findByName(roleName).isPresent(){
            throw new NotFoundException("Este rol no existe");}

        User user = new User(username, password, email, role);
        return userRepository.save(user);
    }
            

        
