package com.inforplace.portal.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration; // Importação necessária

import java.util.HashMap;
import java.util.Map;

@Configuration // Lógica: Diz ao Spring para instanciar esta classe como um Bean
@ConfigurationProperties(prefix = "app.mail") // Lógica: Faz o bind com o seu application.yml
public class EmailConfig {

    private Map<String, String> destinos = new HashMap<>();

    public Map<String, String> getDestinos() {
        return destinos;
    }

    public void setDestinos(Map<String, String> destinos) {
        this.destinos = destinos;
    }
}