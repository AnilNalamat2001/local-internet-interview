package com.localinternetinterview.backend.service;

import com.localinternetinterview.backend.dto.AiAnalysisResponse;
import com.localinternetinterview.backend.dto.PostRequest;
import com.localinternetinterview.backend.dto.PostResponse;
import com.localinternetinterview.backend.entity.Post;
import com.localinternetinterview.backend.entity.PostCategory;
import com.localinternetinterview.backend.entity.User;
import com.localinternetinterview.backend.repository.PostRepository;
import com.localinternetinterview.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final AiService aiService;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            AiService aiService) {

        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
    }

    public PostResponse createPost(PostRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AiAnalysisResponse aiResult =
                aiService.analyzePost(request.getContent());

        Post post = new Post();

        post.setContent(request.getContent());

        post.setCategory(convertToCategory(aiResult.getIntent()));

        post.setLocation(aiResult.getLocation());

        post.setUser(user);

        post.setCreatedAt(LocalDateTime.now());

        Post savedPost = postRepository.save(post);

        return convertToResponse(savedPost, aiResult);
    }

    public List<PostResponse> getAllPosts() {

        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> convertToResponse(
                        post,
                        aiService.analyzePost(post.getContent())
                ))
                .toList();
    }

    public List<PostResponse> searchPosts(String keyword) {

        return postRepository
                .findByContentContainingIgnoreCaseOrderByCreatedAtDesc(
                        keyword
                )
                .stream()
                .map(post -> convertToResponse(
                        post,
                        aiService.analyzePost(post.getContent())
                ))
                .toList();
    }

    public PostResponse getPostById(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        AiAnalysisResponse aiResult =
                aiService.analyzePost(post.getContent());

        return convertToResponse(post, aiResult);
    }

    private PostCategory convertToCategory(String intent) {

        return switch (intent) {

            case "NEED" -> PostCategory.NEED;

            case "OFFER" -> PostCategory.OFFER;

            case "EVENT" -> PostCategory.EVENT;

            case "LOCAL_ALERT" -> PostCategory.LOCAL_UPDATE;

            default -> PostCategory.ASK;
        };
    }

    private PostResponse convertToResponse(
            Post post,
            AiAnalysisResponse aiResult) {

        Long userId = null;
        String userName = null;

        if (post.getUser() != null) {
            userId = post.getUser().getId();
            userName = post.getUser().getName();
        }

        return new PostResponse(
                post.getId(),
                post.getContent(),
                post.getCategory(),
                post.getLocation(),
                aiResult.getTopic(),
                aiResult.getUrgency(),
                userId,
                userName,
                post.getCreatedAt()
        );
    }
}