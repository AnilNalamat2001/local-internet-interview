
package com.localinternetinterview.backend.controller;

import com.localinternetinterview.backend.dto.ReportRequest;
import com.localinternetinterview.backend.dto.ReportResponse;
import com.localinternetinterview.backend.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ReportResponse createReport(
            @Valid @RequestBody ReportRequest request) {

        return reportService.createReport(request);
    }
}
