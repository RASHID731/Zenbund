package com.zenbund.backend.service;

import com.zenbund.backend.dto.response.LikeToggleResponse;
import com.zenbund.backend.entity.Comment;
import com.zenbund.backend.entity.Like;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.repository.CommentRepository;
import com.zenbund.backend.repository.LikeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public LikeServiceImpl(LikeRepository likeRepository, CommentRepository commentRepository) {
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    @Transactional
    public LikeToggleResponse toggleLike(Long userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        Optional<Like> existingLike = likeRepository.findByUserIdAndCommentId(userId, commentId);

        if (existingLike.isPresent()) {
            // Unlike: remove row and decrement counter
            likeRepository.deleteByUserIdAndCommentId(userId, commentId);
            int newLikes = Math.max(0, comment.getLikes() - 1);
            comment.setLikes(newLikes);
            commentRepository.save(comment);
            return new LikeToggleResponse(false, newLikes);
        } else {
            // Like: add row and increment counter
            likeRepository.save(new Like(userId, commentId));
            int newLikes = comment.getLikes() + 1;
            comment.setLikes(newLikes);
            commentRepository.save(comment);
            return new LikeToggleResponse(true, newLikes);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasLiked(Long userId, Long commentId) {
        return likeRepository.existsByUserIdAndCommentId(userId, commentId);
    }
}
