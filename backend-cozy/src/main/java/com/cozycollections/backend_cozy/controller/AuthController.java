package com.cozycollections.backend_cozy.controller;

import com.cozycollections.backend_cozy.request.LoginRequest;
import com.cozycollections.backend_cozy.security.cookie.CookieHelper;
import com.cozycollections.backend_cozy.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
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
    private final CookieHelper cookieHelper;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Value("${auth.token.refreshExpirationInMils}")
    private Long refreshTokenExpirationTime;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword()));

        String accessToken = jwtUtils.generateAccessTokenForUser(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(loginRequest.getEmail());

        cookieHelper.addRefreshTokenCookie(response,refreshToken,refreshTokenExpirationTime);

        Map<String,String> token = new HashMap<>();
        token.put("access_token", accessToken);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
        cookieHelper.logCookies(request);

        String refreshToken = cookieHelper.getRefreshTokenFromCookies(request);

        if(refreshToken != null) {
            boolean isValid = jwtUtils.validateToken(refreshToken);
            if(isValid) {
                String usernameFromToken = jwtUtils.getUserNameFromToken(refreshToken);
                UserDetails userDetails = userDetailsService.loadUserByUsername(usernameFromToken);
                 String newAccessToken = jwtUtils.generateAccessTokenForUser(
                         new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())
                 );
                 if(newAccessToken != null) {
                     Map<String,String> token = new HashMap<>();
                     token.put("access_token", newAccessToken);
                     return ResponseEntity.ok(token);
                 }else{
                     return ResponseEntity.status(500).body("Error refreshing access token");
                 }

            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired access token");
    }
}
