package com.inforplace.portal.application.dtos.response;

import com.inforplace.portal.domain.enums.PostType;
import com.inforplace.portal.domain.enums.ProductSystem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostListResponse {

    private Long id;
    private ProductSystem productSystem; // ADICIONE ESTE CAMPO
    private String version;
    private String title;
    private String slug;
    private PostType type; // Este campo resolve o erro do Builder
    private String category;
    private String summary;
    private String coverImage;
    private Boolean isPublished;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private Integer viewCount;
}
