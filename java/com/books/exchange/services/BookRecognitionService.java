package com.books.exchange.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookRecognitionService {

    private static final Logger logger = LoggerFactory.getLogger(BookRecognitionService.class);

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, String> recognizeBook(String imageUrl) {
        Map<String, String> result = new HashMap<>();
        
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            logger.warn("OpenAI API key not configured");
            return result;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            String prompt = """
                Analyze this book cover image and extract the following information in JSON format:
                {
                    "title": "book title",
                    "author": "author name",
                    "genre": "one of: Fiction, Non-Fiction, Science, Technology, History, Biography, Fantasy, Mystery, Romance, Self-Help, Education, Other",
                    "year": "publication year if visible",
                    "isbn": "ISBN if visible",
                    "description": "brief description based on what you can see"
                }
                Only return the JSON, no other text. If you can't determine a field, use empty string.
                """;

            Map<String, Object> imageContent = Map.of(
                "type", "image_url",
                "image_url", Map.of("url", imageUrl, "detail", "high")
            );
            
            Map<String, Object> textContent = Map.of(
                "type", "text",
                "text", prompt
            );

            Map<String, Object> message = Map.of(
                "role", "user",
                "content", List.of(textContent, imageContent)
            );

            Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o",
                "messages", List.of(message),
                "max_tokens", 500
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                "https://api.openai.com/v1/chat/completions",
                HttpMethod.POST,
                entity,
                String.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String content = root.path("choices").get(0).path("message").path("content").asText();
                
                // Clean the response (remove markdown code blocks if present)
                content = content.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
                
                JsonNode bookInfo = objectMapper.readTree(content);
                
                result.put("title", bookInfo.path("title").asText(""));
                result.put("author", bookInfo.path("author").asText(""));
                result.put("genre", bookInfo.path("genre").asText(""));
                result.put("year", bookInfo.path("year").asText(""));
                result.put("isbn", bookInfo.path("isbn").asText(""));
                result.put("description", bookInfo.path("description").asText(""));
            }

        } catch (Exception e) {
            logger.error("Error recognizing book from image: {}", e.getMessage());
        }

        return result;
    }
}

