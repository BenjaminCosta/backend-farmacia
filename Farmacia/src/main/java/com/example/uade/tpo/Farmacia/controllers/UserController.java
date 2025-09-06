package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.service.UserService;
import com.example.uade.tpo.Farmacia.controllers.dto.UserRequestDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public User createUser(@RequestBody UserRequestDTO userDTO){
        return userService.createUser(
                userDTO.getUsername(),
                userDTO.getPassword(),
                userDTO.getEmail(),
                userDTO.getRoleName()
        );
    }


    @GetMapping
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }


    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }
}
