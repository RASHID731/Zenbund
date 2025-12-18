package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.SendMessageRequest;
import com.zenbund.backend.dto.response.MessageResponse;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * POST /api/messages/chats/{chatId}/messages
     * Send a message in a chat
     */
    @PostMapping("/chats/{chatId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long chatId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SendMessageRequest request) {
        MessageResponse response = messageService.sendMessage(chatId, user.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/messages/chats/{chatId}/messages
     * Get all messages in a chat
     */
    @GetMapping("/chats/{chatId}/messages")
    public ResponseEntity<List<MessageResponse>> getChatMessages(
            @PathVariable Long chatId,
            @AuthenticationPrincipal User user) {
        List<MessageResponse> messages = messageService.getChatMessages(chatId, user.getId());
        return ResponseEntity.ok(messages);
    }

    /**
     * DELETE /api/messages/{id}
     * Delete a specific message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteMessage(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        messageService.deleteMessage(id, user.getId());
        return ResponseEntity.ok(Map.of("message", "Message deleted successfully"));
    }
}
