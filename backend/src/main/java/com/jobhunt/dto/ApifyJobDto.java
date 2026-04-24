package com.jobhunt.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApifyJobDto {
    private String id;
    private String title;
    private String company;
    private String location;
    private String description;
    private String experienceLevel;
    private String url;
    private LocalDateTime postedDate;
}
