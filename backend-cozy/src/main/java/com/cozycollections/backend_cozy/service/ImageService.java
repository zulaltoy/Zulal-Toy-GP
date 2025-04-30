package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.dtos.ImageDto;
import com.cozycollections.backend_cozy.model.Image;
import com.cozycollections.backend_cozy.model.Product;
import com.cozycollections.backend_cozy.repository.ImageRepository;
import com.cozycollections.backend_cozy.service.Interfaces.IImageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {
    private final ImageRepository imageRepository;
    private final ProductService productService;

    @Override
    public Image getImageById(Long id) {
        return imageRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Image not found"));
    }

    @Override
    public void updateImage(MultipartFile file, Long id) {
        Image image = getImageById(id);
        try {
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setImage(new SerialBlob(file.getBytes()));
            imageRepository.save(image);

        } catch (IOException | SQLException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void deleteImage(Long id) {
      imageRepository.findById(id).ifPresentOrElse(imageRepository::delete,()->{
          throw new EntityNotFoundException("Image not found");
      });
    }

    @Override
    public List<ImageDto> saveImages(Long productId, List<MultipartFile> files) {
        Product product = productService.getProductById(productId);
        List<ImageDto> savedImages = new ArrayList<>();

        for(MultipartFile file : files){
            try{
                Image image= new Image();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setImage(new SerialBlob(file.getBytes()));
                image.setProduct(product);

                String rawDownloadUrl="/api/v1/images/image/download/";
                String downloadUrl= rawDownloadUrl + image.getId();
                image.setDownloadUrl(downloadUrl);
                Image savedImage = imageRepository.save(image);
                savedImage.setDownloadUrl(rawDownloadUrl + savedImage.getId());
                imageRepository.save(savedImage);

                ImageDto imageDto = new ImageDto();
                imageDto.setId(savedImage.getId());
                imageDto.setFileName(savedImage.getFileName());
                imageDto.setDownloadUrl(savedImage.getDownloadUrl());
                savedImages.add(imageDto);
            }catch ( IOException | SQLException e){
                throw new RuntimeException(e.getMessage());
            }
        }

        return savedImages;
    }
}
