package com.inforplace.portal.infrastructure.api.pub;


import com.inforplace.portal.application.dtos.response.ReleaseNoteListResponse;
import com.inforplace.portal.application.dtos.response.ReleaseNoteResponse;
import com.inforplace.portal.application.services.ReleaseNoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/releases")
@RequiredArgsConstructor
@Tag(name = "Public Releases", description = "Endpoints públicos para visualização de releases")
public class PublicReleaseController {

    private final ReleaseNoteService releaseNoteService;

    @GetMapping
    @Operation(summary = "Listar releases publicadas", description = "Retorna uma lista paginada de releases publicadas")
    public ResponseEntity<Page<ReleaseNoteListResponse>> listPublishedReleases(
            @PageableDefault(size = 10, sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ReleaseNoteListResponse> releases = releaseNoteService.findAllPublished(pageable);
        return ResponseEntity.ok(releases);
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Buscar release por slug", description = "Retorna os detalhes completos de uma release publicada")
    public ResponseEntity<ReleaseNoteResponse> getReleaseBySlug(@PathVariable String slug) {
        ReleaseNoteResponse release = releaseNoteService.findBySlug(slug);
        return ResponseEntity.ok(release);
    }

    @PostMapping("/{slug}/view")
    @Operation(summary = "Registrar visualização", description = "Incrementa o contador de visualizações de uma release")
    public ResponseEntity<Void> incrementViewCount(@PathVariable String slug) {
        releaseNoteService.incrementViewCount(slug);
        return ResponseEntity.noContent().build();
    }
}