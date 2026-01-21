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

public class ChecklistBlock implements ContentBlock{
    private String id;

    @Builder.Default
    private BlockType type = BlockType.CHECKLIST;

    private Integer order;
    private ChecklistData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChecklistData{
        private String title;

        @Builder.Default
        private List<ChecklistItem>items = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChecklistItem{
        private String text;

        @Builder.Default
        private Boolean checked = false;

        @Builder.Default
        private Boolean highlight = false;
    }
}
