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

    private  boolean isRead;

    private String fileUrl;
    private String fileType;
    private String fileName;


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

    public MessageEntity(String sender, String receiver, String fileUrl, String fileType, String fileName, LocalDateTime timeStamp) {
        this.sender = sender;
        this.receiver = receiver;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileName = fileName;
        this.timeStamp = timeStamp;
        this.content=null;
        this.audioUrl=null;
    }

    public boolean isRead() {
        return isRead;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setRead(boolean read) {
        isRead = read;
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
