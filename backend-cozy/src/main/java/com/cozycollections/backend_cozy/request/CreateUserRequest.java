package com.cozycollections.backend_cozy.request;

import com.cozycollections.backend_cozy.model.Address;
import lombok.Data;

import java.util.List;

@Data
public class CreateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;

    private List<Address> addresses;
}
