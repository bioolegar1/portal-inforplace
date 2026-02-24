package com.inforplace.portal.infrastructure.api.pub;
import com.inforplace.portal.application.dtos.request.ContactRequest;

import com.inforplace.portal.application.services.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/apiemail")
@CrossOrigin(origins = "*")
public class EmailController {
    // Lógica: Injeção do serviço pelo construtor (Boa prática do Spring)
    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/enviar")
    public ResponseEntity<Void> enviar(@RequestBody @Valid ContactRequest request) {
        emailService.dispararEmail(request);
        return ResponseEntity.accepted().build();
    }
}