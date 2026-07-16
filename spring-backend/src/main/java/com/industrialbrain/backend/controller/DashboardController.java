package com.industrialbrain.backend.controller;

import com.industrialbrain.backend.dto.DashboardStats;
import com.industrialbrain.backend.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import com.industrialbrain.backend.dto.UploadTrendDTO;
import java.util.List;

import com.industrialbrain.backend.dto.RecentActivityDTO;


@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardStats getStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/trend")
public List<UploadTrendDTO> getUploadTrend() {

    return dashboardService.getUploadTrend();

}
@GetMapping("/activity")
public List<RecentActivityDTO> getRecentActivity() {

    return dashboardService.getRecentActivity();

}
}