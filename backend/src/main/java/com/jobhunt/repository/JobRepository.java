package com.jobhunt.repository;

import com.jobhunt.model.Job;
import com.jobhunt.model.ApplicationState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findByApifyJobId(String apifyJobId);
    
    List<Job> findByApplicationStateOrderByFitPercentageDesc(ApplicationState state);
    
    List<Job> findByExperienceLevelAndPostedDateAfterOrderByFitPercentageDesc(
        String experienceLevel, 
        LocalDateTime date
    );
}
