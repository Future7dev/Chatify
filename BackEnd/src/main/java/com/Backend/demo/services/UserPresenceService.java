package com.Backend.demo.services;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserPresenceService {
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    public void userOnline(String gmail) {
        onlineUsers.add(gmail);
    }

    public void userOffline(String gmail) {
        onlineUsers.remove(gmail);
    }

    public boolean isOnline(String gmail) {
        return onlineUsers.contains(gmail);
    }

    public Set<String> getOnlineUsers() {
        return onlineUsers;
    }
}
