package com.classroom.controller;

import com.classroom.model.Session;
import com.classroom.model.User;
import com.classroom.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {
    private final SessionService sessionService;

    @Autowired
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody Map<String, String> sessionData, @RequestAttribute User currentUser) {
        String title = sessionData.get("title");
        
        if (title == null || title.trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Session title is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        Session session = sessionService.createSession(title, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<Session>> getSessionsByInstructor(@PathVariable Long instructorId) {
        List<Session> sessions = sessionService.getActiveSessionsByInstructor(instructorId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/join/{code}")
    public ResponseEntity<?> joinSession(@PathVariable String code) {
        Optional<Session> sessionOpt = sessionService.findByCode(code);
        
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            
            if (!session.isActive()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "This session is no longer active");
                return ResponseEntity.badRequest().body(response);
            }
            
            return ResponseEntity.ok(session);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid session code");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<?> endSession(@PathVariable Long sessionId, @RequestAttribute User currentUser) {
        Optional<Session> sessionOpt = sessionService.findByCode(sessionId.toString());
        
        if (!sessionOpt.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Session not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        Session session = sessionOpt.get();
        
        if (!session.getInstructor().getId().equals(currentUser.getId())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Only the instructor can end this session");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        sessionService.endSession(sessionId);
        return ResponseEntity.ok().build();
    }
}