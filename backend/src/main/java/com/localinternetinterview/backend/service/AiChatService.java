package com.localinternetinterview.backend.service;

import com.localinternetinterview.backend.dto.AiChatResponse;
import com.localinternetinterview.backend.entity.Post;
import com.localinternetinterview.backend.entity.User;
import com.localinternetinterview.backend.repository.PostRepository;
import com.localinternetinterview.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiChatService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public AiChatService(
            PostRepository postRepository,
            UserRepository userRepository) {

        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public AiChatResponse chat(
            String message,
            Long userId) {

        String text = message.toLowerCase();

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String userArea = user.getArea();

        List<Post> posts =
                postRepository.findAllByOrderByCreatedAtDesc();

        if (posts.isEmpty()) {

            return new AiChatResponse(
                    "There are no local posts available yet. " +
                    "Create a post and I can help you understand " +
                    "what is happening in your community."
            );
        }

        String requestedLocation =
                extractLocation(text);

        boolean askingNearMe =
                containsAny(
                        text,
                        "near me",
                        "nearby",
                        "around me",
                        "in my area"
                );

        String targetLocation = requestedLocation;

        if (askingNearMe
                && (targetLocation == null
                || targetLocation.isBlank())) {

            targetLocation = userArea;
        }

        String topic = detectTopic(text);

        if ("EVENT".equals(topic)) {

            List<Post> matchingPosts =
                    filterPosts(
                            posts,
                            targetLocation,
                            topic
                    );

            return buildResponse(
                    matchingPosts,
                    "EVENT",
                    targetLocation
            );
        }

        if ("VEHICLE".equals(topic)) {

            List<Post> matchingPosts =
                    filterPosts(
                            posts,
                            targetLocation,
                            topic
                    );

            return buildResponse(
                    matchingPosts,
                    "VEHICLE",
                    targetLocation
            );
        }

        if ("JOB".equals(topic)) {

            List<Post> matchingPosts =
                    filterPosts(
                            posts,
                            targetLocation,
                            topic
                    );

            return buildResponse(
                    matchingPosts,
                    "JOB",
                    targetLocation
            );
        }

        if ("ALERT".equals(topic)) {

            List<Post> matchingPosts =
                    filterPosts(
                            posts,
                            targetLocation,
                            topic
                    );

            return buildResponse(
                    matchingPosts,
                    "ALERT",
                    targetLocation
            );
        }

        if (askingNearMe
                || containsAny(
                        text,
                        "what is happening",
                        "what's happening",
                        "anything happening",
                        "show me local",
                        "local activity"
                )) {

            List<Post> matchingPosts =
                    filterPosts(
                            posts,
                            targetLocation,
                            null
                    );

            return buildResponse(
                    matchingPosts,
                    "GENERAL",
                    targetLocation
            );
        }

        if (targetLocation != null
                && !targetLocation.isBlank()) {

            List<Post> matchingPosts =
                    filterPosts(
                            posts,
                            targetLocation,
                            null
                    );

            return buildResponse(
                    matchingPosts,
                    "GENERAL",
                    targetLocation
            );
        }

        return new AiChatResponse(
                "I can help you search your local community " +
                "for nearby activity, vehicle help, jobs, " +
                "events and local alerts. Try asking " +
                "\"What's happening near me?\""
        );
    }

    private List<Post> filterPosts(
            List<Post> posts,
            String location,
            String topic) {

        return posts.stream()
                .filter(post -> {

                    boolean locationMatches = true;

                    /*
                     * IMPORTANT:
                     * When a location is requested, compare ONLY
                     * the AI-detected/stored post location.
                     *
                     * Do NOT search the post content for the
                     * location because a post can mention another
                     * area while actually belonging to a different area.
                     */

                    if (location != null
                            && !location.isBlank()) {

                        String postLocation =
                                post.getLocation();

                        if (postLocation == null
                                || postLocation.isBlank()
                                || postLocation.equalsIgnoreCase(
                                        "Unknown")) {

                            locationMatches = false;

                        } else {

                            locationMatches =
                                    postLocation.equalsIgnoreCase(
                                            location
                                    );
                        }
                    }

                    boolean topicMatches = true;

                    if (topic != null) {

                        String content =
                                post.getContent()
                                        .toLowerCase();

                        topicMatches =
                                switch (topic) {

                                    case "VEHICLE" ->
                                            containsAny(
                                                    content,
                                                    "bike",
                                                    "scooter",
                                                    "mechanic",
                                                    "vehicle",
                                                    "car",
                                                    "petrol"
                                            );

                                    case "JOB" ->
                                            containsAny(
                                                    content,
                                                    "job",
                                                    "jobs",
                                                    "work",
                                                    "hiring",
                                                    "career",
                                                    "interview"
                                            );

                                    case "EVENT" ->
                                            containsAny(
                                                    content,
                                                    "event",
                                                    "events",
                                                    "meeting",
                                                    "program",
                                                    "festival",
                                                    "function"
                                            );

                                    case "ALERT" ->
                                            containsAny(
                                                    content,
                                                    "accident",
                                                    "fire",
                                                    "danger",
                                                    "emergency",
                                                    "blocked",
                                                    "flood",
                                                    "urgent"
                                            );

                                    default -> true;
                                };
                    }

                    return locationMatches
                            && topicMatches;
                })
                .toList();
    }

    private AiChatResponse buildResponse(
            List<Post> posts,
            String topic,
            String location) {

        if (posts.isEmpty()) {

            String locationText =
                    location != null
                            && !location.isBlank()
                            ? " near " + location
                            : "";

            return new AiChatResponse(
                    "I couldn't find any " +
                    topic.toLowerCase() +
                    " related local posts" +
                    locationText +
                    "."
            );
        }

        StringBuilder reply =
                new StringBuilder();

        reply.append(
                "I found "
        );

        reply.append(posts.size());

        reply.append(
                " relevant local posts"
        );

        if (location != null
                && !location.isBlank()) {

            reply.append(
                    " near "
            );

            reply.append(location);
        }

        reply.append(".\n\n");

        int limit =
                Math.min(posts.size(), 5);

        for (int i = 0; i < limit; i++) {

            Post post = posts.get(i);

            reply.append("• ");
            reply.append(post.getContent());

            if (post.getLocation() != null
                    && !post.getLocation().isBlank()) {

                reply.append(
                        " 📍 "
                );

                reply.append(
                        post.getLocation()
                );
            }

            reply.append("\n\n");
        }

        if (posts.size() > 5) {

            reply.append(
                    "Showing the 5 most recent matches."
            );
        }

        return new AiChatResponse(
                reply.toString().trim()
        );
    }

    private String detectTopic(String text) {

        if (containsAny(
                text,
                "mechanic",
                "bike",
                "scooter",
                "vehicle",
                "car",
                "petrol"
        )) {
            return "VEHICLE";
        }

        if (containsAny(
                text,
                "job",
                "jobs",
                "work",
                "hiring",
                "career",
                "interview",
                "opportunity",
                "opportunities"
        )) {
            return "JOB";
        }

        if (containsAny(
                text,
                "event",
                "events",
                "meeting",
                "program",
                "festival",
                "function"
        )) {
            return "EVENT";
        }

        if (containsAny(
                text,
                "urgent",
                "emergency",
                "accident",
                "fire",
                "danger",
                "blocked",
                "flood",
                "alert"
        )) {
            return "ALERT";
        }

        return "GENERAL";
    }

    private String extractLocation(String text) {

        String[] locations = {
                "madhapur",
                "ameerpet",
                "gachibowli",
                "erragadda",
                "kukatpally",
                "hitech city",
                "nanakramguda",
                "anjaiah nagar",
                "hyderabad",
                "vijayawada"
        };

        for (String location : locations) {

            if (text.contains(location)) {

                return location
                        .replace(
                                "hitech city",
                                "HiTech City"
                        );
            }
        }

        return null;
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