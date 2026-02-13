-- Inserir usuário administrador padrão
-- Lógica: O password_hash abaixo corresponde a 'admin123' usando BCrypt, que é o padrão do seu SecurityConfig.
INSERT INTO users (name, email, password_hash, role)
VALUES (
           'Administrador Inforplace',
           'admin@inforplace.com.br',
           '$2a$10$N9qo8uLOickgx2ZMRZoMye7z9cN3M5lQqxJC9qgdXOGXnLlI4eEQu',
           'ADMIN'
       );