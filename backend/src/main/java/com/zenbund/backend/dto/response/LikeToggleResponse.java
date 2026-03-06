package com.zenbund.backend.dto.response;

public class LikeToggleResponse {

    private boolean liked;
    private int commentLikes;

    public LikeToggleResponse() {
    }

    public LikeToggleResponse(boolean liked, int commentLikes) {
        this.liked = liked;
        this.commentLikes = commentLikes;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

    public int getCommentLikes() {
        return commentLikes;
    }

    public void setCommentLikes(int commentLikes) {
        this.commentLikes = commentLikes;
    }
}
