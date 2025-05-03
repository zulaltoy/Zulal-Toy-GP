package com.cozycollections.backend_cozy.config;

import com.cozycollections.backend_cozy.security.jwt.AuthTokenFilter;
import com.cozycollections.backend_cozy.security.jwt.JwtEntryPoint;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class AppConfig {
    @Value("${api.prefix}")
    private static String API;
    private static final List<String> SECURED_URLS =
            List.of(API + "/carts/**",API + "/cartItems/**",API + "/orders/**");

    private final JwtEntryPoint jwtEntryPoint;

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthTokenFilter authTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authTokenFilter) throws Exception {
        return authTokenFilter.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer :: disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(SECURED_URLS.toArray(String[]::new)).authenticated()
                        .anyRequest().permitAll());

        http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
//@Configuration
//@EnableWebSecurity
//@RequiredArgsConstructor
//public class AppConfig {
//
//    @Value("${api.prefix}")
//    private String apiPrefix;
//
//    private static String API;
//    private static List<String> SECURED_URLS;
//
//    private final JwtEntryPoint jwtEntryPoint;
//
//    @PostConstruct
//    public void init() {
//        API = apiPrefix;
//        SECURED_URLS = List.of(
//                API + "/carts/**",
//                API + "/cartItems/**",
//                API + "/orders/**"
//        );
//    }
//
//    @Bean
//    public ModelMapper modelMapper() {
//        return new ModelMapper();
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public AuthTokenFilter authTokenFilter() {
//        return new AuthTokenFilter();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration authTokenFilter) throws Exception {
//        return authTokenFilter.getAuthenticationManager();
//    }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//
//        http.csrf(AbstractHttpConfigurer::disable)
//                .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtEntryPoint))
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(SECURED_URLS.toArray(new String[0])).authenticated()
//                        .anyRequest().permitAll());
//
//        http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);
//        return http.build();
//    }
//}

