package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.JoinThreadRequest;
import com.zenbund.backend.dto.request.UpdateThreadMemberRequest;
import com.zenbund.backend.dto.response.ThreadMemberResponse;

import java.util.List;

public interface ThreadMemberService {

    /**
     * Join a thread (create membership).
     * Also increments the thread's memberCount.
     *
     * @param request the join request with userId and threadId
     * @return the created membership
     * @throws IllegalStateException if user is already a member
     */
    ThreadMemberResponse joinThread(JoinThreadRequest request);

    /**
     * Leave a thread (delete membership).
     * Also decrements the thread's memberCount.
     *
     * @param id the membership ID
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if membership not found
     */
    void leaveThread(Long id);

    /**
     * Get all memberships for a user.
     * Returns threads the user has joined with their settings.
     *
     * @param userId the user ID
     * @return list of memberships with thread details
     */
    List<ThreadMemberResponse> getMembershipsByUserId(Long userId);

    /**
     * Get a specific membership by ID.
     *
     * @param id the membership ID
     * @return the membership
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if not found
     */
    ThreadMemberResponse getMembershipById(Long id);

    /**
     * Update membership settings (e.g., anonymous posting).
     *
     * @param id the membership ID
     * @param request the update request
     * @return the updated membership
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if not found
     */
    ThreadMemberResponse updateMembership(Long id, UpdateThreadMemberRequest request);

    /**
     * Check if a user is a member of a thread.
     *
     * @param userId the user ID
     * @param threadId the thread ID
     * @return true if user is a member
     */
    boolean isMember(Long userId, Long threadId);

    /**
     * Get a specific membership by userId and threadId.
     *
     * @param userId the user ID
     * @param threadId the thread ID
     * @return the membership
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if not found
     */
    ThreadMemberResponse getMembershipByUserAndThread(Long userId, Long threadId);
}
