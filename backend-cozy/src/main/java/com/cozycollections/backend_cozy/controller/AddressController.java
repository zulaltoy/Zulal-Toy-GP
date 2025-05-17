package com.cozycollections.backend_cozy.controller;


import com.cozycollections.backend_cozy.dtos.AddressDto;
import com.cozycollections.backend_cozy.model.Address;
import com.cozycollections.backend_cozy.response.ApiResponse;
import com.cozycollections.backend_cozy.service.Interfaces.IAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/addresses")
public class AddressController {

    private final IAddressService addressService;

    @GetMapping("/{userId}/address")
    public ResponseEntity<ApiResponse> getUserAddresses(@PathVariable Long userId) {
        List<Address> addressList = addressService.getUserAddresses(userId);
        List<AddressDto> addressDtoList = addressService.convertToAddressDto(addressList);
        return ResponseEntity.ok(new ApiResponse("Success", addressDtoList));
    }
    @GetMapping("/{id}/address")
    public ResponseEntity<ApiResponse> getAddressById(@PathVariable Long id) {
        Address address = addressService.getAddressById(id);
        AddressDto addressDto = addressService.convertToAddressDto(address);
        return  ResponseEntity.ok(new ApiResponse("Success", addressDto));
    }
    @PostMapping("/{userId}/add")
    public ResponseEntity<ApiResponse> addAddress( @RequestBody List<Address> addresses,@PathVariable Long userId) {

        List<Address> addressList = addressService.createAddressesForUser(addresses, userId);
        List<AddressDto> addressDtoList = addressService.convertToAddressDto(addressList);
        return ResponseEntity.ok(new ApiResponse("Addresses added successfully", addressDtoList));
    }
    @PutMapping("/{id}/update")
    public ResponseEntity<ApiResponse> updateAddress(@PathVariable Long id, @RequestBody Address address) {

        Address updatedAddress = addressService.updateAddress(id, address);
        AddressDto addressDto = addressService.convertToAddressDto(updatedAddress);
        return ResponseEntity.ok(new ApiResponse("Addresses updated successfully", addressDto));
    }
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable Long id){
        addressService.deleteAddress(id);
        return ResponseEntity.ok(new ApiResponse("Address deleted successfully", id));
    }

}
