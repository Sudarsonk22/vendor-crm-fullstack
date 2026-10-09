package com.example.vendor_crm.controller;

import com.example.vendor_crm.dto.LoginRequest;
import com.example.vendor_crm.dto.LoginResponse;
import com.example.vendor_crm.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

}