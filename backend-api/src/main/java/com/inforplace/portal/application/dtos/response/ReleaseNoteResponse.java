package com.inforplace.portal.application.dtos.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReleaseNoteResponse {

    private Long id;
    private String version;
    private String title;
    private String slug;
    private String summary;
    private String coverImage;
    private List<Object> contentBlocks;
    private Boolean isPublished;
    private LocalDateTime publishedAt;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer viewCount;
}
