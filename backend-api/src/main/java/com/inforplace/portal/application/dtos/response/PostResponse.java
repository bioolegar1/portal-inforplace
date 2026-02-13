package com.inforplace.portal.application.dtos.response;


import com.inforplace.portal.domain.enums.PostType;
import com.inforplace.portal.domain.enums.ProductSystem;
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
public class PostResponse {

        private Long id;
        private ProductSystem productSystem; // ADICIONE ESTE CAMPO
        private String version;
        private String title;
        private String slug;
        private PostType type;
        private String category;
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
