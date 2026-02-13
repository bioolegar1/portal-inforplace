package com.inforplace.portal.infrastructure.persistence.entities;


import com.inforplace.portal.domain.enums.PostType;
import com.inforplace.portal.domain.enums.ProductSystem;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "portal_posts") // Nome mais genérico para abranger tutoriais e notícias
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostEntity { // Renomeado de ReleaseNoteEntity para PostEntity

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Para tutoriais, a versão pode ser nula ou usada para indicar a versão do sistema que o tutorial cobre
    @Column(length = 50)
    private String version;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    // NOVO: Campo que define se é Tutorial, Notícia ou Release
    @Enumerated(EnumType.STRING)
    @Column(name = "post_type", nullable = false)
    private PostType type;

    // NOVO: Útil para agrupar tutoriais (ex: "Financeiro", "Estoque")
    @Column(length = 100)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String coverImage;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content_blocks", columnDefinition = "jsonb", nullable = false)
    @Builder.Default
    private List<Object> contentBlocks = new ArrayList<>();

    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        // Se o tipo for nulo, define um padrão para não quebrar o banco
        if (this.type == null) this.type = PostType.RELEASE_NOTE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @NotNull(message = "O sistema é obrigatório")
    @Enumerated(EnumType.STRING) // Lógica: Salva o nome (ex: 'PILLAR') em vez do índice (0, 1)
    @Column(name = "product_system", nullable = false) // Lógica: Mapeia para a coluna exata do seu script SQL
    private ProductSystem productSystem;
}