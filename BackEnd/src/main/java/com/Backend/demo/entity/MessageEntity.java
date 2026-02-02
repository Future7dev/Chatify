package com.Backend.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String sender;

    private String receiver;
    @Column(length = 1000)
    private String content;

    private String audioUrl;
    private LocalDateTime timeStamp;


    public MessageEntity(){

    }

    public MessageEntity(String sender, String receiver, String content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.audioUrl=null;
        this.timeStamp=LocalDateTime.now();
    }

    public MessageEntity(String sender, String receiver, String audioUrl, LocalDateTime timeStamp) {
        this.sender = sender;
        this.receiver = receiver;
        this.audioUrl = audioUrl;
        this.timeStamp = timeStamp;
        this.content=null;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }
}
