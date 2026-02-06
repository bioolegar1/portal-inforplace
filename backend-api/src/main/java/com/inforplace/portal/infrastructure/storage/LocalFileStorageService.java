package com.inforplace.portal.infrastructure.storage;

import com.inforplace.portal.application.services.FileStorageUseCase;
import org.springframework.beans.factory.annotation.Value; // <--- Esse é o do Springimport org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageUseCase {

    private final Path fileStorageLocation;
    private final String baseUrl;

    public LocalFileStorageService(
            @Value("${app.upload.dir}") String uploadDir,
            @Value("${app.upload.url-base}") String baseUrl
    ){
        this.baseUrl = baseUrl;

        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try{
            Files.createDirectories(this.fileStorageLocation);
        }catch (Exception ex){
            throw new RuntimeException("Não foi possível criar o diretório de upload.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        // CORREÇÃO 1: Validar nulo antes de processar
        String rawName = file.getOriginalFilename();
        if (rawName == null) {
            throw new RuntimeException("O nome do arquivo não pode ser nulo.");
        }

        // CORREÇÃO 2: Declarar fora do try para ser visível no catch
        String originalFileName = StringUtils.cleanPath(rawName);

        try {
            // Validação de segurança
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Nome de arquivo inválido: " + originalFileName);
            }

            // Extrair extensão
            String fileExtension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                fileExtension = originalFileName.substring(i);
            }

            // Gerar nome único
            String fileName = UUID.randomUUID() + fileExtension;

            // Definir caminho e salvar
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return baseUrl + "/" + fileName;

        } catch (IOException ex) { // CORREÇÃO 3: A variável 'ex' agora existe e é usada abaixo
            throw new RuntimeException("Falha ao armazenar arquivo " + originalFileName, ex);
        }
    }
}