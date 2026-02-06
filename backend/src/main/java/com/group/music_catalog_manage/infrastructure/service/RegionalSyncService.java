package com.group.music_catalog_manage.infrastructure.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.group.music_catalog_manage.application.ports.out.regionais.RegionalRepositoryPort;
import com.group.music_catalog_manage.domain.model.Regional;
import com.group.music_catalog_manage.infrastructure.config.regional.RegionalApiDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegionalSyncService {

    private final RegionalRepositoryPort regionalRepository;
    private final ObjectMapper objectMapper;
    private final OkHttpClient okHttpClient = new OkHttpClient();

    @org.springframework.beans.factory.annotation.Value("${app.external.regional-api-url}")
    private String apiUrl;

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        syncRegionais();
    }

    @Scheduled(fixedRateString = "${app.sync-regional.rate:1800000}") // 30 mins default
    @Transactional
    public void syncRegionais() {
        log.info("Starting Regional synchronization...");
        try {
            List<RegionalApiDto> apiData = fetchFromApi();
            if (apiData == null) {
                log.warn("Failed to fetch data from Regional API. Skipping sync.");
                return;
            }

            Map<Integer, RegionalApiDto> apiMap = apiData.stream()
                    .collect(Collectors.toMap(RegionalApiDto::getId, Function.identity()));

            List<Regional> localData = regionalRepository.findAll();

            for (Regional regional : localData) {
                if (!apiMap.containsKey(regional.getId())) {
                    if (regional.getAtivo()) {
                        regional.setAtivo(false);
                        regionalRepository.save(regional);
                        log.info("Inactivated Regional ID: {}", regional.getId());
                    }
                } else {
                    RegionalApiDto apiDto = apiMap.get(regional.getId());
                    if (!regional.getNome().equals(apiDto.getNome())) {

                        regional.setNome(apiDto.getNome());
                        regional.setAtivo(true);
                        regionalRepository.save(regional);
                        log.info("Updated Regional ID: {} Name: {}", regional.getId(), regional.getNome());
                    } else if (!regional.getAtivo()) {
                        regional.setAtivo(true);
                        regionalRepository.save(regional);
                    }
                }
                apiMap.remove(regional.getId());
            }

            for (RegionalApiDto newDto : apiMap.values()) {
                Regional newRegional = new Regional(newDto.getId(), newDto.getNome(), true);
                regionalRepository.save(newRegional);
                log.info("Created new Regional ID: {}", newRegional.getId());
            }

            log.info("Regional synchronization completed.");

        } catch (Exception e) {
            log.error("Error during Regional synchronization", e);
        }
    }

    private List<RegionalApiDto> fetchFromApi() throws IOException {
        Request request = new Request.Builder()
                .url(apiUrl)
                .build();

        try (Response response = okHttpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.error("API call failed with code: {}", response.code());
                return null;
            }
            if (response.body() == null)
                return null;

            return objectMapper.readValue(response.body().string(), new TypeReference<List<RegionalApiDto>>() {
            });
        }
    }
}