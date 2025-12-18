package com.zenbund.backend.service;

import com.zenbund.backend.dto.response.ChatResponse;
import com.zenbund.backend.dto.response.ChatWithMessagesResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatService {

    /**
     * Create a new chat or get existing chat between current user and another user
     *
     * @param currentUserId the current user's ID
     * @param otherUserId   the other user's ID
     * @return the chat response
     */
    ChatResponse createOrGetChat(Long currentUserId, Long otherUserId);

    /**
     * Get all chats for a user
     *
     * @param userId the user ID
     * @return list of chat responses with last message
     */
    @Transactional(readOnly = true)
    List<ChatResponse> getUserChats(Long userId);

    /**
     * Get a specific chat with all messages
     *
     * @param chatId the chat ID
     * @param userId the user ID (for authorization)
     * @return chat with messages response
     */
    @Transactional(readOnly = true)
    ChatWithMessagesResponse getChatWithMessages(Long chatId, Long userId);

    /**
     * Delete a chat and all its messages
     *
     * @param chatId the chat ID
     * @param userId the user ID (for authorization)
     */
    void deleteChat(Long chatId, Long userId);
}
