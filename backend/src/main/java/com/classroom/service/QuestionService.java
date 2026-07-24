package com.classroom.service;

import com.classroom.model.Question;
import com.classroom.model.Session;
import com.classroom.model.User;
import com.classroom.repository.QuestionRepository;
import com.classroom.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final SessionRepository sessionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository, SessionRepository sessionRepository) {
        this.questionRepository = questionRepository;
        this.sessionRepository = sessionRepository;
    }

    public Question addQuestion(String content, boolean anonymous, Long sessionId, User author) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        
        if (!sessionOpt.isPresent()) {
            throw new RuntimeException("Session not found");
        }
        
        Session session = sessionOpt.get();
        
        if (!session.isActive()) {
            throw new RuntimeException("Session is not active");
        }
        
        Question question = new Question();
        question.setContent(content);
        question.setAnonymous(anonymous);
        question.setTimestamp(LocalDateTime.now());
        question.setAnswered(false);
        question.setSession(session);
        question.setAuthor(author);
        
        return questionRepository.save(question);
    }

    public List<Question> getQuestionsForSession(Long sessionId, boolean sortByVotes) {
        if (sortByVotes) {
            return questionRepository.findBySessionIdOrderByVoteCountDesc(sessionId);
        } else {
            return questionRepository.findBySessionIdAndAnsweredFalseOrderByTimestampDesc(sessionId);
        }
    }

    public void markAsAnswered(Long questionId) {
        Optional<Question> questionOpt = questionRepository.findById(questionId);
        
        if (questionOpt.isPresent()) {
            Question question = questionOpt.get();
            question.setAnswered(true);
            questionRepository.save(question);
        }
    }

    
    // You can add additional methods here if needed
}