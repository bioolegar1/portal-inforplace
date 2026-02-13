package com.inforplace.portal.infrastructure.config;


import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@Data
public class CorsConfig {

    private final AppProperties appProperties;

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();

        // Logica: Carrega as origens permitidas do seu application.yml/properties
        configuration.setAllowedOrigins(
                Arrays.asList(appProperties.getCors().getAllowedOrigins().split(","))
        );

        // Logica: Lista explicitamente os métodos para o CRUD de postagens.
        // O PATCH e o PUT sao essenciais para edicao
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Logica: Em vez de "*", listamos o que o seu Angular realmente envia.
        // O "Authorization" e obrigatorio por causa do seu jwtAuthenticationFilter
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        // Logica: Permite que o Angular leia cabeçalhos de resposta se necessário
        configuration.setExposedHeaders(Arrays.asList(
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "Authorization"
        ));

        // Logica: Permite o envio de cookies ou tokens no cabeçalho Authorization
        configuration.setAllowCredentials(true);

        // Logica: O navegador guarda essa permissao por 1 hora (evita requisicoes OPTIONS repetitivas)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}