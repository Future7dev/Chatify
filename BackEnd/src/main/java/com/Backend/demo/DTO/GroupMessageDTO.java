package com.Backend.demo.DTO;

public class GroupMessageDTO {



    private String sender;

    private long groupId;

    private String content;
    public GroupMessageDTO(){}

    public GroupMessageDTO(String sender, long groupId, String content) {
        this.sender = sender;
        this.groupId = groupId;
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public long getGroupId() {
        return groupId;
    }

    public void setGroupId(long groupId) {
        this.groupId = groupId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
