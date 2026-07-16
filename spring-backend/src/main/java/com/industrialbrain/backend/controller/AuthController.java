package com.industrialbrain.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.industrialbrain.backend.dto.LoginRequest;
import com.industrialbrain.backend.dto.LoginResponse;
import com.industrialbrain.backend.dto.RegisterRequest;
import com.industrialbrain.backend.service.AuthService;


@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        return authService.register(request);

    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return authService.login(request);

    }

}