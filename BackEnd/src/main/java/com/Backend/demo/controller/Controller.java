package com.Backend.demo.controller;

import com.Backend.demo.entity.UserEntity;
import com.Backend.demo.services.MessageService;
import com.Backend.demo.services.UserPresenceService;
import com.Backend.demo.services.UserService;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api")
public class Controller {
    @Autowired
    private UserService userService;
    @Autowired
    private MessageService messageService;
    @Autowired
    private UserPresenceService presenceService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

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
        map.put("url",user.get().getImgUrl());
        return map;
    }
    @GetMapping("/contacts")
    public List<List<String>> contacts(Authentication authentication){
        HashSet<String > set=messageService.getContacts(authentication.getName());
        List<List<String>> al=new ArrayList<>();
        int n= set.size();
        int i=1;
        Iterator<String> it=set.iterator();
        while(it.hasNext()){
            UserEntity u=userService.findByGmail(it.next()).get();
            System.out.println(u.getImgUrl());
            al.add(new ArrayList<>(Arrays.asList(u.getName(),u.getGmail(),u.getImgUrl())));
        }
        return al;
    }
    @GetMapping("/exists")
    public ResponseEntity<Boolean> userExist(@RequestParam String gmail){

        boolean exist=userService.userExists(gmail);
        return ResponseEntity.ok(exist);
    }
    @GetMapping("/user")
    public List<String> userFinder(@RequestParam String gmail){
        UserEntity user=userService.findByGmail(gmail).get();
        return new ArrayList<>(Arrays.asList(user.getName(),user.getGmail(),user.getImgUrl()));
    }
    @GetMapping("/user/online")
    public Set<String> onlineUser(){
       return presenceService.getOnlineUsers();
    }

    @PostMapping("/profile/image")
    public String updateImage(@RequestParam MultipartFile file,Principal principal){
        String originalName = file.getOriginalFilename();
        String ext = originalName.substring(originalName.lastIndexOf("."));

        String filePath = "chat-files/" + UUID.randomUUID() + ext;

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        Bucket bucket = StorageClient.getInstance().bucket();

        Blob blob = bucket.create(
                filePath,
                bytes,
                file.getContentType()
        );

        String fileUrl = String.format(
                "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucket.getName(),
                URLEncoder.encode(filePath, StandardCharsets.UTF_8)
        );
        UserEntity user=userService.findByGmail(principal.getName()).get();
        user.setImgUrl(fileUrl);
        userService.saveUpdatedUser(user);
        System.out.println(fileUrl);
        return fileUrl;
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String,String >data,
                                           Principal principal
                                           ){

        UserEntity user=userService.findByGmail(principal.getName()).get();

        user.setName(data.get("name"));

        userService.saveUpdatedUser(user);
        return ResponseEntity.ok(user);

    }
    

}
