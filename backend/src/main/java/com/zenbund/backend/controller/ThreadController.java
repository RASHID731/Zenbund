package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.CreateThreadRequest;
import com.zenbund.backend.dto.request.UpdateThreadRequest;
import com.zenbund.backend.dto.response.ThreadResponse;
import com.zenbund.backend.service.ThreadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threads")
@CrossOrigin(origins = "*")
public class ThreadController {

    private final ThreadService threadService;

    public ThreadController(ThreadService threadService) {
        this.threadService = threadService;
    }

    /**
     * Create a new thread
     */
    @PostMapping
    public ResponseEntity<ThreadResponse> createThread(@Valid @RequestBody CreateThreadRequest request) {
        ThreadResponse response = threadService.createThread(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all threads
     */
    @GetMapping
    public ResponseEntity<List<ThreadResponse>> getAllThreads() {
        List<ThreadResponse> threads = threadService.getAllThreads();
        return ResponseEntity.ok(threads);
    }

    /**
     * Get a thread by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ThreadResponse> getThreadById(@PathVariable Long id) {
        ThreadResponse response = threadService.getThreadById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update a thread
     */
    @PutMapping("/{id}")
    public ResponseEntity<ThreadResponse> updateThread(
            @PathVariable Long id,
            @Valid @RequestBody UpdateThreadRequest request) {
        ThreadResponse response = threadService.updateThread(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a thread
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThread(@PathVariable Long id) {
        threadService.deleteThread(id);
        return ResponseEntity.noContent().build();
    }
}
