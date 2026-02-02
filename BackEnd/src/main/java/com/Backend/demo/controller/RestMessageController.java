package com.Backend.demo.controller;

import com.Backend.demo.entity.MessageEntity;
import com.Backend.demo.services.MessageService;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Console;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/message")
public class RestMessageController {
    @Autowired
    private MessageService messageService;
    @Autowired
    SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{user2}")
    public List<MessageEntity> getHistory(Authentication authentication, @PathVariable String user2){
        return messageService.getHistory(authentication.getName(),user2);
    }

    @PostMapping("/voice")
    public MessageEntity setVoice(@RequestParam MultipartFile file, @RequestParam String receiver, Principal principal){
        String  sender= principal.getName();
        String fileName="voice/"+ UUID.randomUUID()+".webm";
        byte[] fb=null;
        try {
            fb=file.getBytes();
        }
        catch (Exception e){
            System.out.println(e);
        }
        Bucket bucket = StorageClient.getInstance().bucket();
        Blob blob=bucket.create(
                fileName,
                fb,
                "audio/webm"

        );
        String audioUrl = String.format(
                "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucket.getName(),
                URLEncoder.encode(fileName, StandardCharsets.UTF_8)
        );

        MessageEntity msg=new MessageEntity(sender,receiver,audioUrl, LocalDateTime.now());
        messageService.saveMessage(msg);


        messagingTemplate.convertAndSendToUser(
                receiver,
                "/queue/messages",
                msg
        );
        return msg;

    }

}
