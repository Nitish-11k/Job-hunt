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

    // Hardcoded skill profile for calculating match percentage
    private static final Set<String> TARGET_SKILLS = Set.of(
            "java", "spring boot", "spring", "c#", ".net", "sql", "postgresql", 
            "mysql", "system architecture", "microservices", "react", "next.js"
    );

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
            
            // Calculate and set the fit score based on the job description
            double fitScore = calculateFitPercentage(dto.getDescription());
            job.setFitPercentage(fitScore);

            jobRepository.save(job);
            processedCount++;
        }
        
        log.info("Processed {} new jobs from Apify.", processedCount);
    }

    /**
     * Simple keyword-matching algorithm.
     * Compares the JD string against a hardcoded profile of skills.
     */
    private double calculateFitPercentage(String description) {
        if (description == null || description.trim().isEmpty()) {
            return 0.0;
        }
        
        String lowerDesc = description.toLowerCase();
        long matchCount = TARGET_SKILLS.stream()
                .filter(lowerDesc::contains)
                .count();

        return Math.min(100.0, ((double) matchCount / TARGET_SKILLS.size()) * 100.0);
    }

    // Methods for the frontend Dashboard
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
}
