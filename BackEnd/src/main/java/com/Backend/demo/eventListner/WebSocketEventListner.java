package com.Backend.demo.eventListner;

import com.Backend.demo.services.UserPresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;

@Component
public class WebSocketEventListner {
    @Autowired
    private UserPresenceService presenceService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @EventListener
    public void handleConnect(SessionConnectEvent event){
        StompHeaderAccessor accessor=
                StompHeaderAccessor.wrap(event.getMessage());
        String gmail=accessor.getFirstNativeHeader("gmail");
        System.out.println("enent connect : gmail: "+gmail);
        if(gmail!=null){
            accessor.getSessionAttributes().put("gmail", gmail);
            presenceService.userOnline(gmail);
            HashMap<String,Boolean> map=new HashMap<>();
            map.put(gmail,true);
            messagingTemplate.convertAndSend(
                    "/topic/presence",
                    map
            );
        }
    }
    @EventListener
    public  void handleDisconnect(SessionDisconnectEvent event){
        StompHeaderAccessor accessor=
                StompHeaderAccessor.wrap(event.getMessage());
        String gmail = (String) accessor
                .getSessionAttributes()
                .get("gmail");
        System.out.println("enent disconnect : gmail: "+gmail);
        if (gmail!=null){

            presenceService.userOffline(gmail);
            HashMap<String,Boolean> map=new HashMap<>();
            map.put(gmail,false);
            messagingTemplate.convertAndSend("/topic/presence",
                    map
                    );
        }
    }

}
