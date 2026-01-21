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
public class ComparisonBlock implements ContentBlock{
    private String id;

    @Builder.Default
    private BlockType type = BlockType.COMPARISON;

    private Integer order;
    private ComparisonData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComparisonData{
        private String imageBefore;
        private String imageAfter;
        private String captionBefore;
        private String captionAfter;

        @Builder.Default
        private Integer sliderPosition = 50;

    }
}
