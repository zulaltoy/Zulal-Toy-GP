package com.cozycollections.backend_cozy.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginRequest {
    @NotEmpty(message = "Invalid login: email or password should not be empty")
    private String email;
    @NotEmpty(message = "Invalid login: email or password should not be empty")
    private String password;
}
