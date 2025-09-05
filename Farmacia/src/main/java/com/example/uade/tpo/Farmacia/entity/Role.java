package com.example.uade.tpo.Farmacia.entity;

import jakarta.persistence.*;
import java.util.Set;


@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String description;

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    private Set<User> users;
    
    public Role(){}

    public Role(String name, String description){
        this.name = name;
        this.description = description;
    }


    public long getId(){
        return id;}
    public String getname(){
        return name;}
    public String getdescription(){
        return description;}
    public void setId(long id){
        this.id = id;}
    public void setName(String name){
        this.name = name;}
    public void setDescription(String description){
        this.description = description;}

    }