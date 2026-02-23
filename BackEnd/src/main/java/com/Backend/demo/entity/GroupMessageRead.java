package com.Backend.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "group_message_read")
public class GroupMessageRead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private  String username;

    private long groupId;

    private long messageId;

    public GroupMessageRead(){

    }

    public GroupMessageRead(String username, long groupId, long messageId) {
        this.username = username;
        this.groupId = groupId;
        this.messageId = messageId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public long getGroupId() {
        return groupId;
    }

    public void setGroupId(long groupId) {
        this.groupId = groupId;
    }

    public long getMessageId() {
        return messageId;
    }

    public void setMessageId(long messageId) {
        this.messageId = messageId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
