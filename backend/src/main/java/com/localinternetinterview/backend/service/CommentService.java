package com.localinternetinterview.backend.service;

import com.localinternetinterview.backend.dto.CommentRequest;
import com.localinternetinterview.backend.dto.CommentResponse;
import com.localinternetinterview.backend.entity.Comment;
import com.localinternetinterview.backend.entity.Post;
import com.localinternetinterview.backend.entity.User;
import com.localinternetinterview.backend.repository.CommentRepository;
import com.localinternetinterview.backend.repository.PostRepository;
import com.localinternetinterview.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public CommentService(
            CommentRepository commentRepository,
            UserRepository userRepository,
            PostRepository postRepository) {

        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public CommentResponse createComment(CommentRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();

        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());

        if (request.getParentCommentId() != null) {

            Comment parentComment = commentRepository
                    .findById(request.getParentCommentId())
                    .orElseThrow(() ->
                            new RuntimeException("Parent comment not found"));

            comment.setParentComment(parentComment);
        }

        Comment savedComment = commentRepository.save(comment);

        return convertToResponse(savedComment);
    }

    public List<CommentResponse> getCommentsByPostId(Long postId) {

        return commentRepository
                .findAllByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private CommentResponse convertToResponse(Comment comment) {

        Long userId = null;
        String userName = null;
        Long parentCommentId = null;

        if (comment.getUser() != null) {
            userId = comment.getUser().getId();
            userName = comment.getUser().getName();
        }

        if (comment.getParentComment() != null) {
            parentCommentId =
                    comment.getParentComment().getId();
        }

        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                userId,
                userName,
                parentCommentId,
                comment.getCreatedAt()
        );
    }
}