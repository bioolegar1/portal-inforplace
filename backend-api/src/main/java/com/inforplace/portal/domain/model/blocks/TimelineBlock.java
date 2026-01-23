package com.inforplace.portal.domain.model.blocks;


import com.inforplace.portal.domain.enums.BlockType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimelineBlock  implements ContentBlock{
    private String id;

    @Builder.Default
    private BlockType type = BlockType.TIMELINE;

    private Integer order;
    private TimelineData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TimelineData{
        private String title;

        @Builder.Default
        private String orientation = "vertical";

        private List<TimelineStep> steps;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TimelineStep{
        private String title;
        private String description;
        private String icon;
        private String status;
    }
}
