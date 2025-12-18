package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.CreateChatRequest;
import com.zenbund.backend.dto.response.ChatResponse;
import com.zenbund.backend.dto.response.ChatWithMessagesResponse;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * POST /api/chats
     * Create or get existing chat with another user
     */
    @PostMapping
    public ResponseEntity<ChatResponse> createOrGetChat(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateChatRequest request) {
        ChatResponse response = chatService.createOrGetChat(user.getId(), request.getOtherUserId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/chats
     * Get all chats for current user
     */
    @GetMapping
    public ResponseEntity<List<ChatResponse>> getUserChats(
            @AuthenticationPrincipal User user) {
        List<ChatResponse> chats = chatService.getUserChats(user.getId());
        return ResponseEntity.ok(chats);
    }

    /**
     * GET /api/chats/{id}
     * Get specific chat with all messages
     */
    @GetMapping("/{id}")
    public ResponseEntity<ChatWithMessagesResponse> getChatWithMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        ChatWithMessagesResponse response = chatService.getChatWithMessages(id, user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/chats/{id}
     * Delete chat and all its messages
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteChat(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        chatService.deleteChat(id, user.getId());
        return ResponseEntity.ok(Map.of("message", "Chat deleted successfully"));
    }
}
