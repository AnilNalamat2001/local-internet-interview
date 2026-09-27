package com.localinternetinterview.backend.dto;

import java.time.LocalDateTime;

public class ReportResponse {

    private Long id;
    private String reason;

    private Long userId;
    private String userName;

    private Long postId;

    private LocalDateTime createdAt;

    public ReportResponse() {
    }

    public ReportResponse(
            Long id,
            String reason,
            Long userId,
            String userName,
            Long postId,
            LocalDateTime createdAt) {

        this.id = id;
        this.reason = reason;
        this.userId = userId;
        this.userName = userName;
        this.postId = postId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
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

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

