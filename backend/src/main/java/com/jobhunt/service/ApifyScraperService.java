package com.jobhunt.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
public class ApifyScraperService {

    // Gets the API token from application.properties or environment variable
    @Value("${apify.api.token}")
    private String apifyToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String APIFY_BASE_URL = "https://api.apify.com/v2/acts";

    // Apify Platform Actor IDs (Actor = the specific scraper bot)
    // You can find exact Actor IDs in the Apify Store (e.g., misr/indeed-scraper)
    private static final String LINKEDIN_ACTOR = "voyager~linkedin-jobs-scraper";
    private static final String INDEED_ACTOR = "misr~indeed-scraper"; 
    private static final String NAUKRI_ACTOR = "your-naukri-actor-id"; // Need to select one from store
    private static final String INTERNSHALA_ACTOR = "your-internshala-actor-id";

    @Value("${backend.url:http://localhost:8080}")
    private String backendUrl;

    /**
     * Triggers the Apify Scraper via REST API.
     */
    public void triggerScrapingJob(String platform, String keyword, String location) {
        String actorId = getActorIdForPlatform(platform);
        if (actorId == null) {
            log.error("Unsupported scraping platform: {}", platform);
            return;
        }

        // Webhook URL where Apify will send data once scraping finishes 
        String webhookUrl = backendUrl + "/api/jobs/apify-webhook";
        log.info("Using webhook URL: {}", webhookUrl);

        // URL to run the actor
        String url = String.format("%s/%s/runs?token=%s", APIFY_BASE_URL, actorId, apifyToken);

        // This is the Input Configuration JSON for the Actor
        Map<String, Object> inputPayload = Map.of(
            "searchQuery", keyword,
            "queries", java.util.List.of(keyword),
            "location", location,
            "maxItems", 50
        );

        // We append the webhook to the URL as a query param or part of the POST
        // Correct way for Apify runs: Pass it as 'webhooks' in the request
        Map<String, Object> body = Map.of(
            "input", inputPayload,
            "webhooks", java.util.List.of(
                Map.of(
                    "eventTypes", java.util.List.of("ACTOR.RUN.SUCCEEDED"),
                    "requestUrl", webhookUrl
                )
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            log.info("Triggering Apify Scraper for {} (Query: {})...", platform, keyword);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            log.info("Apify Actor triggered successfully! Status response: {}", response.getBody());
        } catch (Exception e) {
            log.error("Failed to trigger API for platform {}", platform, e);
        }
    }

    private String getActorIdForPlatform(String platform) {
        switch (platform.toLowerCase()) {
            case "linkedin": return LINKEDIN_ACTOR;
            case "indeed": return INDEED_ACTOR;
            case "naukri": return NAUKRI_ACTOR;
            case "internshala": return INTERNSHALA_ACTOR;
            default: return null;
        }
    }
}
