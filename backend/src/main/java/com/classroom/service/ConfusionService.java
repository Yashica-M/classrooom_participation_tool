package com.classroom.service;

import com.classroom.model.ConfusionLevel;
import com.classroom.model.Session;
import com.classroom.model.User;
import com.classroom.repository.ConfusionRepository;
import com.classroom.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConfusionService {
    private final ConfusionRepository confusionRepository;
    private final SessionRepository sessionRepository;

    @Autowired
    public ConfusionService(ConfusionRepository confusionRepository, SessionRepository sessionRepository) {
        this.confusionRepository = confusionRepository;
        this.sessionRepository = sessionRepository;
    }

    public ConfusionLevel reportConfusionLevel(int level, Long sessionId, User user) {
        if (level < 1 || level > 5) {
            throw new IllegalArgumentException("Confusion level must be between 1 and 5");
        }
        
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (!sessionOpt.isPresent()) {
            throw new RuntimeException("Session not found");
        }
        
        ConfusionLevel confusionLevel = new ConfusionLevel();
        confusionLevel.setLevel(level);
        confusionLevel.setSession(sessionOpt.get());
        confusionLevel.setUser(user);
        confusionLevel.setTimestamp(LocalDateTime.now());
        
        return confusionRepository.save(confusionLevel);
    }

    public double getAverageConfusionLevel(Long sessionId) {
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        Double avgLevel = confusionRepository.getAverageConfusionLevelForSessionSince(sessionId, fiveMinutesAgo);
        return avgLevel != null ? avgLevel : 0.0;
    }

    public List<ConfusionLevel> getLatestConfusionLevels(Long sessionId) {
        return confusionRepository.findLatestConfusionLevelsBySession(sessionId);
    }

    public Optional<ConfusionLevel> getUserLatestConfusionLevel(Long userId, Long sessionId) {
        return confusionRepository.findTopByUserIdAndSessionIdOrderByTimestampDesc(userId, sessionId);
    }
}