package com.example.uade.tpo.Farmacia.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users") 

public class User {
    
    @Id
    @GeneratedValue(strategy = Generation TYPE.IDENTITY)
    private long id;

    private String name; //este deberia ser unico

    private String password;

    private String email; //este tamnien xdd

    public User(){}

    public User(String name, String password, String email) {
        this.name = name;
        this.password = password;
        this.email = email;
    }

    //faltan los setters ...
    public long getId(){
        return id;}
    public String getname(){
        return name;}
    public String getpassword(){
        return password;}
}
