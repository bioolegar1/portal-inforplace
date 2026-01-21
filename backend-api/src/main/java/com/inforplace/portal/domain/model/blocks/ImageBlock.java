package com.inforplace.portal.domain.model.blocks;

import com.inforplace.portal.domain.enums.BlockType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageBlock implements ContentBlock {
    private String id;

    @Builder.Default
    private BlockType type = BlockType.IMAGE;

    private Integer order;
    private ImageData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImageData{
        private String url;
        private String alt;
        private String caption;
        private String Width;

        @Builder.Default
        private Boolean zoomable = false;
    }

}
