package com.classroom.repository;

import com.classroom.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserIdAndQuestionId(Long userId, Long questionId);
    int countByQuestionId(Long questionId);
    void deleteByUserIdAndQuestionId(Long userId, Long questionId);
}