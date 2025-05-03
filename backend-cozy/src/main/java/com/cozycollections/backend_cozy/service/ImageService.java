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
    public void updateImage(MultipartFile file, Long id) { //MultipartFile: Gelen resim dosyasıdır.
        Image image = getImageById(id);
        try {
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setImage(new SerialBlob(file.getBytes()));// resmi byte array olarak alır ve BLOB'a çevirir.SerialBlob: Java’da dosyayı veritabanında saklanabilir hale getirir.
            imageRepository.save(image); // veritabanına kaydeder

        } catch (IOException | SQLException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void deleteImage(Long id) {
      imageRepository.findById(id).ifPresentOrElse(imageRepository::delete,()->{   //ID’ye göre resmi arar. Varsa siler. Yoksa hata verir.

          throw new EntityNotFoundException("Image not found");
      });
    }

    @Override
    public List<ImageDto> saveImages(Long productId, List<MultipartFile> files) {
        Product product = productService.getProductById(productId);    //Ürünü bulur ve kayıt edilen resimleri listeleyeceği boş bir liste oluşturur.
        List<ImageDto> savedImages = new ArrayList<>();

        for(MultipartFile file : files){ //Bu satır, gelen resim dosyalarını tek tek döngüye sokar ve her resim için işlemi yapar.
            try{
                Image image= new Image();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setImage(new SerialBlob(file.getBytes())); // // içeriği byte olarak al
                image.setProduct(product); // resim hangi ürüne ait


                String rawDownloadUrl="/api/v1/images/image/download/";
                String downloadUrl= rawDownloadUrl + image.getId();  //Burada, image.getId() eklenerek tam indirilebilir URL oluşturuluyor. Yani, her resmin ID'si eklendikçe her birinin indirilme linki farklı olacaktır.
                image.setDownloadUrl(downloadUrl);

                Image savedImage = imageRepository.save(image); //Resmi veritabanına kaydeder. Bu, resmi veritabanında oluşturur ve ID’sini otomatik olarak atar.
                savedImage.setDownloadUrl(rawDownloadUrl + savedImage.getId()); //Veritabanına kaydettikten sonra, kaydedilen resmin URL'sini günceller.
                imageRepository.save(savedImage);  //URL’yi ekledikten sonra resmi tekrar veritabanına kaydederiz.

                //İki kere save() yapmak: İlk kayıtta resmin verileri kaydedilir, ID oluşturulmaz.
                // İkinci kayıtta ise ID oluşturulduktan sonra downloadUrl eklenip kaydedilir.

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
