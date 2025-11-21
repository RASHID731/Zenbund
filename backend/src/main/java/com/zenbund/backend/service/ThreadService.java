package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateThreadRequest;
import com.zenbund.backend.dto.request.UpdateThreadRequest;
import com.zenbund.backend.dto.response.ThreadResponse;

import java.util.List;

public interface ThreadService {

    /**
     * Create a new thread.
     *
     * @param request the thread creation request
     * @return the created thread response
     */
    ThreadResponse createThread(CreateThreadRequest request);

    /**
     * Get all threads.
     *
     * @return list of all thread responses
     */
    List<ThreadResponse> getAllThreads();

    /**
     * Get a thread by ID.
     *
     * @param id the thread ID
     * @return the thread response
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if thread not found
     */
    ThreadResponse getThreadById(Long id);

    /**
     * Update an existing thread.
     *
     * @param id the thread ID
     * @param request the thread update request
     * @return the updated thread response
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if thread not found
     */
    ThreadResponse updateThread(Long id, UpdateThreadRequest request);

    /**
     * Delete a thread by ID.
     *
     * @param id the thread ID
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if thread not found
     */
    void deleteThread(Long id);
}
