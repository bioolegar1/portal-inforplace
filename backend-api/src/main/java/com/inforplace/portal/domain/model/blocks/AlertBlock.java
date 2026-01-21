package com.inforplace.portal.domain.model.blocks;


import com.inforplace.portal.domain.enums.AlertType;
import com.inforplace.portal.domain.enums.BlockType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertBlock {
    private String id;

    @Builder.Default
    private BlockType type = BlockType.ALERT;

    private Integer order;
    private AlertData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AlertData{
        private AlertType type;
        private String title;
        private String message;

        @Builder.Default
        private Boolean dismissible = true;
    }
}
