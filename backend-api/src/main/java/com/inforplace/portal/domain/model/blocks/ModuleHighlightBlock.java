package com.inforplace.portal.domain.model.blocks;

import com.inforplace.portal.domain.enums.BlockType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleHighlightBlock implements ContentBlock{
    private String id;

    @Builder.Default
    private BlockType type = BlockType.MODULE_HIGHLIGHT;

    private Integer order;
    private ModuleHighlightData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ModuleHighlightData {
        private String title;
        private String subtitle;
        private String iconUrl;

        @Builder.Default
        private List<String> features = new ArrayList<>();

        private String variant; // primary, secondary, accent
    }
}