package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.SendMessageRequest;
import com.zenbund.backend.dto.response.MessageResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageService {

    /**
     * Send a message in a chat
     *
     * @param chatId   the chat ID
     * @param senderId the sender's user ID
     * @param request  the send message request
     * @return the message response
     */
    MessageResponse sendMessage(Long chatId, Long senderId, SendMessageRequest request);

    /**
     * Get all messages in a chat
     *
     * @param chatId the chat ID
     * @param userId the user ID (for authorization)
     * @return list of message responses
     */
    @Transactional(readOnly = true)
    List<MessageResponse> getChatMessages(Long chatId, Long userId);

    /**
     * Delete a specific message
     *
     * @param messageId the message ID
     * @param userId    the user ID (for authorization)
     */
    void deleteMessage(Long messageId, Long userId);
}
