package com.localinternetinterview.backend.controller;

import com.localinternetinterview.backend.dto.CommentRequest;
import com.localinternetinterview.backend.dto.CommentResponse;
import com.localinternetinterview.backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public CommentResponse createComment(
            @Valid @RequestBody CommentRequest request) {

        return commentService.createComment(request);
    }

    @GetMapping("/post/{postId}")
    public List<CommentResponse> getCommentsByPostId(
            @PathVariable Long postId) {

        return commentService.getCommentsByPostId(postId);
    }
}