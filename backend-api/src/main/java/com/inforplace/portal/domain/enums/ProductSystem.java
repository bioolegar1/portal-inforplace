package com.inforplace.portal.domain.enums;


import lombok.Getter;

@Getter
public enum ProductSystem {

    COLETORXML("Coletor XML"),
    NOTAINFO("Emissor NF-e"),
    SAO("Plano Imobiliário"),
    PILLAR("Pillar"),
    PILLAR_MOBILE("Pillar Mobile"),
    PVINFO("PDV- Ponto de Venda"),
    SAFE("Gestão administrativa");

    private final String description;

    ProductSystem(String description) {
        this.description = description;
    }
}
