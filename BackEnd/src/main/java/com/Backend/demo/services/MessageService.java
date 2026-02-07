package com.Backend.demo.services;

import com.Backend.demo.entity.MessageEntity;
import com.Backend.demo.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

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
    public HashSet<String> getContacts(String user){
        List<MessageEntity> mss=messageRepository.findContacts(user);
        HashSet<String> ans=new HashSet<>();
        for(MessageEntity m:mss){
            if(!m.getReceiver().equals(user)){
                ans.add(m.getReceiver());
            } else if (!m.getSender().equals(user)) {
                ans.add(m.getSender());

            }
        }
        return ans;

    }
    public  void markAsRead(String sender,String receiver){
        messageRepository.markAsRead(sender,receiver);
    }
    public List<Object[]> getUnreadMessages(String me){
        return messageRepository.getUnread(me);
    }

    public Map<String , MessageEntity> getLastMessages(String me){
        List<MessageEntity> msg=messageRepository.getLastMessages(me);

        Map<String ,MessageEntity> map=new HashMap<>();

        for(MessageEntity m:msg){
            String contact=m.getSender().equals(me)?
                    m.getReceiver():
                    m.getSender();
            if(!map.containsKey(contact)){
                map.put(contact, m);
            }
        }
        return map;
    }


}
