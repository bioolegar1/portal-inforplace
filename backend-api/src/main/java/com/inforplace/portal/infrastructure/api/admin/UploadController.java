package com.inforplace.portal.infrastructure.api.admin;


import com.inforplace.portal.application.services.FileStorageUseCase;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
@SecurityRequirement(name ="bearerAuth")
public class UploadController {

    private final FileStorageUseCase fileStorageUseCase;

    public UploadController(FileStorageUseCase fileStorageUseCase) {
        this.fileStorageUseCase = fileStorageUseCase;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageUseCase.storeFile(file);
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
