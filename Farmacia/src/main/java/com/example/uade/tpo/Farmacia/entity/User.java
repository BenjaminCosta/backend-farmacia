package com.example.uade.tpo.Farmacia.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users") 

public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    public User(){}

    public User(String name, String password, String email, Role role){
        this.name = name;
        this.password = password;
        this.email = email;
        this.role = role;
    }


    public long getId(){
        return id;}
    public String getname(){
        return name;}
    public String getpassword(){
        return password;}
    public String getemail(){
        return email;}

    public void setId(long id){
        this.id = id;}
    public void setName(String name){
        this.name = name;}
    public void setPassword(String password){
        this.password = password;}
    public void setEmail(String email){
        this.email = email;}

}
