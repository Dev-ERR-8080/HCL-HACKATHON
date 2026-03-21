package com.Auth_Service.service;

import com.Auth_Service.dto.ProfileRequest;
import com.Auth_Service.entity.User;
import com.Auth_Service.entity.UserProfile;
import com.Auth_Service.repository.ProfileRepository;
import com.Auth_Service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProfileRepository profileRepo;

    public UserProfile save(String email, ProfileRequest req) {

        User user = userRepo.findByEmail(email).orElseThrow();

        UserProfile profile = profileRepo.findByUser(user)
                .orElse(new UserProfile());

        profile.setUser(user);
        profile.setFullName(req.getFullName());
        profile.setPhone(req.getPhone());
        profile.setGender(req.getGender());
        profile.setAddress(req.getAddress());
        profile.setCity(req.getCity());
        profile.setCountry(req.getCountry());

        return profileRepo.save(profile);
    }
}