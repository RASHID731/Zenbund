package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.SendMessageRequest;
import com.zenbund.backend.dto.response.MessageResponse;
import com.zenbund.backend.entity.Chat;
import com.zenbund.backend.entity.Message;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.exception.UnauthorizedException;
import com.zenbund.backend.repository.ChatRepository;
import com.zenbund.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;

    public MessageServiceImpl(MessageRepository messageRepository,
                              ChatRepository chatRepository) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
    }

    @Override
    public MessageResponse sendMessage(Long chatId, Long senderId, SendMessageRequest request) {
        // Verify chat exists
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat", "id", chatId));

        // Verify sender is part of this chat
        if (!chat.getUser1Id().equals(senderId) && !chat.getUser2Id().equals(senderId)) {
            throw new UnauthorizedException("You are not authorized to send messages in this chat");
        }

        // Create and save message
        Message message = new Message(chatId, senderId, request.getText());
        Message savedMessage = messageRepository.save(message);

        // Update chat's updatedAt timestamp
        chat.setUpdatedAt(Instant.now());
        chatRepository.save(chat);

        return MessageResponse.fromEntity(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getChatMessages(Long chatId, Long userId) {
        // Verify chat exists and user is authorized
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat", "id", chatId));

        if (!chat.getUser1Id().equals(userId) && !chat.getUser2Id().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view these messages");
        }

        List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
        return messages.stream()
                .map(MessageResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", messageId));

        // Verify sender owns this message
        if (!message.getSenderId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own messages");
        }

        messageRepository.delete(message);
    }
}
