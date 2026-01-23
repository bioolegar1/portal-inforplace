package com.inforplace.portal.application.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReleaseNoteListResponse {

    private Long id;
    private String version;
    private String title;
    private String slug;
    private String summary;
    private String coverImage;
    private Boolean isPublished;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private Integer viewCount;
}
