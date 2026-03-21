package com.Auth_Service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender sender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("QuickInn - Your Password Reset OTP");
        msg.setText(
                "Hello,\n\n" +
                        "Your OTP for resetting your QuickInn password is:\n\n" +
                        "  " + otp + "\n\n" +
                        "This OTP is valid for 10 minutes. Do not share it with anyone.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "- QuickInn Team"
        );
        sender.send(msg);
    }
}