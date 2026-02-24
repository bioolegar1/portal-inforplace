package com.inforplace.portal.domain.model.blocks;

import com.inforplace.portal.domain.enums.BlockType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class YoutubeBlock implements ContentBlock {

    // Lógica: Identificador único gerado pelo frontend
    private String id;

    // Lógica: Define o tipo do bloco automaticamente para o Jackson saber como mapear
    @Builder.Default
    private BlockType type = BlockType.YOUTUBE;

    // Lógica: A posição do bloco na tela
    private Integer order;

    // Lógica: O objeto interno que guarda os dados específicos deste bloco
    private YoutubeData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class YoutubeData {
        // Lógica: A URL completa do vídeo copiada pelo usuário
        private String videoUrl;

        // Lógica: O título opcional para o vídeo
        private String title;
    }
}