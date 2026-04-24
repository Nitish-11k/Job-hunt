package com.jobhunt.controller;

import com.jobhunt.model.Resume;
import com.jobhunt.repository.ResumeRepository;
import com.jobhunt.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeRepository resumeRepository;
    private final JobService jobService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestBody Map<String, String> payload) {
        String content = payload.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Resume content cannot be empty");
        }

        Resume resume = resumeRepository.findFirstByOrderByUploadedAtDesc().orElse(new Resume());
        resume.setContent(content);
        resume.setUploadedAt(LocalDateTime.now());
        resumeRepository.save(resume);

        // Re-calculate fit scores for all jobs after resume update
        jobService.recomputeAllFitScores();

        return ResponseEntity.ok(Map.of("message", "Resume updated and jobs re-analyzed"));
    }

    @GetMapping("/current")
    public ResponseEntity<Resume> getCurrentResume() {
        return ResponseEntity.of(resumeRepository.findFirstByOrderByUploadedAtDesc());
    }
}
