package com.example.vendor_crm.service;

import com.example.vendor_crm.dto.LoginRequest;
import com.example.vendor_crm.dto.LoginResponse;
import com.example.vendor_crm.exception.UnauthorizedException;
import com.example.vendor_crm.model.User;
import com.example.vendor_crm.repository.UserRepository;
import com.example.vendor_crm.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtil.createToken(user.getEmail(), user.getRole().name());
        return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole().name());
    }
}