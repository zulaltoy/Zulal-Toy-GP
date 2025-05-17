package com.cozycollections.backend_cozy.service.Interfaces;

import com.cozycollections.backend_cozy.dtos.AddressDto;
import com.cozycollections.backend_cozy.model.Address;

import java.util.List;

public interface IAddressService {
        List<Address> getUserAddresses(Long userId);
        Address getAddressById(Long addressId);
        List<Address> createAddressesForUser(List<Address> addressList,Long userId);
        void deleteAddress(Long addressId);
        Address updateAddress(Long id,Address address);
        List<AddressDto> convertToAddressDto(List<Address> addressList);
        AddressDto convertToAddressDto(Address address);
}
