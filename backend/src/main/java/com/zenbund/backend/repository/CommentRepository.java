package com.zenbund.backend.repository;

import com.zenbund.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Find all parent comments for a thread (newest first)
    List<Comment> findByThreadIdAndParentCommentIdIsNullOrderByCreatedAtDesc(Long threadId);

    // Find all replies for a parent comment (oldest first)
    List<Comment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);

    // Find all comments for a thread
    List<Comment> findByThreadId(Long threadId);

    // Count replies for a comment
    long countByParentCommentId(Long parentCommentId);

    // Find comments by user
    List<Comment> findByUserId(Long userId);

    // Delete all comments in a thread (cascade when thread is deleted)
    void deleteByThreadId(Long threadId);

    // Delete all replies to a comment (cascade when parent comment is deleted)
    void deleteByParentCommentId(Long parentCommentId);
}
