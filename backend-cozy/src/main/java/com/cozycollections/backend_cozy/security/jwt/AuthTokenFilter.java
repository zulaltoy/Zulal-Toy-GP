package com.cozycollections.backend_cozy.security.jwt;

import ch.qos.logback.core.util.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
// JWT'yi HTTP isteklerinde filtreleyen sınıf. Her istek geldiğinde kontrol eder: Token geçerli mi? Kullanıcı yetkili mi?
@Component //Spring’e bu sınıfın bir bileşen olduğunu söyler. Otomatik olarak Spring konteynırına eklenir ve kullanılabilir.
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired //Spring, JwtUtils nesnesini otomatik olarak enjekte eder. new kullanmaya gerek kalmaz.
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,  //JWT'yi kontrol eden ana metottur. Her HTTP isteği geldiğinde çalışır.
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {


        try{
            String jwt = parseJwt(request);
            if(StringUtils.hasText(jwt) && jwtUtils.validateToken(jwt)){
                String username = jwtUtils.getUserNameFromToken(jwt);
                List<String> roles = jwtUtils.getRolesFromToken(jwt);

                var authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(auth);
            }

        }catch (Exception e){
            sendErrorResponse(response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        HashMap<String,String> error = new HashMap<>();
        error.put("message", "Unauthorized user! Please log in and try again");


        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(error);
        response.getWriter().write(jsonResponse);
    }

    public String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if(StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")){
            return headerAuth.substring(7);
        }
        return null;
    }
}
