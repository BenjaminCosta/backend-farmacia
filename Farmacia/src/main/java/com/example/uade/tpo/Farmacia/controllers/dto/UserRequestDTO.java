package com.example.uade.tpo.Farmacia.controllers.dto;

public class UserRequestDTO {
    private String username;
    private String password;
    private String email;
    private String roleName;

    public UserRequestDTO() {}

    public UserRequestDTO(String username, String password, String email, String roleName) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.roleName = roleName;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getRoleName() {
        return roleName;
    }
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
