package com.jobhunt.service;

import com.jobhunt.dto.ApifyJobDto;
import com.jobhunt.model.Job;
import com.jobhunt.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final com.jobhunt.repository.ResumeRepository resumeRepository;

    /**
     * Re-calculates fit scores for all existing jobs based on the current resume.
     */
    public void recomputeAllFitScores() {
        List<Job> jobs = jobRepository.findAll();
        for (Job job : jobs) {
            job.setFitPercentage(calculateFitPercentage(job.getDescription()));
            jobRepository.save(job);
        }
        log.info("Recomputed fit scores for {} jobs.", jobs.size());
    }

    /**
     * Process an incoming batch of jobs from an Apify webhook or API call.
     */
    public void processApifyJobs(List<ApifyJobDto> incomingJobs) {
        int processedCount = 0;

        for (ApifyJobDto dto : incomingJobs) {
            // Ignore if we already have this job
            if (jobRepository.findByApifyJobId(dto.getId()).isPresent()) {
                continue;
            }

            Job job = new Job();
            job.setApifyJobId(dto.getId());
            job.setTitle(dto.getTitle());
            job.setCompany(dto.getCompany());
            job.setLocation(dto.getLocation());
            job.setDescription(dto.getDescription());
            job.setApplyUrl(dto.getUrl());
            job.setExperienceLevel(dto.getExperienceLevel());
            job.setPostedDate(dto.getPostedDate() != null ? dto.getPostedDate() : LocalDateTime.now());
            job.setScrapedDate(LocalDateTime.now());
            
            // Calculate and set the fit score
            job.setFitPercentage(calculateFitPercentage(dto.getDescription()));

            jobRepository.save(job);
            processedCount++;
        }
        
        log.info("Processed {} new jobs from Apify.", processedCount);
    }

    /**
     * Improved calculation logic:
     * Compares job description keywords against words found in the resume.
     */
    private double calculateFitPercentage(String description) {
        if (description == null || description.trim().isEmpty()) {
            return 0.0;
        }

        // Get current resume
        var resumeOpt = resumeRepository.findFirstByOrderByUploadedAtDesc();
        if (resumeOpt.isEmpty()) {
            return 0.0; // No resume to compare against
        }

        String resumeText = resumeOpt.get().getContent().toLowerCase();
        String jobText = description.toLowerCase();

        // Simple scoring: count how many "significant" words from resume appear in job description
        // In a real app, this would use NLP/LLM, but for a 11k-scale project, keyword overlap is robust.
        String[] resumeWords = resumeText.split("\\W+");
        Set<String> keywords = new java.util.HashSet<>();
        for (String word : resumeWords) {
            if (word.length() > 3) keywords.add(word); // Only count meaningful words
        }

        if (keywords.isEmpty()) return 0.0;

        long matchCount = keywords.stream()
                .filter(jobText::contains)
                .count();

        return Math.min(100.0, ((double) matchCount / Math.min(keywords.size(), 20)) * 100.0);
    }

    // Methods for the frontend Dashboard
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
}
