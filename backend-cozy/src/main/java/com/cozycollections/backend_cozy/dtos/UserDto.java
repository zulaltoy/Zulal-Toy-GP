package com.cozycollections.backend_cozy.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    @JsonIgnore
    private List<OrderDto> orders;
    private CartDto cart;
}
