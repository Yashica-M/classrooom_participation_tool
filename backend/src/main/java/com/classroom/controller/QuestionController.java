package com.classroom.controller;

import com.classroom.model.Question;
import com.classroom.model.User;
import com.classroom.service.QuestionService;
import com.classroom.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {
    private final QuestionService questionService;
    private final VoteService voteService;

    @Autowired
    public QuestionController(QuestionService questionService, VoteService voteService) {
        this.questionService = questionService;
        this.voteService = voteService;
    }

    @PostMapping
    public ResponseEntity<?> addQuestion(@RequestBody Map<String, Object> questionData, @RequestAttribute User currentUser) {
        String content = (String) questionData.get("content");
        Boolean anonymous = (Boolean) questionData.get("anonymous");
        Long sessionId = Long.parseLong(questionData.get("sessionId").toString());
        
        if (content == null || content.trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Question content is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        Question question = questionService.addQuestion(
            content, 
            anonymous != null && anonymous, 
            sessionId, 
            currentUser
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(question);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Question>> getQuestionsForSession(
            @PathVariable Long sessionId,
            @RequestParam(defaultValue = "true") boolean sortByVotes) {
        List<Question> questions = questionService.getQuestionsForSession(sessionId, sortByVotes);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/{questionId}/vote")
    public ResponseEntity<?> toggleVote(@PathVariable Long questionId, @RequestAttribute User currentUser) {
        boolean voteAdded = voteService.toggleVote(questionId, currentUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("voteAdded", voteAdded);
        response.put("voteCount", voteService.getVoteCountForQuestion(questionId));
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{questionId}/mark-answered")
    public ResponseEntity<?> markAsAnswered(@PathVariable Long questionId) {
        questionService.markAsAnswered(questionId);
        return ResponseEntity.ok().build();
    }
}