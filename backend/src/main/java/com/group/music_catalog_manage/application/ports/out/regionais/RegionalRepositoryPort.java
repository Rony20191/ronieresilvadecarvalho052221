package com.group.music_catalog_manage.application.ports.out.regionais;

import com.group.music_catalog_manage.domain.model.Regional;
import java.util.List;
import java.util.Optional;

public interface RegionalRepositoryPort {
    List<Regional> findAll();

    Optional<Regional> findById(Integer id);

    Regional save(Regional regional);

    void deleteAll();
}
