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
        // ✅ email is passed in from the controller, which reads it from the
        //    X-User-Email header injected by the gateway — no JWT parsing needed here
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

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

    public UserProfile get(String email) {
        // ✅ Convenience method for GET /profile endpoint
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        return profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not yet created for this user"));
    }
}