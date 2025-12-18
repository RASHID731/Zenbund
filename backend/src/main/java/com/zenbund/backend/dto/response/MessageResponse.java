package com.zenbund.backend.dto.response;

import com.zenbund.backend.entity.Message;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class MessageResponse {

    private Long id;
    private Long chatId;
    private Long senderId;
    private String text;
    private LocalDateTime createdAt;

    // Constructors
    public MessageResponse() {
    }

    public MessageResponse(Long id, Long chatId, Long senderId, String text, LocalDateTime createdAt) {
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.text = text;
        this.createdAt = createdAt;
    }

    // Static factory method to convert from Entity to DTO
    public static MessageResponse fromEntity(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getChatId(),
                message.getSenderId(),
                message.getText(),
                LocalDateTime.ofInstant(message.getCreatedAt(), ZoneId.systemDefault())
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
