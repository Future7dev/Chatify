package com.Backend.demo.Configs;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FireBaseConfig {
    @PostConstruct
    public void init() throws IOException{
        InputStream serviceAccount= new ClassPathResource("firebase-service-account.json").getInputStream();
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket("chat-app-7739a.firebasestorage.app")
                .build();
        if (FirebaseApp.getApps().isEmpty()){
            FirebaseApp.initializeApp(options);
        }
    }
}
