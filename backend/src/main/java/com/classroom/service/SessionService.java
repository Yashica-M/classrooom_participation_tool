package com.classroom.service;

import com.classroom.model.Session;
import com.classroom.model.User;
import com.classroom.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class SessionService {
    private final SessionRepository sessionRepository;

    @Autowired
    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public Session createSession(String title, User instructor) {
        Session session = new Session();
        session.setTitle(title);
        session.setInstructor(instructor);
        session.setActive(true);
        session.setStartTime(LocalDateTime.now());
        session.setCode(generateSessionCode());
        
        return sessionRepository.save(session);
    }

    public Optional<Session> findByCode(String code) {
        return sessionRepository.findByCode(code);
    }

    public List<Session> getActiveSessionsByInstructor(Long instructorId) {
        return sessionRepository.findByInstructorId(instructorId);
    }

    public void endSession(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setActive(false);
            session.setEndTime(LocalDateTime.now());
            sessionRepository.save(session);
        }
    }

    private String generateSessionCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder codeBuilder = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < 6; i++) {
            codeBuilder.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return codeBuilder.toString();
    }
}