package com.zenbund.backend.repository;

import com.zenbund.backend.entity.ThreadMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreadMemberRepository extends JpaRepository<ThreadMember, Long> {

    /**
     * Find all thread memberships for a specific user.
     * Used to get list of threads a user has joined.
     */
    List<ThreadMember> findByUserId(Long userId);

    /**
     * Find all members of a specific thread.
     * Used to get list of users in a thread.
     */
    List<ThreadMember> findByThreadId(Long threadId);

    /**
     * Check if a membership exists between user and thread.
     * Returns true if user is already a member.
     * Used before joining to prevent duplicates.
     */
    boolean existsByUserIdAndThreadId(Long userId, Long threadId);

    /**
     * Delete membership by user and thread IDs.
     * Used when leaving a thread.
     */
    void deleteByUserIdAndThreadId(Long userId, Long threadId);

    /**
     * Count members in a thread.
     * Can be used to verify memberCount.
     */
    long countByThreadId(Long threadId);
}
