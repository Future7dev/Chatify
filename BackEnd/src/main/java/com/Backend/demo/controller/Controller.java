package com.Backend.demo.controller;

import com.Backend.demo.entity.UserEntity;
import com.Backend.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Controller {
    @Autowired
    private UserService userService;
    @PostMapping("/signup")
    public ResponseEntity<?> saveUser(@RequestBody UserEntity user){

        userService.saveUser(user);
        return ResponseEntity.ok("signUp successful");
    }
}
