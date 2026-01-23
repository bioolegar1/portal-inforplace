package com.inforplace.portal.infrastructure.api.auth;


import com.inforplace.portal.application.dtos.request.LoginRequest;
import com.inforplace.portal.application.dtos.request.RegisterRequest;
import com.inforplace.portal.application.dtos.response.LoginResponse;
import com.inforplace.portal.application.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints de autenticação")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário criado com sucesso!");
    }

    @GetMapping("/gerar-senha/{senha}")
    public ResponseEntity<String> gerarSenha(@PathVariable String senha) {
        // Isso usa o mesmo encoder que o login usa, eliminando erro de versão
        String hash = new BCryptPasswordEncoder().encode(senha);
        return ResponseEntity.ok(hash);
    }

    @PostMapping("/login")
    @Operation(summary = "Realizar login", description = "Autentica um usuário e retorna um token JWT")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
