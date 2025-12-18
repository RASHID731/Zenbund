package com.zenbund.backend.repository;

import com.zenbund.backend.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    // Find chats for a user (where user is either user1 or user2)
    List<Chat> findByUser1IdOrUser2IdOrderByUpdatedAtDesc(Long user1Id, Long user2Id);

    // Find specific chat between two users
    Optional<Chat> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    // Check if chat exists between two users (in either direction)
    @Query("SELECT c FROM Chat c WHERE (c.user1Id = :userId1 AND c.user2Id = :userId2) OR (c.user1Id = :userId2 AND c.user2Id = :userId1)")
    Optional<Chat> findChatBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
