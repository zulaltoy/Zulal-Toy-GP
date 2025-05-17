package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.dtos.AddressDto;
import com.cozycollections.backend_cozy.model.Address;
import com.cozycollections.backend_cozy.repository.AddressRepository;
import com.cozycollections.backend_cozy.service.Interfaces.IAddressService;
import com.cozycollections.backend_cozy.service.Interfaces.IUserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService implements IAddressService {
    private final AddressRepository addressRepository;
    private final ModelMapper modelMapper;
    private final IUserService userService;

    @Override
    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    public Address getAddressById(Long addressId) {
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));
    }

    @Override
    public List<Address> createAddressesForUser(List<Address> addressList, Long userId) {
        return Optional.ofNullable(userService.getUserById(userId)) // Optional sayesinde null kontrolü yapılır. ve
                                                                    // kullanici var mi diye bakiliyor
                .map(user -> addressList.stream() // stream ile adresler işlenir
                        .peek(address -> address.setUser(user))// her adrese kullanıcıyı koy(peek ile ara islem yapilir
                                                               // yani burada da user ataniyor adreslere
                        .toList())
                .map(addressRepository::saveAll) // map ile dönüşüm ve kayıt yapılır.
                .orElse(Collections.emptyList());

    }

    @Override
    public void deleteAddress(Long addressId) {
        addressRepository.findById(addressId).ifPresentOrElse(addressRepository::delete, () -> {
            throw new EntityNotFoundException("Address not found");
        });
    }

    @Override
    public Address updateAddress(Long id, Address address) {
        return addressRepository.findById(id)
                .map(existingAddress -> { // bir degeri donusturmek icin kullanilir map
                    existingAddress.setCountry(address.getCountry());
                    existingAddress.setCity(address.getCity());
                    existingAddress.setStreet(address.getStreet());
                    existingAddress.setZip(address.getZip());
                    return addressRepository.save(existingAddress);

                }).orElseThrow(() -> new EntityNotFoundException("Address not found"));
    }

    @Override
    public List<AddressDto> convertToAddressDto(List<Address> addressList) {
        return addressList.stream().map(this::convertToAddressDto).toList();
    }

    @Override
    public AddressDto convertToAddressDto(Address address) {
        return modelMapper.map(address, AddressDto.class);
    }
}
