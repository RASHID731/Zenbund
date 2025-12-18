package com.zenbund.backend.repository;

import com.zenbund.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Find messages for a chat, ordered by creation time (ascending - oldest first)
    List<Message> findByChatIdOrderByCreatedAtAsc(Long chatId);

    // Find latest message for a chat
    Optional<Message> findFirstByChatIdOrderByCreatedAtDesc(Long chatId);

    // Count messages in a chat
    long countByChatId(Long chatId);

    // Delete all messages in a chat (cascade delete)
    void deleteByChatId(Long chatId);
}
