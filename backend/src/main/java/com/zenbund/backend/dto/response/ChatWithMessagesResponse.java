package com.zenbund.backend.dto.response;

import com.zenbund.backend.entity.Chat;
import com.zenbund.backend.entity.Message;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

public class ChatWithMessagesResponse {

    private Long id;
    private Long user1Id;
    private Long user2Id;
    private String user1Name;
    private String user1ProfilePicture;
    private String user2Name;
    private String user2ProfilePicture;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MessageResponse> messages;

    // Constructors
    public ChatWithMessagesResponse() {
    }

    public ChatWithMessagesResponse(Long id, Long user1Id, Long user2Id, LocalDateTime createdAt,
                                     LocalDateTime updatedAt, List<MessageResponse> messages) {
        this.id = id;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.messages = messages;
    }

    // Static factory method to convert from Entity to DTO
    public static ChatWithMessagesResponse fromEntity(Chat chat, List<Message> messageEntities) {
        List<MessageResponse> messageResponses = messageEntities.stream()
                .map(MessageResponse::fromEntity)
                .collect(Collectors.toList());

        return new ChatWithMessagesResponse(
                chat.getId(),
                chat.getUser1Id(),
                chat.getUser2Id(),
                LocalDateTime.ofInstant(chat.getCreatedAt(), ZoneId.systemDefault()),
                LocalDateTime.ofInstant(chat.getUpdatedAt(), ZoneId.systemDefault()),
                messageResponses
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser1Id() {
        return user1Id;
    }

    public void setUser1Id(Long user1Id) {
        this.user1Id = user1Id;
    }

    public Long getUser2Id() {
        return user2Id;
    }

    public void setUser2Id(Long user2Id) {
        this.user2Id = user2Id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<MessageResponse> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageResponse> messages) {
        this.messages = messages;
    }

    public String getUser1Name() {
        return user1Name;
    }

    public void setUser1Name(String user1Name) {
        this.user1Name = user1Name;
    }

    public String getUser1ProfilePicture() {
        return user1ProfilePicture;
    }

    public void setUser1ProfilePicture(String user1ProfilePicture) {
        this.user1ProfilePicture = user1ProfilePicture;
    }

    public String getUser2Name() {
        return user2Name;
    }

    public void setUser2Name(String user2Name) {
        this.user2Name = user2Name;
    }

    public String getUser2ProfilePicture() {
        return user2ProfilePicture;
    }

    public void setUser2ProfilePicture(String user2ProfilePicture) {
        this.user2ProfilePicture = user2ProfilePicture;
    }
}
