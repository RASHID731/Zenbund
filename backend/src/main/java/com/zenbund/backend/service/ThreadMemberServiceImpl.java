package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.JoinThreadRequest;
import com.zenbund.backend.dto.request.UpdateThreadMemberRequest;
import com.zenbund.backend.dto.response.ThreadMemberResponse;
import com.zenbund.backend.entity.Thread;
import com.zenbund.backend.entity.ThreadMember;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.repository.ThreadMemberRepository;
import com.zenbund.backend.repository.ThreadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class ThreadMemberServiceImpl implements ThreadMemberService {

    private final ThreadMemberRepository threadMemberRepository;
    private final ThreadRepository threadRepository;

    public ThreadMemberServiceImpl(ThreadMemberRepository threadMemberRepository,
                                   ThreadRepository threadRepository) {
        this.threadMemberRepository = threadMemberRepository;
        this.threadRepository = threadRepository;
    }

    @Override
    public ThreadMemberResponse joinThread(JoinThreadRequest request) {
        // Check if thread exists
        Thread thread = threadRepository.findById(request.getThreadId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Thread not found with id: " + request.getThreadId()));

        // Check if user is already a member
        if (threadMemberRepository.existsByUserIdAndThreadId(
                request.getUserId(), request.getThreadId())) {
            throw new IllegalStateException("User is already a member of this thread");
        }

        // Create the membership
        ThreadMember member = new ThreadMember(request.getUserId(), request.getThreadId());
        ThreadMember savedMember = threadMemberRepository.save(member);

        // Increment thread's member count
        thread.setMemberCount(thread.getMemberCount() + 1);
        threadRepository.save(thread);

        // Build response with thread details
        ThreadMemberResponse response = ThreadMemberResponse.fromEntity(savedMember);
        response.setThreadName(thread.getName());
        response.setThreadEmoji(thread.getEmoji());

        return response;
    }

    @Override
    public void leaveThread(Long id) {
        // Find the membership
        ThreadMember member = threadMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Membership not found with id: " + id));

        // Find the thread to decrement member count
        Thread thread = threadRepository.findById(member.getThreadId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Thread not found with id: " + member.getThreadId()));

        // Delete the membership
        threadMemberRepository.delete(member);

        // Decrement thread's member count (don't go below 0)
        int newCount = Math.max(0, thread.getMemberCount() - 1);
        thread.setMemberCount(newCount);
        threadRepository.save(thread);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ThreadMemberResponse> getMembershipsByUserId(Long userId) {
        List<ThreadMember> memberships = threadMemberRepository.findByUserId(userId);

        return memberships.stream()
                .map(member -> {
                    ThreadMemberResponse response = ThreadMemberResponse.fromEntity(member);

                    // Fetch thread details
                    threadRepository.findById(member.getThreadId())
                            .ifPresent(thread -> {
                                response.setThreadName(thread.getName());
                                response.setThreadEmoji(thread.getEmoji());
                            });

                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ThreadMemberResponse getMembershipById(Long id) {
        ThreadMember member = threadMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Membership not found with id: " + id));

        ThreadMemberResponse response = ThreadMemberResponse.fromEntity(member);

        // Fetch thread details
        threadRepository.findById(member.getThreadId())
                .ifPresent(thread -> {
                    response.setThreadName(thread.getName());
                    response.setThreadEmoji(thread.getEmoji());
                });

        return response;
    }

    @Override
    public ThreadMemberResponse updateMembership(Long id, UpdateThreadMemberRequest request) {
        ThreadMember member = threadMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Membership not found with id: " + id));

        // Update the anonymous setting
        member.setPostAnonymously(request.getPostAnonymously());
        ThreadMember updatedMember = threadMemberRepository.save(member);

        ThreadMemberResponse response = ThreadMemberResponse.fromEntity(updatedMember);

        // Fetch thread details
        threadRepository.findById(member.getThreadId())
                .ifPresent(thread -> {
                    response.setThreadName(thread.getName());
                    response.setThreadEmoji(thread.getEmoji());
                });

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isMember(Long userId, Long threadId) {
        return threadMemberRepository.existsByUserIdAndThreadId(userId, threadId);
    }
}
