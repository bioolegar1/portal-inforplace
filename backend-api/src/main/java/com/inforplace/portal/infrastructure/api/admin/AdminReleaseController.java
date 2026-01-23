package com.inforplace.portal.infrastructure.api.admin;

import com.inforplace.portal.application.dtos.request.CreateReleaseNoteRequest;
import com.inforplace.portal.application.dtos.request.UpdateReleaseNoteRequest;
import com.inforplace.portal.application.dtos.response.ReleaseNoteResponse;
import com.inforplace.portal.application.services.ReleaseNoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/releases")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Admin Releases", description = "Gerenciamento de releases (requer autenticação)")
public class AdminReleaseController {

    private final ReleaseNoteService releaseNoteService;

    @GetMapping
    @Operation(summary = "Listar todas as releases", description = "Retorna todas as releases, incluindo rascunhos")
    public ResponseEntity<Page<ReleaseNoteResponse>> listAllReleases(
            @RequestParam(required = false) Boolean published,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ReleaseNoteResponse> releases = releaseNoteService.findAll(published, pageable);
        return ResponseEntity.ok(releases);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar release por ID", description = "Retorna os detalhes completos de uma release")
    public ResponseEntity<ReleaseNoteResponse> getReleaseById(@PathVariable Long id) {
        ReleaseNoteResponse release = releaseNoteService.findById(id);
        return ResponseEntity.ok(release);
    }

    @PostMapping
    @Operation(summary = "Criar nova release", description = "Cria uma nova release (rascunho ou publicada)")
    public ResponseEntity<ReleaseNoteResponse> createRelease(
            @Valid @RequestBody CreateReleaseNoteRequest request
    ) {
        ReleaseNoteResponse response = releaseNoteService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar release", description = "Atualiza uma release existente")
    public ResponseEntity<ReleaseNoteResponse> updateRelease(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReleaseNoteRequest request
    ) {
        ReleaseNoteResponse response = releaseNoteService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publicar release", description = "Publica uma release que estava em rascunho")
    public ResponseEntity<ReleaseNoteResponse> publishRelease(@PathVariable Long id) {
        ReleaseNoteResponse response = releaseNoteService.publish(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/unpublish")
    @Operation(summary = "Despublicar release", description = "Remove uma release da visualização pública")
    public ResponseEntity<ReleaseNoteResponse> unpublishRelease(@PathVariable Long id) {
        ReleaseNoteResponse response = releaseNoteService.unpublish(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir release", description = "Exclui permanentemente uma release")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRelease(@PathVariable Long id) {
        releaseNoteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}