package com.inforplace.portal.application.services;

import com.inforplace.portal.application.dtos.request.CreateReleaseNoteRequest;
import com.inforplace.portal.application.dtos.request.UpdateReleaseNoteRequest;
import com.inforplace.portal.application.dtos.response.ReleaseNoteListResponse;
import com.inforplace.portal.application.dtos.response.ReleaseNoteResponse;

import com.inforplace.portal.infrastructure.persistence.entities.ReleaseNoteEntity;
import com.inforplace.portal.infrastructure.persistence.repositories.JpaReleaseNoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReleaseNoteService {

    private final JpaReleaseNoteRepository releaseNoteRepository;

    @Transactional(readOnly = true)
    public Page<ReleaseNoteListResponse> findAllPublished(Pageable pageable) {
        log.info("Buscando releases publicadas - Página: {}, Tamanho: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return releaseNoteRepository.findAllPublishedOrderByPublishedAtDesc(pageable)
                .map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReleaseNoteResponse> findAll(Boolean published, Pageable pageable) {
        log.info("Buscando todas as releases - Publicadas: {}", published);

        if (published != null) {
            return releaseNoteRepository.findByIsPublished(published, pageable)
                    .map(this::toResponse);
        }

        return releaseNoteRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ReleaseNoteResponse findById(Long id) {
        log.info("Buscando release por ID: {}", id);

        ReleaseNoteEntity entity = releaseNoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release não encontrada com ID: " + id));

        return toResponse(entity);
    }

    @Transactional(readOnly = true)
    public ReleaseNoteResponse findBySlug(String slug) {
        log.info("Buscando release por slug: {}", slug);

        ReleaseNoteEntity entity = releaseNoteRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Release não encontrada com slug: " + slug));

        if (!entity.getIsPublished()) {
            throw new RuntimeException("Release não está publicada");
        }

        return toResponse(entity);
    }

    @Transactional
    public ReleaseNoteResponse create(CreateReleaseNoteRequest request) {
        log.info("Criando nova release: {}", request.getTitle());

        // Validar slug único
        if (releaseNoteRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Já existe uma release com este slug: " + request.getSlug());
        }

        ReleaseNoteEntity entity = ReleaseNoteEntity.builder()
                .version(request.getVersion())
                .title(request.getTitle())
                .slug(request.getSlug())
                .summary(request.getSummary())
                .coverImage(request.getCoverImage())
                .contentBlocks(request.getContentBlocks())
                .isPublished(request.getIsPublished())
                .build();

        if (Boolean.TRUE.equals(request.getIsPublished())) {
            entity.setPublishedAt(LocalDateTime.now());
        }

        entity = releaseNoteRepository.save(entity);

        log.info("Release criada com sucesso - ID: {}", entity.getId());

        return toResponse(entity);
    }

    @Transactional
    public ReleaseNoteResponse update(Long id, UpdateReleaseNoteRequest request) {
        log.info("Atualizando release ID: {}", id);

        ReleaseNoteEntity entity = releaseNoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release não encontrada com ID: " + id));

        // Validar slug único (se mudou)
        if (!entity.getSlug().equals(request.getSlug()) &&
                releaseNoteRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Já existe uma release com este slug: " + request.getSlug());
        }

        entity.setVersion(request.getVersion());
        entity.setTitle(request.getTitle());
        entity.setSlug(request.getSlug());
        entity.setSummary(request.getSummary());
        entity.setCoverImage(request.getCoverImage());
        entity.setContentBlocks(request.getContentBlocks());

        boolean wasPublished = entity.getIsPublished();
        entity.setIsPublished(request.getIsPublished());

        // Se está publicando agora, setar publishedAt
        if (Boolean.TRUE.equals(request.getIsPublished()) && !wasPublished) {
            entity.setPublishedAt(LocalDateTime.now());
        }

        entity = releaseNoteRepository.save(entity);

        log.info("Release atualizada com sucesso - ID: {}", entity.getId());

        return toResponse(entity);
    }

    @Transactional
    public ReleaseNoteResponse publish(Long id) {
        log.info("Publicando release ID: {}", id);

        ReleaseNoteEntity entity = releaseNoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release não encontrada com ID: " + id));

        if (Boolean.TRUE.equals(entity.getIsPublished())) {
            throw new IllegalArgumentException("Release já está publicada");
        }

        entity.setIsPublished(true);
        entity.setPublishedAt(LocalDateTime.now());

        entity = releaseNoteRepository.save(entity);

        log.info("Release publicada com sucesso - ID: {}", entity.getId());

        return toResponse(entity);
    }

    @Transactional
    public ReleaseNoteResponse unpublish(Long id) {
        log.info("Despublicando release ID: {}", id);

        ReleaseNoteEntity entity = releaseNoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release não encontrada com ID: " + id));

        if (Boolean.FALSE.equals(entity.getIsPublished())) {
            throw new IllegalArgumentException("Release já está despublicada");
        }

        entity.setIsPublished(false);
        entity.setPublishedAt(null);

        entity = releaseNoteRepository.save(entity);

        log.info("Release despublicada com sucesso - ID: {}", entity.getId());

        return toResponse(entity);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deletando release ID: {}", id);

        if (!releaseNoteRepository.existsById(id)) {
            throw new RuntimeException("Release não encontrada com ID: " + id);
        }

        releaseNoteRepository.deleteById(id);

        log.info("Release deletada com sucesso - ID: {}", id);
    }

    @Transactional
    public void incrementViewCount(String slug) {
        log.debug("Incrementando view count para slug: {}", slug);
        releaseNoteRepository.incrementViewCount(slug);
    }

    // Métodos de conversão

    private ReleaseNoteResponse toResponse(ReleaseNoteEntity entity) {
        return ReleaseNoteResponse.builder()
                .id(entity.getId())
                .version(entity.getVersion())
                .title(entity.getTitle())
                .slug(entity.getSlug())
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

    private ReleaseNoteListResponse toListResponse(ReleaseNoteEntity entity) {
        return ReleaseNoteListResponse.builder()
                .id(entity.getId())
                .version(entity.getVersion())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .summary(entity.getSummary())
                .coverImage(entity.getCoverImage())
                .isPublished(entity.getIsPublished())
                .publishedAt(entity.getPublishedAt())
                .createdAt(entity.getCreatedAt())
                .viewCount(entity.getViewCount())
                .build();
    }
}