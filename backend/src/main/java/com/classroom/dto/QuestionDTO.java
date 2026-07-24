package com.classroom.dto;

public class QuestionDTO {
    private Long id;
    private String content;
    private Long userId;
    private Long sessionId;
    private int upvotes;

    public QuestionDTO() {
    }

    public QuestionDTO(Long id, String content, Long userId, Long sessionId, int upvotes) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.sessionId = sessionId;
        this.upvotes = upvotes;
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

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public int getUpvotes() {
        return upvotes;
    }

    public void setUpvotes(int upvotes) {
        this.upvotes = upvotes;
    }
}