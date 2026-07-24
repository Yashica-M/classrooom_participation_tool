package com.classroom.controller;

import com.classroom.model.ConfusionLevel;
import com.classroom.model.User;
import com.classroom.service.ConfusionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/confusion")
@CrossOrigin(origins = "*")
public class ConfusionController {
    private final ConfusionService confusionService;

    @Autowired
    public ConfusionController(ConfusionService confusionService) {
        this.confusionService = confusionService;
    }

    @PostMapping
    public ResponseEntity<?> reportConfusionLevel(@RequestBody Map<String, Object> data, @RequestAttribute User currentUser) {
        Integer level = (Integer) data.get("level");
        Long sessionId = Long.parseLong(data.get("sessionId").toString());
        
        if (level == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Confusion level is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            ConfusionLevel confusionLevel = confusionService.reportConfusionLevel(level, sessionId, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(confusionLevel);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/session/{sessionId}/average")
    public ResponseEntity<Map<String, Object>> getAverageConfusionLevel(@PathVariable Long sessionId) {
        double avgLevel = confusionService.getAverageConfusionLevel(sessionId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", sessionId);
        response.put("averageLevel", avgLevel);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session/{sessionId}/latest")
    public ResponseEntity<List<ConfusionLevel>> getLatestConfusionLevels(@PathVariable Long sessionId) {
        List<ConfusionLevel> levels = confusionService.getLatestConfusionLevels(sessionId);
        return ResponseEntity.ok(levels);
    }

    @GetMapping("/user/{userId}/session/{sessionId}")
    public ResponseEntity<?> getUserLatestConfusionLevel(@PathVariable Long userId, @PathVariable Long sessionId) {
        Optional<ConfusionLevel> levelOpt = confusionService.getUserLatestConfusionLevel(userId, sessionId);
        
        if (levelOpt.isPresent()) {
            return ResponseEntity.ok(levelOpt.get());
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("sessionId", sessionId);
            response.put("level", null);
            return ResponseEntity.ok(response);
        }
    }
}