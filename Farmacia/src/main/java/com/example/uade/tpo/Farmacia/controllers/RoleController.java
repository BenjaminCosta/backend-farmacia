package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.service.RoleService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping
    public Role createRole(@RequestBody Role role){
        return roleService.saveRole(role);}

    @GetMapping
    public List<Role> getAllRoles(){
        return roleService.getAllRoles();}
    
    @GetMapping("/{name}")
    public Role getRoleByName(@PathVariable String name){
        return roleService.getRoleByName(name).orElse(null);}
    
    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Long id){
        roleService.deleteRole(id);}

}
