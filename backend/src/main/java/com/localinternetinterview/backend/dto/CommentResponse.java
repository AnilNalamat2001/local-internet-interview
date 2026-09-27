package com.localinternetinterview.backend.dto;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private String content;

    private Long userId;
    private String userName;

    private Long parentCommentId;

    private LocalDateTime createdAt;

    public CommentResponse() {
    }

    public CommentResponse(
            Long id,
            String content,
            Long userId,
            String userName,
            Long parentCommentId,
            LocalDateTime createdAt) {

        this.id = id;
        this.content = content;
        this.userId = userId;
        this.userName = userName;
        this.parentCommentId = parentCommentId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}