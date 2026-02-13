package com.inforplace.portal.infrastructure.api.admin;

import com.inforplace.portal.application.dtos.request.CreatePostRequest;
import com.inforplace.portal.application.dtos.request.UpdatePostRequest;
import com.inforplace.portal.application.dtos.response.DashboardStatsResponse;
import com.inforplace.portal.application.dtos.response.PostResponse;
import com.inforplace.portal.application.services.PostService;
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
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Admin Posts", description = "Gerenciamento de conteúdos (Tutoriais, Releases, Notícias)")
public class PostAdminController {

    private final PostService postService;

    @GetMapping
    @Operation(summary = "Listar postagens", description = "Filtre por ?published=false para ver rascunhos ou ?published=true para publicados")
    public ResponseEntity<Page<PostResponse>> listAll(
            @RequestParam(required = false) Boolean published,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        // Se published for false, retorna rascunhos. Se for true, publicados. Se null, todos.
        Page<PostResponse> posts = postService.findAll(published, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        // Lógica: Quando o Angular pedir /stats, chamamos o serviço e devolvemos 200 OK
        return ResponseEntity.ok(postService.getDashboardStats());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar postagem por ID")
    public ResponseEntity<PostResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Criar nova postagem")
    public ResponseEntity<PostResponse> create(@Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar postagem")
    public ResponseEntity<PostResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request
    ) {
        return ResponseEntity.ok(postService.update(id, request));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publicar postagem")
    public ResponseEntity<PostResponse> publish(@PathVariable Long id) {
        return ResponseEntity.ok(postService.publish(id));
    }

    @PatchMapping("/{id}/unpublish")
    @Operation(summary = "Despublicar postagem")
    public ResponseEntity<PostResponse> unpublish(@PathVariable Long id) {
        return ResponseEntity.ok(postService.unpublish(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir postagem")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}