package com.cozycollections.backend_cozy.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

import java.util.HashMap;
import java.util.Map;
//JWT hatası oluştuğunda ne yapılacağını belirleyen sınıf.
@Component
public class JwtEntryPoint implements AuthenticationEntryPoint { //Spring Security'de yetkisiz erişimler olduğunda tetiklenir.
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        final Map<String,Object> body = new HashMap<>();
        body.put("error :", "Unauthorized");
        body.put("message", "Invalid credentials");
        final ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), body);
    }
}
