package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.JoinThreadRequest;
import com.zenbund.backend.dto.request.UpdateThreadMemberRequest;
import com.zenbund.backend.dto.response.ThreadMemberResponse;
import com.zenbund.backend.service.ThreadMemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/thread-members")
@CrossOrigin(origins = "*")
public class ThreadMemberController {

    private final ThreadMemberService threadMemberService;

    public ThreadMemberController(ThreadMemberService threadMemberService) {
        this.threadMemberService = threadMemberService;
    }

    /**
     * Join a thread (create membership)
     * POST /api/thread-members
     */
    @PostMapping
    public ResponseEntity<?> joinThread(@Valid @RequestBody JoinThreadRequest request) {
        try {
            ThreadMemberResponse response = threadMemberService.joinThread(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            // User already a member
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get memberships - supports filtering by userId and/or threadId
     * GET /api/thread-members?userId={userId}
     * GET /api/thread-members?userId={userId}&threadId={threadId}
     */
    @GetMapping
    public ResponseEntity<?> getMemberships(
            @RequestParam Long userId,
            @RequestParam(required = false) Long threadId) {

        // If both userId and threadId provided, return single membership
        if (threadId != null) {
            ThreadMemberResponse membership = threadMemberService.getMembershipByUserAndThread(userId, threadId);
            return ResponseEntity.ok(membership);
        }

        // Otherwise return all memberships for the user
        List<ThreadMemberResponse> memberships = threadMemberService.getMembershipsByUserId(userId);
        return ResponseEntity.ok(memberships);
    }

    /**
     * Get a specific membership
     * GET /api/thread-members/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ThreadMemberResponse> getMembershipById(@PathVariable Long id) {
        ThreadMemberResponse response = threadMemberService.getMembershipById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update membership settings (e.g., anonymous posting)
     * PUT /api/thread-members/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ThreadMemberResponse> updateMembership(
            @PathVariable Long id,
            @Valid @RequestBody UpdateThreadMemberRequest request) {
        ThreadMemberResponse response = threadMemberService.updateMembership(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Leave a thread (delete membership)
     * DELETE /api/thread-members/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> leaveThread(@PathVariable Long id) {
        threadMemberService.leaveThread(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Check if user is a member of a thread
     * GET /api/thread-members/check?userId={userId}&threadId={threadId}
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkMembership(
            @RequestParam Long userId,
            @RequestParam Long threadId) {
        boolean isMember = threadMemberService.isMember(userId, threadId);
        return ResponseEntity.ok(Map.of("isMember", isMember));
    }
}
