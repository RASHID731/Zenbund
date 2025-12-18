package com.zenbund.backend.service;

import com.zenbund.backend.dto.response.ChatResponse;
import com.zenbund.backend.dto.response.ChatWithMessagesResponse;
import com.zenbund.backend.dto.response.MessageResponse;
import com.zenbund.backend.entity.Chat;
import com.zenbund.backend.entity.Message;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.exception.UnauthorizedException;
import com.zenbund.backend.repository.ChatRepository;
import com.zenbund.backend.repository.MessageRepository;
import com.zenbund.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatServiceImpl(ChatRepository chatRepository,
                           MessageRepository messageRepository,
                           UserRepository userRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    /**
     * Helper method to populate user information in ChatResponse
     */
    private ChatResponse enrichChatResponseWithUserInfo(Chat chat) {
        ChatResponse response = ChatResponse.fromEntity(chat);

        // Fetch user1 details
        Optional<User> user1 = userRepository.findById(chat.getUser1Id());
        user1.ifPresent(u -> {
            response.setUser1Name(u.getName());
            response.setUser1ProfilePicture(u.getProfilePicture());
        });

        // Fetch user2 details
        Optional<User> user2 = userRepository.findById(chat.getUser2Id());
        user2.ifPresent(u -> {
            response.setUser2Name(u.getName());
            response.setUser2ProfilePicture(u.getProfilePicture());
        });

        return response;
    }

    @Override
    public ChatResponse createOrGetChat(Long currentUserId, Long otherUserId) {
        // Validate that other user exists
        if (!userRepository.existsById(otherUserId)) {
            throw new ResourceNotFoundException("User", "id", otherUserId);
        }

        // Check if user is trying to chat with themselves
        if (currentUserId.equals(otherUserId)) {
            throw new IllegalStateException("You cannot create a chat with yourself");
        }

        // Check if chat already exists (in either direction)
        Optional<Chat> existingChat = chatRepository.findChatBetweenUsers(currentUserId, otherUserId);
        if (existingChat.isPresent()) {
            return enrichChatResponseWithUserInfo(existingChat.get());
        }

        // Create new chat with currentUser as user1, otherUser as user2
        Chat chat = new Chat(currentUserId, otherUserId);
        Chat savedChat = chatRepository.save(chat);
        return enrichChatResponseWithUserInfo(savedChat);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatResponse> getUserChats(Long userId) {
        List<Chat> chats = chatRepository.findByUser1IdOrUser2IdOrderByUpdatedAtDesc(userId, userId);

        return chats.stream()
                .map(chat -> {
                    ChatResponse response = enrichChatResponseWithUserInfo(chat);
                    // Get last message for this chat
                    Optional<Message> lastMessage = messageRepository.findFirstByChatIdOrderByCreatedAtDesc(chat.getId());
                    lastMessage.ifPresent(msg -> response.setLastMessage(MessageResponse.fromEntity(msg)));
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ChatWithMessagesResponse getChatWithMessages(Long chatId, Long userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat", "id", chatId));

        // Verify user is part of this chat
        if (!chat.getUser1Id().equals(userId) && !chat.getUser2Id().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view this chat");
        }

        List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
        ChatWithMessagesResponse response = ChatWithMessagesResponse.fromEntity(chat, messages);

        // Populate user information
        Optional<User> user1 = userRepository.findById(chat.getUser1Id());
        user1.ifPresent(u -> {
            response.setUser1Name(u.getName());
            response.setUser1ProfilePicture(u.getProfilePicture());
        });

        Optional<User> user2 = userRepository.findById(chat.getUser2Id());
        user2.ifPresent(u -> {
            response.setUser2Name(u.getName());
            response.setUser2ProfilePicture(u.getProfilePicture());
        });

        return response;
    }

    @Override
    public void deleteChat(Long chatId, Long userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat", "id", chatId));

        // Verify user is part of this chat
        if (!chat.getUser1Id().equals(userId) && !chat.getUser2Id().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this chat");
        }

        // Delete all messages first
        messageRepository.deleteByChatId(chatId);

        // Delete chat
        chatRepository.delete(chat);
    }
}
