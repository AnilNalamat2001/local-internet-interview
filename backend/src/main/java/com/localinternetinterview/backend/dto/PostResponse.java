package com.localinternetinterview.backend.dto;

import com.localinternetinterview.backend.entity.PostCategory;

import java.time.LocalDateTime;

public class PostResponse {

    private Long id;
    private String content;
    private PostCategory category;
    private String location;

    private String topic;
    private String urgency;

    private Long userId;
    private String userName;
    private LocalDateTime createdAt;

    public PostResponse() {
    }

    public PostResponse(
            Long id,
            String content,
            PostCategory category,
            String location,
            String topic,
            String urgency,
            Long userId,
            String userName,
            LocalDateTime createdAt) {

        this.id = id;
        this.content = content;
        this.category = category;
        this.location = location;
        this.topic = topic;
        this.urgency = urgency;
        this.userId = userId;
        this.userName = userName;
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

    public PostCategory getCategory() {
        return category;
    }

    public void setCategory(PostCategory category) {
        this.category = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}