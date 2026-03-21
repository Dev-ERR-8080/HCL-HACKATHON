package com.Auth_Service.dto;

import lombok.Data;

@Data
public class ProfileRequest {
    private String fullName;
    private String phone;
    private String gender;
    private String address;
    private String city;
    private String country;
}