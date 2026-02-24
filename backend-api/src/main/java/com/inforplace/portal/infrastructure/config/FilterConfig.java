package com.inforplace.portal.infrastructure.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    private final RateLimitFilter rateLimitFilter;

    public FilterConfig(RateLimitFilter rateLimitFilter) {
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    public FilterRegistrationBean<RateLimitFilter> loggingFilter() {
        FilterRegistrationBean<RateLimitFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(rateLimitFilter);

        // Lógica: Aplicar o filtro apenas nos endpoints de e-mail
        // Isso evita que o Rate Limit bloqueie outras partes da sua API
        registrationBean.addUrlPatterns("/v1/apiemail/*");

        // Define a ordem de execução (1 é prioridade máxima)
        registrationBean.setOrder(1);

        return registrationBean;
    }
}