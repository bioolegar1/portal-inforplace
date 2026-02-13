package com.inforplace.portal.infrastructure.persistence.repositories;


import com.inforplace.portal.infrastructure.persistence.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaUserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    @SuppressWarnings("unused")
    boolean existsByEmail(String email);
}
