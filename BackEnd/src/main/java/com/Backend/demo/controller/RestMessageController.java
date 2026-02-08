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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    @PostMapping("/file")
    public MessageEntity uploadFile(
            @RequestParam MultipartFile file,
            @RequestParam String receiver,
            Principal principal
    ) {

        String sender = principal.getName();

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

        String type = file.getContentType().startsWith("image")
                ? "image"
                : file.getContentType().equals("application/pdf")
                ? "pdf"
                : "file";

        MessageEntity msg = new MessageEntity(
                sender,
                receiver,
                fileUrl,
                type,
                originalName,
                LocalDateTime.now()
        );

        messageService.saveMessage(msg);

        messagingTemplate.convertAndSendToUser(
                receiver,
                "/queue/messages",
                msg
        );

        return msg;
    }

    @PutMapping("/read/{sender}")
    public void markRead(@PathVariable String sender,Principal principal){
        messageService.markAsRead(sender, principal.getName());
    }
    @GetMapping("/unread-count")
    public Map<String,Long> getUndreadMessages(Principal principal){
        List<Object[]> l=messageService.getUnreadMessages(principal.getName());

        Map<String ,Long> map=new HashMap<>();

        for(Object row[]:l){
            map.put((String)row[0],(long)row[1]);
        }
        return map;
    }

    @GetMapping("/last-messages")
    public Map<String,MessageEntity> getLastMessages(Principal principal){
        return messageService.getLastMessages(principal.getName());
    }


}
