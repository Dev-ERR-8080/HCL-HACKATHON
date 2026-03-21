package com.Auth_Service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    private String fullName;
    private String phone;
    private String gender;
    private String address;
    private String city;
    private String country;
}
