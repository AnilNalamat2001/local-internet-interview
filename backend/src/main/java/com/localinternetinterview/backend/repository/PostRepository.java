package com.localinternetinterview.backend.repository;

import com.localinternetinterview.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByContentContainingIgnoreCaseOrderByCreatedAtDesc(
            String keyword
    );
}