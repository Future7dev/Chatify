package com.Backend.demo.services;

import com.Backend.demo.entity.MessageEntity;
import com.Backend.demo.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    @Autowired
    public MessageRepository messageRepository;

    public MessageEntity saveMessage(MessageEntity message){
        return messageRepository.save(message);
    }
    public List<MessageEntity> getHistory(String user1,String user2){
        return messageRepository.findChatHistory(user1,user2);
    }
}
