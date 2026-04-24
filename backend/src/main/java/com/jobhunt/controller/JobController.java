package com.jobhunt.controller;

import com.jobhunt.dto.ApifyJobDto;
import com.jobhunt.model.Job;
import com.jobhunt.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For Next.js frontend communication
public class JobController {

    private final JobService jobService;
    private final com.jobhunt.service.ApifyScraperService apifyScraperService;

    @PostMapping("/sync")
    public ResponseEntity<String> triggerSync() {
        // Triggering for a default keyword for now, can be customized later
        apifyScraperService.triggerScrapingJob("linkedin", "Software Engineer", "Remote");
        return ResponseEntity.ok("Scraping triggered");
    }

    /**
     * Endpoint triggered by Apify task completion webhook.
     */
    @PostMapping("/apify-webhook")
    public ResponseEntity<String> handleApifyWebhook(@RequestBody List<ApifyJobDto> jobs) {
        jobService.processApifyJobs(jobs);
        return ResponseEntity.ok("Jobs processed successfully");
    }

    /**
     * Get all jobs, potentially with query parameters for filtering in the future.
     */
    @GetMapping
    public ResponseEntity<List<Job>> getJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }
}
