package com.zenbund.backend.security;

import com.zenbund.backend.service.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtChannelInterceptor(JwtUtil jwtUtil, @Lazy UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new MessageDeliveryException("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);

            try {
                String username = jwtUtil.extractUsername(token);
                UserDetails userDetails = userService.loadUserByUsername(username);

                if (!jwtUtil.validateToken(token, userDetails)) {
                    throw new MessageDeliveryException("Invalid or expired JWT token");
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                accessor.setUser(authentication);
            } catch (MessageDeliveryException e) {
                throw e;
            } catch (Exception e) {
                throw new MessageDeliveryException("JWT authentication failed: " + e.getMessage());
            }
        }

        return message;
    }
}
