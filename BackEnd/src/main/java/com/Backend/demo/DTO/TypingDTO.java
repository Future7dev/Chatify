package com.Backend.demo.DTO;

public class TypingDTO {

    private String sender;
    private String receiver;

    public TypingDTO(){}

    public TypingDTO(String sender, String receiver) {
        this.sender = sender;
        this.receiver = receiver;
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
}
