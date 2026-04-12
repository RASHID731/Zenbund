package com.zenbund.backend.dto.ws;

import com.zenbund.backend.dto.response.MessageResponse;

public class WsMessageEvent {

    private String type; // "NEW_MESSAGE" | "EDIT_MESSAGE" | "DELETE_MESSAGE"
    private MessageResponse message; // null for DELETE_MESSAGE
    private Long messageId; // used for DELETE_MESSAGE
    private Long chatId;

    public WsMessageEvent() {
    }

    public WsMessageEvent(String type, MessageResponse message, Long messageId, Long chatId) {
        this.type = type;
        this.message = message;
        this.messageId = messageId;
        this.chatId = chatId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public MessageResponse getMessage() {
        return message;
    }

    public void setMessage(MessageResponse message) {
        this.message = message;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }
}
