package com.inforplace.portal.infrastructure.persistence.repositories;

import com.inforplace.portal.domain.enums.PostType;
import com.inforplace.portal.domain.enums.ProductSystem;
import com.inforplace.portal.infrastructure.persistence.entities.PostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JpaPostRepository extends JpaRepository<PostEntity, Long> {

    long countByIsPublishedTrue();
    long countByIsPublishedFalse();

    @Query(value = "SELECT COUNT(*) FROM portal_posts WHERE post_type = CAST(:type AS post_type)", nativeQuery = true)
    long countByType(@Param("type") String type);

    @Query("SELECT SUM(p.viewCount) FROM PostEntity p")
    Long sumTotalViews();


    Optional<PostEntity> findBySlug(String slug);

    // Para resolver o erro do Service que busca por 'isPublished'
    Page<PostEntity> findByIsPublished(boolean isPublished, Pageable pageable);

    // Para resolver o erro 'Cannot resolve method findAllPublishedOrderByPublishedAtDesc'
    @Query("SELECT p FROM PostEntity p WHERE p.isPublished = true ORDER BY p.publishedAt DESC")
    Page<PostEntity> findAllPublishedOrderByPublishedAtDesc(Pageable pageable);

    // Métodos novos para a área de Tutoriais
    Page<PostEntity> findByTypeAndIsPublishedTrue(PostType type, Pageable pageable);

    Page<PostEntity> findByTypeAndProductSystemAndCategoryAndIsPublishedTrue(
            PostType type,
            ProductSystem productSystem,
            String category,
            Pageable pageable
    );
    boolean existsBySlug(String slug);

    @Modifying
    @Query("UPDATE PostEntity p SET p.viewCount = p.viewCount + 1 WHERE p.slug = :slug")
    void incrementViewCount(@Param("slug") String slug);

    Page<PostEntity> findByTypeAndProductSystemAndIsPublishedTrue(
            PostType type,
            ProductSystem productSystem,
            Pageable pageable
    );

    Page<PostEntity> findByTypeAndCategoryAndIsPublishedTrue(
            PostType type,
            String category,
            Pageable pageable
    );
}