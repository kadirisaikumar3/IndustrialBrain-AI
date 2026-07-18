package com.industrialbrain.backend.controller;

import com.industrialbrain.backend.dto.DashboardStats;
import com.industrialbrain.backend.dto.RecentActivityDTO;
import com.industrialbrain.backend.dto.UploadTrendDTO;
import com.industrialbrain.backend.entity.User;
import com.industrialbrain.backend.service.DashboardService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardStats getStats(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return dashboardService.getStats(user);
    }

    @GetMapping("/trend")
    public List<UploadTrendDTO> getUploadTrend(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return dashboardService.getUploadTrend(user);
    }

    @GetMapping("/activity")
    public List<RecentActivityDTO> getRecentActivity(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return dashboardService.getRecentActivity(user);
    }
}