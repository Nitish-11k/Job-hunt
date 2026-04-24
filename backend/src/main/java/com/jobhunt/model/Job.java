package com.jobhunt.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String apifyJobId;

    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String company;
    
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // E.g., "Fresher", "Mid-Level", "Senior"
    private String experienceLevel; 
    
    private String applyUrl;
    
    private LocalDateTime postedDate;
    
    @Column(nullable = false)
    private LocalDateTime scrapedDate;

    private LocalDateTime appliedDate; // Tracks exactly when you applied

    @Enumerated(EnumType.STRING)
    private ApplicationState applicationState = ApplicationState.SAVED;

    // Score from 0.0 to 100.0 based on keyword match
    private Double fitPercentage;
}
