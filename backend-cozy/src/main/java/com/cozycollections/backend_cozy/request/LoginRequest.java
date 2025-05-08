package com.cozycollections.backend_cozy.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Invalid login: email or password should not be empty")
    private String email;
    @NotBlank(message = "Invalid login: email or password should not be empty")
    private String password;
}
