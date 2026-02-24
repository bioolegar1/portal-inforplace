package com.inforplace.portal.application.services;
import com.inforplace.portal.application.dtos.request.ContactRequest;
import com.inforplace.portal.infrastructure.config.EmailConfig;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailConfig properties;
    public EmailService(JavaMailSender mailSender, EmailConfig properties) {
        this.mailSender = mailSender;
        this.properties = properties;
    }

    public void dispararEmail(ContactRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();

        String alvo = properties.getDestinos().getOrDefault(request.assunto(), properties.getDestinos().get("outro"));

        message.setTo(alvo);
        message.setFrom("software@inforplace.com.br");
        message.setSubject("NOVO CONTATO: " + request.assunto().toUpperCase());

        // Lógica: Montamos um bloco de texto organizado com todos os dados do formulário
        String corpoFormatado = String.format(
                "Você recebeu uma nova mensagem pelo Portal Inforplace:\n\n" +
                        "------------------------------------------\n" +
                        "DADOS DO CLIENTE:\n" +
                        "Nome: %s\n" +
                        "E-mail de Contato: %s\n" +
                        "Telefone: %s\n" +
                        "Departamento: %s\n" +
                        "------------------------------------------\n\n" +
                        "MENSAGEM:\n%s",
                request.nome(),
                request.email(),
                request.telefone(),
                request.assunto(),
                request.mensagem()
        );

        message.setText(corpoFormatado);

        mailSender.send(message);
    }
}