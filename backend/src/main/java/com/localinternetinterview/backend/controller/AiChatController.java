package com.localinternetinterview.backend.controller;

import com.localinternetinterview.backend.dto.AiChatRequest;
import com.localinternetinterview.backend.dto.AiChatResponse;
import com.localinternetinterview.backend.service.AiChatService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiChatController {

    private final AiChatService aiChatService;

    public AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public AiChatResponse chat(
            @Valid @RequestBody AiChatRequest request) {

        return aiChatService.chat(
                request.getMessage(),
                request.getUserId()
        );
    }
}