package com.Backend.demo.controller;

import com.Backend.demo.entity.MessageEntity;
import com.Backend.demo.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/message")
public class RestMessageController {
    @Autowired
    private MessageService messageService;
    @GetMapping("/{user2}")
    public List<MessageEntity> getHistory(Authentication authentication, @PathVariable String user2){
        return messageService.getHistory(authentication.getName(),user2);
    }
}
