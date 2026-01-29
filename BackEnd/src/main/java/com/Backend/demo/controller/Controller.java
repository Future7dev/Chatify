package com.Backend.demo.controller;

import com.Backend.demo.entity.UserEntity;
import com.Backend.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
    @GetMapping("/login")
    public Map<String,Object> login(Authentication authentication){
        Optional<UserEntity> user=userService.findByGmail(authentication.getName());
        System.out.println(authentication.getName());
        HashMap<String,Object> map=new HashMap<>();
        map.put("name",user.get().getName());
        map.put("gmail",user.get().getGmail());
        return map;
    }
}
