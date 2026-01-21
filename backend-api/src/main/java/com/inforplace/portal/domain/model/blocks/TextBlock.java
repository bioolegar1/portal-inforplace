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
public class TextBlock implements ContentBlock{
    private String id;

    @Builder.Default
    private BlockType type = BlockType.TEXT;

    private Integer order;
    private TextData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TextData{
        private String content;

        @Builder.Default
        private Boolean allowHtml = true;
    }

}
