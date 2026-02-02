package com.Backend.demo.controller;

import com.Backend.demo.entity.UserEntity;
import com.Backend.demo.services.MessageService;
import com.Backend.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class Controller {
    @Autowired
    private UserService userService;
    @Autowired
    private MessageService messageService;

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
    @GetMapping("/contacts")
    public List<List<String>> contacts(Authentication authentication){
        HashSet<String > set=messageService.getContacts(authentication.getName());
        List<List<String>> al=new ArrayList<>();
        int n= set.size();
        int i=1;
        Iterator<String> it=set.iterator();
        while(it.hasNext()){
            UserEntity u=userService.findByGmail(it.next()).get();
            al.add(new ArrayList<>(Arrays.asList(u.getName(),u.getGmail())));
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
        return new ArrayList<>(Arrays.asList(user.getName(),user.getGmail()));
    }

}
