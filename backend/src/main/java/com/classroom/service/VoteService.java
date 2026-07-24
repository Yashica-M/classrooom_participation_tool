package com.classroom.service;

import com.classroom.model.Question;
import com.classroom.model.User;
import com.classroom.model.Vote;
import com.classroom.repository.QuestionRepository;
import com.classroom.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VoteService {
    private final VoteRepository voteRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public VoteService(VoteRepository voteRepository, QuestionRepository questionRepository) {
        this.voteRepository = voteRepository;
        this.questionRepository = questionRepository;
    }

    @Transactional
    public boolean toggleVote(Long questionId, User user) {
        Optional<Question> questionOpt = questionRepository.findById(questionId);
        
        if (!questionOpt.isPresent()) {
            throw new RuntimeException("Question not found");
        }
        
        Optional<Vote> existingVote = voteRepository.findByUserIdAndQuestionId(user.getId(), questionId);
        
        if (existingVote.isPresent()) {
            voteRepository.deleteByUserIdAndQuestionId(user.getId(), questionId);
            return false; // Vote removed
        } else {
            Vote vote = new Vote();
            vote.setQuestion(questionOpt.get());
            vote.setUser(user);
            vote.setTimestamp(LocalDateTime.now());
            voteRepository.save(vote);
            return true; // Vote added
        }
    }

    public int getVoteCountForQuestion(Long questionId) {
        return voteRepository.countByQuestionId(questionId);
    }

    public boolean hasUserVotedForQuestion(Long userId, Long questionId) {
        return voteRepository.findByUserIdAndQuestionId(userId, questionId).isPresent();
    }
}