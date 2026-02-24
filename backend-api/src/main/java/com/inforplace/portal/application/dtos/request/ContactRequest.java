package com.inforplace.portal.application.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactRequest(
   @NotBlank String nome,
   @NotBlank @Email String email,
   @NotBlank String telefone,
   @NotBlank String assunto,
   @NotBlank String mensagem
) {}
