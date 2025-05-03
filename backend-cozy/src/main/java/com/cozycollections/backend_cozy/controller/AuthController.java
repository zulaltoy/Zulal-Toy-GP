package com.cozycollections.backend_cozy.controller;

import com.cozycollections.backend_cozy.request.LoginRequest;
import com.cozycollections.backend_cozy.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Value("${auth.token.refreshExpirationInMils}")
    private Long refreshExpirationTime;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest){
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword()));

        String accessToken = jwtUtils.gerenateAccessTokenForUser(authentication);

        Map<String,String> token = new HashMap<>();
        token.put("access_token", accessToken);
        return ResponseEntity.ok(token);
    }
}
