package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateThreadRequest;
import com.zenbund.backend.dto.request.UpdateThreadRequest;
import com.zenbund.backend.dto.response.ThreadResponse;
import com.zenbund.backend.entity.Thread;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.repository.ThreadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class ThreadServiceImpl implements ThreadService {

    private final ThreadRepository threadRepository;

    public ThreadServiceImpl(ThreadRepository threadRepository) {
        this.threadRepository = threadRepository;
    }

    @Override
    public ThreadResponse createThread(CreateThreadRequest request) {
        // Create and save new thread
        Thread thread = new Thread(
                request.getEmoji(),
                request.getName(),
                request.getDescription()
        );
        Thread savedThread = threadRepository.save(thread);

        return ThreadResponse.fromEntity(savedThread);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ThreadResponse> getAllThreads() {
        return threadRepository.findAll()
                .stream()
                .map(ThreadResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ThreadResponse getThreadById(Long id) {
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + id));

        return ThreadResponse.fromEntity(thread);
    }

    @Override
    public ThreadResponse updateThread(Long id, UpdateThreadRequest request) {
        // Find existing thread
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + id));

        // Update emoji if provided
        if (request.getEmoji() != null && !request.getEmoji().isBlank()) {
            thread.setEmoji(request.getEmoji());
        }

        // Update name if provided
        if (request.getName() != null && !request.getName().isBlank()) {
            thread.setName(request.getName());
        }

        // Update description if provided
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            thread.setDescription(request.getDescription());
        }

        // Save updated thread
        Thread updatedThread = threadRepository.save(thread);

        return ThreadResponse.fromEntity(updatedThread);
    }

    @Override
    public void deleteThread(Long id) {
        // Check if thread exists
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + id));

        // Delete the thread
        threadRepository.delete(thread);
    }
}
