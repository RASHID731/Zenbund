package com.zenbund.backend.dto.ws;

public class WsTypingEvent {

    private Long senderId;
    private String senderName;
    private boolean isTyping;
    private Long chatId;

    public WsTypingEvent() {
    }

    public WsTypingEvent(Long senderId, String senderName, boolean isTyping, Long chatId) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.isTyping = isTyping;
        this.chatId = chatId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public boolean isTyping() {
        return isTyping;
    }

    public void setTyping(boolean typing) {
        isTyping = typing;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }
}
