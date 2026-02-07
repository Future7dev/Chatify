package com.Backend.demo.services;

import com.Backend.demo.entity.MessageEntity;
import com.Backend.demo.entity.UserEntity;
import com.Backend.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserEntity saveUser(UserEntity user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<UserEntity> findByGmail(String gmail){
        return userRepository.findByGmail(gmail);
    }
    public boolean userExists(String gmail){
        return userRepository.existsByGmail(gmail);
    }


}

