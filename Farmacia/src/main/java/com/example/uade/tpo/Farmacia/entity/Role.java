package com.example.uade.tpo.Farmacia.entity;

import jakarta.persistence.*;
import jakarta.util.List;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String description;

    //falta el many to one

    public Role(){}

    public Role(String name, String description){
        this.name = name;
        this.description = description;
    }

    //faltan los setters aca tambien....
    public long getId(){
        return id;}
    public String getname(){
        return name;}
    public String getdescription(){
        return description;}

}