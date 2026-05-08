package com.codereviewer.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;
import java.util.regex.*;

@Service
public class GitHubService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String fetchDiff(String prUrl) {
        String apiUrl = convertToApiUrl(prUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/vnd.github.v3.diff");

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.GET,
                request,
                String.class
        );

        return response.getBody();
    }

    public String detectLanguage(String prUrl) {
        String apiUrl = convertToApiUrl(prUrl) + "/files";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "applications/vnd.github.v3+json");

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map[]> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.GET,
                request,
                Map[].class
        );
        Map[] files = response.getBody();
        if(files == null || files.length == 0) return "auto-detect";

        String filename = (String) files[0].get("filename");
        return extractLanguage(filename);
    }

    private String convertToApiUrl(String prUrl) {
        Pattern pattern = Pattern.compile(
                "https://github\\.com/([^/]+)/([^/]+)/pull/(\\d+)"
        );

        Matcher matcher = pattern.matcher(prUrl);
        if (!matcher.matches()) {
            throw new IllegalArgumentException("Invalid GitHub PR URL: " + prUrl);
        }

        return String.format(
                "https://api.github.com/repos/%s/%s/pulls/%s",
                matcher.group(1),
                matcher.group(2),
                matcher.group(3)
        );
    }

    private String extractLanguage(String filename) {
        if (filename == null) return "auto-detect";
        if (filename.endsWith(".java")) return "java";
        if (filename.endsWith(".py")) return "python";
        if (filename.endsWith(".js")) return "javascript";
        if (filename.endsWith(".ts")) return "typescript";
        if (filename.endsWith(".cpp") || filename.endsWith(".cc")) return "cpp";
        if (filename.endsWith(".go")) return "go";
        return "auto-detect";
    }
}