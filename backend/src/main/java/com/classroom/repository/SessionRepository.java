package com.classroom.repository;

import com.classroom.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByInstructorId(Long instructorId);
    List<Session> findByIsActiveTrue();
    Optional<Session> findByCode(String code);
    List<Session> findTop10ByOrderByStartTimeDesc();
}