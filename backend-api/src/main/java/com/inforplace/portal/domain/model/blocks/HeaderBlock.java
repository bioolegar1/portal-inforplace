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
public class HeaderBlock  implements ContentBlock{

    private String id;

    @Builder.Default
    private BlockType type = BlockType.HEADER;

    private Integer order;
    private  HeaderData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HeaderData{
        private String title;
        private String subtitle;
        private Integer level;
        private String alignment;
    }

}
