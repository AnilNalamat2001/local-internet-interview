package com.localinternetinterview.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.localinternetinterview.backend.dto.AiAnalysisResponse;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class AiService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public AiAnalysisResponse analyzePost(String content) {

        try {
            return analyzeWithOpenAI(content);

        } catch (Exception e) {

            System.out.println(
                    "OpenAI unavailable. Using local fallback analysis."
            );

            return analyzeWithFallback(content);
        }
    }

    private AiAnalysisResponse analyzeWithOpenAI(String content)
            throws Exception {

        String apiKey = System.getenv("OPENAI_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("OPENAI_API_KEY is not configured");
        }

        String requestBody = """
                {
                  "model": "gpt-5.6-luna",
                  "input": [
                    {
                      "role": "system",
                      "content": [
                        {
                          "type": "input_text",
                          "text": "Analyze a local community post. Return the user's intent, topic, location, and urgency. Intent must be one of ASK, NEED, OFFER, EVENT, LOCAL_ALERT. Topic should be a short category such as VEHICLE, JOB, ROAD_TRAFFIC, SPORTS, GENERAL, or another useful category. Location should be the location mentioned by the user, or Unknown if none is mentioned. Urgency must be HIGH, MEDIUM, or LOW."
                        }
                      ]
                    },
                    {
                      "role": "user",
                      "content": [
                        {
                          "type": "input_text",
                          "text": %s
                        }
                      ]
                    }
                  ],
                  "text": {
                    "format": {
                      "type": "json_schema",
                      "name": "local_post_analysis",
                      "description": "Analysis of a local community post",
                      "strict": true,
                      "schema": {
                        "type": "object",
                        "properties": {
                          "intent": {
                            "type": "string"
                          },
                          "topic": {
                            "type": "string"
                          },
                          "location": {
                            "type": "string"
                          },
                          "urgency": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "intent",
                          "topic",
                          "location",
                          "urgency"
                        ],
                        "additionalProperties": false
                      }
                    }
                  }
                }
                """.formatted(objectMapper.writeValueAsString(content));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/responses"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        if (response.statusCode() < 200
                || response.statusCode() >= 300) {

            throw new RuntimeException(
                    "OpenAI API error: " + response.body()
            );
        }

        JsonNode responseJson =
                objectMapper.readTree(response.body());

        String aiText = null;

        for (JsonNode outputItem : responseJson.path("output")) {

            for (JsonNode contentItem :
                    outputItem.path("content")) {

                if ("output_text".equals(
                        contentItem.path("type").asText())) {

                    aiText = contentItem.path("text").asText();

                    break;
                }
            }

            if (aiText != null) {
                break;
            }
        }

        if (aiText == null || aiText.isBlank()) {

            throw new RuntimeException(
                    "OpenAI returned no analysis"
            );
        }

        JsonNode analysis =
                objectMapper.readTree(aiText);

        return new AiAnalysisResponse(
                analysis.path("intent").asText(),
                analysis.path("topic").asText(),
                analysis.path("location").asText(),
                analysis.path("urgency").asText()
        );
    }

    private AiAnalysisResponse analyzeWithFallback(String content) {

        String text = content.toLowerCase();

        String intent = "ASK";
        String topic = "GENERAL";
        String location = "Unknown";
        String urgency = "LOW";

        /*
         * Intent detection
         */

        if (containsAny(
                text,
                "need",
                "require",
                "looking for",
                "want"
        )) {

            intent = "NEED";

        } else if (containsAny(
                text,
                "offer",
                "offering",
                "available",
                "can help",
                "giving"
        )) {

            intent = "OFFER";

        } else if (containsAny(
                text,
                "event",
                "meeting",
                "program",
                "festival"
        )) {

            intent = "EVENT";

        } else if (containsAny(
                text,
                "accident",
                "fire",
                "danger",
                "emergency",
                "blocked",
                "flood"
        )) {

            intent = "LOCAL_ALERT";
        }

        /*
         * Topic detection
         */

        if (containsAny(
                text,
                "bike",
                "bike",
                "scooter",
                "mechanic",
                "vehicle",
                "car",
                "petrol"
        )) {

            topic = "VEHICLE";

        } else if (containsAny(
                text,
                "job",
                "jobs",
                "work",
                "interview",
                "hiring",
                "career"
        )) {

            topic = "JOB";

        } else if (containsAny(
                text,
                "traffic",
                "road",
                "accident",
                "traffic jam",
                "blocked"
        )) {

            topic = "ROAD_TRAFFIC";

        } else if (containsAny(
                text,
                "cricket",
                "football",
                "match",
                "sports",
                "game"
        )) {

            topic = "SPORTS";
        }

        /*
         * Location detection
         */

        if (containsAny(
                text,
                "ameerpet"
        )) {

            location = "Ameerpet";

        } else if (containsAny(
                text,
                "madhapur"
        )) {

            location = "Madhapur";

        } else if (containsAny(
                text,
                "gachibowli"
        )) {

            location = "Gachibowli";

        } else if (containsAny(
                text,
                "hyderabad"
        )) {

            location = "Hyderabad";

        } else if (containsAny(
                text,
                "vijayawada"
        )) {

            location = "Vijayawada";
        }

        /*
         * Urgency detection
         */

        if (containsAny(
                text,
                "urgent",
                "emergency",
                "immediately",
                "asap",
                "danger",
                "accident",
                "fire"
        )) {

            urgency = "HIGH";

        } else if (containsAny(
                text,
                "today",
                "tonight",
                "now",
                "soon"
        )) {

            urgency = "MEDIUM";
        }

        return new AiAnalysisResponse(
                intent,
                topic,
                location,
                urgency
        );
    }

    private boolean containsAny(
            String text,
            String... keywords) {

        for (String keyword : keywords) {

            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }
}