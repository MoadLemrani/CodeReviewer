package com.codereviewer.backend.controller;

import com.codereviewer.backend.model.Review;
import com.codereviewer.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest request) {
        Review review = reviewService.reviewPr(request.prUrl(), request.context());
        return ResponseEntity.ok(review);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable UUID id) {
        Review review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }
}
