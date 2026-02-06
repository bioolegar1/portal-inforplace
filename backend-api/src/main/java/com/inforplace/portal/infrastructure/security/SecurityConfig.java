package com.inforplace.portal.infrastructure.security;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer; // IMPORTANTE
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService; // IMPORTANTE: Deve ser este
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Autenticação (Login/Registro)
                        .requestMatchers("/api/auth/**").permitAll()

                        // 2. Recursos Estáticos do Sistema (Favicon, etc)
                        .requestMatchers("/error", "/favicon.ico", "/").permitAll()

                        // 3. IMAGENS DO UPLOAD (IMPORTANTE: LEITURA PÚBLICA)
                        // Isso permite que qualquer pessoa VEJA a imagem (acesso via browser)
                        // Mapeia para a pasta física configurada no WebConfig
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                        // 4. API DE UPLOAD (OPCIONAL - JÁ PROTEGIDO PELO CONTROLLER)
                        // Como usamos @PreAuthorize no controller, não é estritamente necessário declarar aqui,
                        // mas se quiser segurança dupla, pode descomentar a linha abaixo:
                        // .requestMatchers(HttpMethod.POST, "/api/uploads").hasAnyRole("ADMIN", "EDITOR")

                        // 5. Endpoints Públicos de Releases (Blog)
                        .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/public/releases/*/view").permitAll()

                        // 6. Monitoramento
                        .requestMatchers("/api/hello", "/api/status").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        // 7. Swagger / Docs
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html", "/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()

                        // 8. Área Admin (Geral)
                        .requestMatchers("/api/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_EDITOR", "ADMIN", "EDITOR")

                        // 9. Bloqueio Geral (Todo o resto exige login)
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
