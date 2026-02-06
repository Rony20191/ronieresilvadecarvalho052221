package com.group.music_catalog_manage.infrastructure.persistence.adapter;

import com.group.music_catalog_manage.application.ports.out.regionais.RegionalRepositoryPort;
import com.group.music_catalog_manage.domain.model.Regional;
import com.group.music_catalog_manage.infrastructure.persistence.repository.RegionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RegionalPersistenceAdapter implements RegionalRepositoryPort {

    private final RegionalRepository regionalRepository;

    @Override
    public List<Regional> findAll() {
        return regionalRepository.findAll();
    }

    @Override
    public Optional<Regional> findById(Integer id) {
        return regionalRepository.findById(id);
    }

    @Override
    public Regional save(Regional regional) {
        return regionalRepository.save(regional);
    }

    @Override
    public void deleteAll() {
        regionalRepository.deleteAll();
    }
}
