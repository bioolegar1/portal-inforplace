package com.inforplace.portal.domain.model.blocks;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.inforplace.portal.domain.enums.BlockType;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = HeaderBlock.class, name = "HEADER"),
        @JsonSubTypes.Type(value = TextBlock.class, name = "TEXT"),
        @JsonSubTypes.Type(value = ImageBlock.class, name = "IMAGE"),
        @JsonSubTypes.Type(value = ComparisonBlock.class, name = "COMPARISON"),
        @JsonSubTypes.Type(value = ChecklistBlock.class, name = "CHECKLIST"),
        @JsonSubTypes.Type(value = ModuleHighlightBlock.class, name = "MODULE_HIGHLIGHT"),
        @JsonSubTypes.Type(value = AlertBlock.class, name = "ALERT"),
        @JsonSubTypes.Type(value = TimelineBlock.class, name = "TIMELINE")
})
public interface ContentBlock {
    String getId();
    BlockType getType();
    @SuppressWarnings("unused")
    Integer getOrder();
}