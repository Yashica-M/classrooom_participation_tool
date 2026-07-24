package com.classroom.dto;

public class ConfusionDTO {
    private Long sessionId;
    private int confusionLevel;

    public ConfusionDTO() {
    }

    public ConfusionDTO(Long sessionId, int confusionLevel) {
        this.sessionId = sessionId;
        this.confusionLevel = confusionLevel;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public int getConfusionLevel() {
        return confusionLevel;
    }

    public void setConfusionLevel(int confusionLevel) {
        this.confusionLevel = confusionLevel;
    }
}