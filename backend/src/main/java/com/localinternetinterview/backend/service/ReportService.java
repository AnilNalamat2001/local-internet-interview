package com.localinternetinterview.backend.service;

import com.localinternetinterview.backend.dto.ReportRequest;
import com.localinternetinterview.backend.dto.ReportResponse;
import com.localinternetinterview.backend.entity.Post;
import com.localinternetinterview.backend.entity.Report;
import com.localinternetinterview.backend.entity.User;
import com.localinternetinterview.backend.repository.PostRepository;
import com.localinternetinterview.backend.repository.ReportRepository;
import com.localinternetinterview.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public ReportService(
            ReportRepository reportRepository,
            UserRepository userRepository,
            PostRepository postRepository) {

        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public ReportResponse createReport(ReportRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        Report report = new Report();

        report.setReason(request.getReason());
        report.setUser(user);
        report.setPost(post);
        report.setCreatedAt(LocalDateTime.now());

        Report savedReport = reportRepository.save(report);

        return convertToResponse(savedReport);
    }

    private ReportResponse convertToResponse(Report report) {

        Long userId = null;
        String userName = null;

        if (report.getUser() != null) {
            userId = report.getUser().getId();
            userName = report.getUser().getName();
        }

        Long postId = null;

        if (report.getPost() != null) {
            postId = report.getPost().getId();
        }

        return new ReportResponse(
                report.getId(),
                report.getReason(),
                userId,
                userName,
                postId,
                report.getCreatedAt()
        );
    }
}
