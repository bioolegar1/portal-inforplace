package com.inforplace.portal.infrastructure.api.pub;

import com.inforplace.portal.application.dtos.response.PostListResponse;
import com.inforplace.portal.application.dtos.response.PostResponse;
import com.inforplace.portal.application.services.PostService;
import com.inforplace.portal.domain.enums.PostType;
import com.inforplace.portal.domain.enums.ProductSystem;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
// Lógica: Removido o "/api" para alinhar com o strip-prefix do Nginx
@RequestMapping("/public/posts")
@RequiredArgsConstructor
@Tag(name = "Public Content", description = "Endpoints públicos para visualização de tutoriais e releases")
public class PostPubController {

    private final PostService postService;

    @GetMapping
    @Operation(summary = "Listar conteúdos publicados",
            description = "Retorna uma lista paginada filtrada por tipo e sistema (Pillar, Safe, etc)")
    public ResponseEntity<Page<PostListResponse>> listPublished(
            @RequestParam(required = false) PostType type,
            @RequestParam(required = false) ProductSystem system,
            @RequestParam(required = false) String category,
            @PageableDefault(sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<PostListResponse> posts = postService.findAllPublished(type, system, category, pageable);
        return ResponseEntity.ok(posts);
    }

  @GetMapping("/{slug}")
  @Operation(summary = "Buscar conteúdo por slug", description = "Retorna os detalhes completos de um tutorial ou release")
  public ResponseEntity<PostResponse> getBySlug(
          @PathVariable String slug,
          HttpServletRequest request
  ){
        String userIp = request.getRemoteAddr();
        postService.incrementViewCount(slug, userIp);

        PostResponse post = postService.findBySlug(slug);
        return ResponseEntity.ok(post);
  }

    @PostMapping("/{slug}/view")
    @Operation(summary = "Registrar visualização", description = "Incrementa o contador de visualizações com trava por IP")
    public ResponseEntity<Void> incrementViewCount(@PathVariable String slug, HttpServletRequest request) {
        String userIp = request.getRemoteAddr();
        postService.incrementViewCount(slug, userIp);

        return ResponseEntity.noContent().build();
    }
}