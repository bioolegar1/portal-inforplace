package com.inforplace.portal.application.dtos.request;

import com.inforplace.portal.domain.enums.PostType;
import com.inforplace.portal.domain.enums.ProductSystem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePostRequest {

    // Versão agora é opcional para tutoriais e notícias
    @Size(max = 50, message = "A Versão deve ter no máximo 50 caracteres")
    private String version;

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 200, message = "O Título deve ter no máximo 200 caracteres")
    private String title;

    @NotBlank(message = "Slug é obrigatório")
    @Size(max = 200, message = "O Slug deve ter no máximo 200 caracteres")
    private String slug;

    @NotNull(message = "O tipo de postagem é obrigatório")
    private PostType type;

    private String category;

    @NotBlank(message = "Resumo é obrigatório")
    @Size(max = 500, message = "O Resumo deve ter no máximo 500 caracteres")
    private String summary;

    private String coverImage;

    @NotNull(message = "Blocos de conteúdo são Obrigatórios")
    private List<Object> contentBlocks;

    private Boolean isPublished;

    @NotNull(message = "O sistema é obrigatório")
    private ProductSystem productSystem; // ADICIONE ESTE CAMPO
}