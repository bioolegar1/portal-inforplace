package com.inforplace.portal.application.services;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageUseCase {
    String storeFile(MultipartFile file);
}
