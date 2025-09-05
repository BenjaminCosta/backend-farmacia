package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @PostMapping("path")
    public User createUser(@RequestBody User user){
        return userService.SaveUser(user);}
    
    @GetMapping
    public List<User> getAllUsers(){
        return userService.getAllUsers();}
    
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id){
        return userService.getUserById(id);}
}
    

