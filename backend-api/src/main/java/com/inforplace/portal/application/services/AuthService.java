package com.inforplace.portal.application.services;

import com.inforplace.portal.domain.enums.UserRole;
import com.inforplace.portal.application.dtos.request.LoginRequest;
import com.inforplace.portal.application.dtos.request.RegisterRequest;
import com.inforplace.portal.application.dtos.response.LoginResponse;
import com.inforplace.portal.application.dtos.response.UserResponse;
import com.inforplace.portal.infrastructure.persistence.entities.UserEntity;
import com.inforplace.portal.infrastructure.persistence.repositories.JpaUserRepository;
import com.inforplace.portal.infrastructure.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final JpaUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public void register(RegisterRequest request){
        //verifica se existe
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email ja cadastrado!");
        }
        //role(tipo de user)
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "USER";

        UserEntity newUser = UserEntity.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword())) // -> CERTO (se o campo for passwordHash)
                .role(UserRole.valueOf(role))
                .isActive(true)
                .build();

        userRepository.save(newUser);
    }


    @Transactional
    public LoginResponse login(LoginRequest request){
        log.info("Tentativa de login parao email: {}", request.getEmail());

        //Autenticar
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        //Gerar token
        String token = tokenProvider.generateToken(authentication);

        //Atualizar last_login
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("Login realizado com sucesso para o email: {}", request.getEmail());

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .user(UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();
    }
}
