package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.service.RoleService;
import com.example.uade.tpo.Farmacia.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping
    public Role createRole(@RequestBody Role role){
        return RoleService.SaveRole(role);}
    
    @GetMapping
    public List<Role> getAllRoles(){
        return roleService.getAllRoles();}
    
    @GetMapping("/{name}}")
    public Role getRoleByName(@PathVariable String name){
        return roleService.getRoleByName(name);}
}
