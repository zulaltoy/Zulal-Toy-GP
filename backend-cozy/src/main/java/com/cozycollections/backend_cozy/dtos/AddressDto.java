package com.cozycollections.backend_cozy.dtos;

import lombok.Data;

@Data
public class AddressDto {
    private Long id;
    private String country;
    private String city;
    private String street;
    private String zip;
}
