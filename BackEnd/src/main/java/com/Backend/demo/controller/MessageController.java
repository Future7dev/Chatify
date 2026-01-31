package com.Backend.demo.controller;

import com.Backend.demo.DTO.ChatMessageDTO;
import com.Backend.demo.entity.MessageEntity;
import com.Backend.demo.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class MessageController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO message,Principal principal) {
        System.out.println("WS Principal: " + principal.getName());
        System.out.println("sender :"+message.getSender()+"/n"+"recevier : "+message.getReceiver());
        MessageEntity msg = new MessageEntity(
                message.getSender(),
                message.getReceiver(),
                message.getContent()

        );

        messageService.saveMessage(msg);

        simpMessagingTemplate.convertAndSendToUser(
                message.getReceiver(),
                "/queue/messages",
                msg
        );
    }
}
