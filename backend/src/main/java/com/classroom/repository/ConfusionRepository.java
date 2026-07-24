package com.classroom.repository;

import com.classroom.model.ConfusionLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConfusionRepository extends JpaRepository<ConfusionLevel, Long> {
    List<ConfusionLevel> findBySessionId(Long sessionId);
    
    Optional<ConfusionLevel> findTopByUserIdAndSessionIdOrderByTimestampDesc(Long userId, Long sessionId);
    
    @Query("SELECT AVG(c.level) FROM ConfusionLevel c WHERE c.session.id = ?1 AND c.timestamp > ?2")
    Double getAverageConfusionLevelForSessionSince(Long sessionId, LocalDateTime since);
    
    // Fix the query syntax - this query gets the latest confusion level for each user in a session
    @Query("SELECT c FROM ConfusionLevel c WHERE c.session.id = ?1 AND c.timestamp = (SELECT MAX(c2.timestamp) FROM ConfusionLevel c2 WHERE c2.user.id = c.user.id AND c2.session.id = ?1)")
    List<ConfusionLevel> findLatestConfusionLevelsBySession(Long sessionId);
    
    List<ConfusionLevel> findBySessionIdOrderByTimestampDesc(Long sessionId);
    
    List<ConfusionLevel> findBySessionIdAndUserIdOrderByTimestampDesc(Long sessionId, Long userId);
}