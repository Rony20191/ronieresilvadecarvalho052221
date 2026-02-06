package com.group.music_catalog_manage.infrastructure.persistence.repository;

import com.group.music_catalog_manage.domain.model.Regional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegionalRepository extends JpaRepository<Regional, Integer> {
}
