package com.classroom.repository;

import com.classroom.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findBySessionId(Long sessionId);
    List<Question> findBySessionIdAndAnsweredFalseOrderByTimestampDesc(Long sessionId);
    
    @Query("SELECT q FROM Question q WHERE q.session.id = ?1 ORDER BY SIZE(q.votes) DESC, q.timestamp DESC")
    List<Question> findBySessionIdOrderByVoteCountDesc(Long sessionId);
    
    List<Question> findByAuthorId(Long authorId);
}