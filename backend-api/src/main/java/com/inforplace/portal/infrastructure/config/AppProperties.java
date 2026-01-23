package com.inforplace.portal.infrastructure.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {
    private Jwt jwt = new Jwt();
    private Upload upload = new Upload();
    private Cors cors = new Cors();

    @Data
    public static class Jwt{
        private String secret;
        private Long expiration;
    }

    @Data
    public static class Upload{
        private String dir;
        private String UrlBase;
    }

    @Data
    public static class Cors{
        private String allowedOrigins;
    }
}
