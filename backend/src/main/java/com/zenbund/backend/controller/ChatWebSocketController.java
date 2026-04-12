package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.SendMessageRequest;
import com.zenbund.backend.dto.response.MessageResponse;
import com.zenbund.backend.dto.ws.WsMessageEvent;
import com.zenbund.backend.dto.ws.WsTypingEvent;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.service.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{chatId}/message")
    public void sendMessage(
            @DestinationVariable Long chatId,
            SendMessageRequest request,
            Principal principal) {

        User user = extractUser(principal);
        MessageResponse saved = messageService.sendMessage(chatId, user.getId(), request);
        WsMessageEvent event = new WsMessageEvent("NEW_MESSAGE", saved, null, chatId);
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, event);
    }

    @MessageMapping("/chat/{chatId}/typing")
    public void typing(
            @DestinationVariable Long chatId,
            WsTypingEvent inbound,
            Principal principal) {

        User user = extractUser(principal);
        WsTypingEvent event = new WsTypingEvent(user.getId(), user.getName(), inbound.isTyping(), chatId);
        messagingTemplate.convertAndSend("/topic/chat/" + chatId + "/typing", event);
    }

    private User extractUser(Principal principal) {
        UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) principal;
        return (User) auth.getPrincipal();
    }
}
