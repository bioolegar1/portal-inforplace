package com.inforplace.portal.application.services;

import com.inforplace.portal.application.dtos.request.CreatePostRequest;
import com.inforplace.portal.application.dtos.request.UpdatePostRequest;
import com.inforplace.portal.application.dtos.response.DashboardStatsResponse;
import com.inforplace.portal.application.dtos.response.PostListResponse;
import com.inforplace.portal.application.dtos.response.PostResponse;
import com.inforplace.portal.domain.enums.PostType;
import com.inforplace.portal.domain.enums.ProductSystem;
import com.inforplace.portal.infrastructure.persistence.entities.PostEntity;
import com.inforplace.portal.infrastructure.persistence.repositories.JpaPostRepository;
import com.inforplace.portal.infrastructure.persistence.repositories.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final JpaPostRepository postRepository;
    private final JpaUserRepository userRepository;

    // Cache em memória para evitar que o mesmo IP gere múltiplas views no mesmo post em curto tempo
    private final Set<String> viewedPostsCache = ConcurrentHashMap.newKeySet();

    // --- MÉTODOS DE ESTATÍSTICAS (DASHBOARD) ---

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        log.info("Calculando estatísticas detalhadas para o dashboard");

        // Lógica: Buscamos os totais gerais e de estado
        long totalPosts = postRepository.count();
        long totalPublished = postRepository.countByIsPublishedTrue();
        long totalDrafts = postRepository.countByIsPublishedFalse();

        // Lógica: Buscamos as contagens por tipo usando .name() para o CAST no banco
        long totalTutorials = postRepository.countByType(PostType.TUTORIAL.name());
        long totalReleaseNotes = postRepository.countByType(PostType.RELEASE_NOTE.name());
        long totalTips = postRepository.countByType(PostType.TIP.name());
        long totalNews = postRepository.countByType(PostType.NEWS.name());

        long totalUsers = userRepository.count();

        // Lógica: Tratamos o nulo da soma para evitar erro de desempacotamento
        Long totalViewsRaw = postRepository.sumTotalViews();
        long totalViews = (totalViewsRaw != null) ? totalViewsRaw : 0;

        return DashboardStatsResponse.builder()
                .totalPosts(totalPosts)
                .totalPublished(totalPublished)
                .totalDrafts(totalDrafts)
                .totalTutorials(totalTutorials)
                .totalReleaseNotes(totalReleaseNotes)
                .totalTips(totalTips)
                .totalNews(totalNews)
                .totalViews(totalViews)
                .totalUsers(totalUsers)
                .build();
    }

    // --- MÉTODOS DE CONSULTA (PÚBLICO E ADMIN) ---

    @Transactional(readOnly = true)
    public Page<PostListResponse> findAllPublished(PostType type, ProductSystem system, String category, Pageable pageable) {
        log.info("Buscando conteúdos publicados - Tipo: {}, Sistema: {}, Categoria: {}", type, system, category);

        if (type != null && system != null && category != null) {
            return postRepository.findByTypeAndProductSystemAndCategoryAndIsPublishedTrue(type, system, category, pageable)
                    .map(this::toListResponse);
        }

        if (type != null && system != null) {
            return postRepository.findByTypeAndProductSystemAndIsPublishedTrue(type, system, pageable)
                    .map(this::toListResponse);
        }

        if (type != null && category != null) {
            return postRepository.findByTypeAndCategoryAndIsPublishedTrue(type, category, pageable)
                    .map(this::toListResponse);
        }

        if (type != null) {
            return postRepository.findByTypeAndIsPublishedTrue(type, pageable)
                    .map(this::toListResponse);
        }

        return postRepository.findAllPublishedOrderByPublishedAtDesc(pageable)
                .map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> findAll(Boolean published, Pageable pageable) {
        log.info("Buscando todas as postagens - Publicadas: {}", published);

        if (published != null) {
            return postRepository.findByIsPublished(published, pageable)
                    .map(this::toResponse);
        }

        return postRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public PostResponse findById(Long id) {
        return postRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado com ID: " + id));
    }

    @Transactional(readOnly = true)
    public PostResponse findBySlug(String slug) {
        PostEntity entity = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado com slug: " + slug));

        if (!Boolean.TRUE.equals(entity.getIsPublished())) {
            throw new RuntimeException("Conteúdo não está publicado");
        }

        return toResponse(entity);
    }

    // --- MÉTODOS DE ESCRITA (ADMIN) ---

    @Transactional
    public PostResponse create(CreatePostRequest request) {
        log.info("Criando nova postagem: {} para o sistema: {}", request.getTitle(), request.getProductSystem());

        if (postRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Já existe um conteúdo com este slug: " + request.getSlug());
        }

        PostEntity entity = PostEntity.builder()
                .productSystem(request.getProductSystem())
                .version(request.getVersion())
                .title(request.getTitle())
                .slug(request.getSlug())
                .type(request.getType())
                .category(request.getCategory())
                .summary(request.getSummary())
                .coverImage(request.getCoverImage())
                .contentBlocks(request.getContentBlocks())
                .isPublished(Boolean.TRUE.equals(request.getIsPublished()))
                .build();

        if (Boolean.TRUE.equals(entity.getIsPublished())) {
            entity.setPublishedAt(LocalDateTime.now());
        }

        return toResponse(postRepository.save(entity));
    }

    @Transactional
    public PostResponse update(Long id, UpdatePostRequest request) {
        log.info("Atualizando postagem ID: {}", id);

        PostEntity entity = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado com ID: " + id));

        if (!entity.getSlug().equals(request.getSlug()) && postRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Já existe um conteúdo com este slug: " + request.getSlug());
        }

        entity.setProductSystem(request.getProductSystem());
        entity.setVersion(request.getVersion());
        entity.setTitle(request.getTitle());
        entity.setSlug(request.getSlug());
        entity.setType(request.getType());
        entity.setCategory(request.getCategory());
        entity.setSummary(request.getSummary());
        entity.setCoverImage(request.getCoverImage());
        entity.setContentBlocks(request.getContentBlocks());

        boolean wasPublished = Boolean.TRUE.equals(entity.getIsPublished());
        boolean willBePublished = Boolean.TRUE.equals(request.getIsPublished());

        if (willBePublished && !wasPublished) {
            entity.setPublishedAt(LocalDateTime.now());
        } else if (!willBePublished && wasPublished) {
            entity.setPublishedAt(null);
        }

        entity.setIsPublished(willBePublished);

        return toResponse(postRepository.save(entity));
    }

    @Transactional
    public PostResponse publish(Long id) {
        PostEntity entity = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado"));

        entity.setIsPublished(true);
        entity.setPublishedAt(LocalDateTime.now());
        return toResponse(postRepository.save(entity));
    }

    @Transactional
    public PostResponse unpublish(Long id) {
        PostEntity entity = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado"));

        entity.setIsPublished(false);
        entity.setPublishedAt(null);
        return toResponse(postRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Conteúdo não encontrado");
        }
        postRepository.deleteById(id);
    }

    @Transactional
    public void incrementViewCount(String slug, String userIp) {
        String cacheKey = slug + "_" + userIp;

        if (!viewedPostsCache.contains(cacheKey)) {
            postRepository.incrementViewCount(slug);
            viewedPostsCache.add(cacheKey);
            log.debug("View contabilizada para o post {} pelo IP {}", slug, userIp);
        } else {
            log.debug("View ignorada (Spam detectado) para o post {} pelo IP {}", slug, userIp);
        }
    }

    // --- MÉTODOS PRIVADOS DE MAPEAMENTO (DTO/ENTITY) ---

    private PostResponse toResponse(PostEntity entity) {
        return PostResponse.builder()
                .id(entity.getId())
                .productSystem(entity.getProductSystem())
                .version(entity.getVersion())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .type(entity.getType())
                .category(entity.getCategory())
                .summary(entity.getSummary())
                .coverImage(entity.getCoverImage())
                .contentBlocks(entity.getContentBlocks())
                .isPublished(entity.getIsPublished())
                .publishedAt(entity.getPublishedAt())
                .createdBy(entity.getCreatedBy())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .viewCount(entity.getViewCount())
                .build();
    }

    private PostListResponse toListResponse(PostEntity entity) {
        return PostListResponse.builder()
                .id(entity.getId())
                .productSystem(entity.getProductSystem())
                .version(entity.getVersion())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .type(entity.getType())
                .category(entity.getCategory())
                .summary(entity.getSummary())
                .coverImage(entity.getCoverImage())
                .isPublished(entity.getIsPublished())
                .publishedAt(entity.getPublishedAt())
                .createdAt(entity.getCreatedAt())
                .viewCount(entity.getViewCount())
                .build();
    }
}