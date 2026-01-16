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
    private LocalDateTime editedAt;
    private boolean isEdited;

    // Constructors
    public MessageResponse() {
    }

    public MessageResponse(Long id, Long chatId, Long senderId, String text, LocalDateTime createdAt, LocalDateTime editedAt, boolean isEdited) {
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.text = text;
        this.createdAt = createdAt;
        this.editedAt = editedAt;
        this.isEdited = isEdited;
    }

    // Static factory method to convert from Entity to DTO
    public static MessageResponse fromEntity(Message message) {
        LocalDateTime editedAtConverted = message.getEditedAt() != null
            ? LocalDateTime.ofInstant(message.getEditedAt(), ZoneId.systemDefault())
            : null;

        return new MessageResponse(
                message.getId(),
                message.getChatId(),
                message.getSenderId(),
                message.getText(),
                LocalDateTime.ofInstant(message.getCreatedAt(), ZoneId.systemDefault()),
                editedAtConverted,
                message.getEditedAt() != null
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

    public LocalDateTime getEditedAt() {
        return editedAt;
    }

    public void setEditedAt(LocalDateTime editedAt) {
        this.editedAt = editedAt;
    }

    public boolean isEdited() {
        return isEdited;
    }

    public void setEdited(boolean edited) {
        isEdited = edited;
    }
}
