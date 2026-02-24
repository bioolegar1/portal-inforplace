package com.inforplace.portal.infrastructure.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    // Mapa que guarda um "balde" de tokens para cada endereço IP
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // Regra: 3 e-mails a cada 5 minutos por IP (evita spam e DDoS)
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(3, Refill.intervally(3, Duration.ofMinutes(5)));
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String ipCliente = request.getRemoteAddr();
        Bucket bucket = buckets.computeIfAbsent(ipCliente, k -> createNewBucket());

        if (bucket.tryConsume(1)) {
            // Se houver "tokens" no balde, a requisição segue normalmente
            chain.doFilter(request, response);
        } else {
            // Se o balde estiver vazio, retorna erro 429 (Too Many Requests)
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(429);
            httpResponse.getWriter().write("Limite de tentativas excedido. Tente novamente em 5 minutos.");
        }
    }
}