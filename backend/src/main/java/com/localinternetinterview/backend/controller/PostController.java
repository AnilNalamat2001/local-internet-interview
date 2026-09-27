package com.localinternetinterview.backend.controller;

import com.localinternetinterview.backend.dto.PostRequest;
import com.localinternetinterview.backend.dto.PostResponse;
import com.localinternetinterview.backend.service.PostService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public PostResponse createPost(
            @Valid @RequestBody PostRequest request) {

        return postService.createPost(request);
    }

    @GetMapping
    public List<PostResponse> getAllPosts() {

        return postService.getAllPosts();
    }

    @GetMapping("/search")
    public List<PostResponse> searchPosts(
            @RequestParam String keyword) {

        return postService.searchPosts(keyword);
    }

    @GetMapping("/{id}")
    public PostResponse getPostById(
            @PathVariable Long id) {

        return postService.getPostById(id);
    }
}