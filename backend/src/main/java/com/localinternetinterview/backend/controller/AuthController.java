package com.localinternetinterview.backend.controller;

import com.localinternetinterview.backend.dto.LoginRequest;
import com.localinternetinterview.backend.dto.LoginResponse;
import com.localinternetinterview.backend.dto.RegisterRequest;
import com.localinternetinterview.backend.entity.User;
import com.localinternetinterview.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(
            @Valid @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}