package com.inforplace.portal.application.dtos.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalPosts;
    private long totalPublished; // ADICIONE ESTE
    private long totalDrafts;    // ADICIONE ESTE
    private long totalTutorials;
    private long totalReleaseNotes;
    private long totalTips;
    private long totalNews;
    private long totalViews;
    private long totalUsers;
}