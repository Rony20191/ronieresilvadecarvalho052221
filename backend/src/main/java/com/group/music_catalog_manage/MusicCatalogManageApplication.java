package com.group.music_catalog_manage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class MusicCatalogManageApplication {

	public static void main(String[] args) {
		SpringApplication.run(MusicCatalogManageApplication.class, args);
	}

}
