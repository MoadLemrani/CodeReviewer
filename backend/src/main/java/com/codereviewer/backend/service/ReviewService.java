package com.codereviewer.backend.service;

import com.codereviewer.backend.model.Review;
import com.codereviewer.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final GitHubService gitHubService;
    private final PythonClientService pythonClientService;
    private final ReviewRepository reviewRepository;

    public Review reviewPr(String prUrl, String context) {
        //fetch the diff
        String diff = gitHubService.fetchDiff(prUrl);

        //detect lang
        String language = gitHubService.detectLanguage(prUrl);

        //send to ai_service
        Map<String, Object> result = pythonClientService.getReview(diff, language, context);

        //persist to postgreSQL
        Review review = new Review();
        review.setPrUrl(prUrl);
        review.setLanguage(language);
        review.setDiff(diff);
        review.setResult(result);

        return reviewRepository.save(review);
    }

    public Review getReviewById(java.util.UUID id) {
        return reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found: " + id));
    }
}
