package com.cozycollections.backend_cozy.dtos;

import lombok.Data;

@Data
public class ImageDto {
    private Long id;
    private String fileName;
    private String downloadUrl;
}
