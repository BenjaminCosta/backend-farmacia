package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.entity.User;
import java.util.List;


import org.springframework.stereotype.Service;

@Service
public interface UserService {
    User createUser(String username, String password, String email, String roleName);
    List<User> getAllUsers();
    User getUserById(Long id);
}
