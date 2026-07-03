package com.perutours.auth.controller;

import com.perutours.auth.dto.UserRequest;
import com.perutours.auth.dto.UserResponse;
import com.perutours.auth.model.Usuario;
import com.perutours.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest request) {
        UserResponse response = authService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<UserResponse> registro(@RequestBody Usuario usuario) {
        UserResponse response = authService.registro(usuario);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }
}
