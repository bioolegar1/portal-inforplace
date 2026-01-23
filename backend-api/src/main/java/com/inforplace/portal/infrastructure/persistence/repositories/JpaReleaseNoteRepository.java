package com.inforplace.portal.infrastructure.persistence.repositories;


import com.inforplace.portal.infrastructure.persistence.entities.ReleaseNoteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaReleaseNoteRepository extends JpaRepository<ReleaseNoteEntity, Long> {

    Optional<ReleaseNoteEntity> findBySlug(String slug);

    Page<ReleaseNoteEntity> findByIsPublished(boolean isPublished, Pageable pageable);

    @Query("SELECT r FROM ReleaseNoteEntity r WHERE r.isPublished = true ORDER BY r.publishedAt DESC")
    Page<ReleaseNoteEntity> findAllPublishedOrderByPublishedAtDesc(Pageable pageable);

    boolean existsBySlug(String slug);

    @Modifying
    @Query("UPDATE ReleaseNoteEntity r SET r.viewCount = r.viewCount + 1 WHERE r.slug = :slug")
    void incrementViewCount(@Param("slug") String slug);

}
