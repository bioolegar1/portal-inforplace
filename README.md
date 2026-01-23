# 🚀 Portal Inforplace API

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Backend robusto desenvolvido para o ecossistema **Inforplace**, focado em **Autenticação Segura (JWT)** e **Gestão Dinâmica de Releases** (Release Notes). O projeto utiliza conceitos avançados como Polimorfismo no Jackson para renderização de blocos de conteúdo dinâmicos.

---

## 📋 Tabela de Conteúdos
- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Endpoints da API](#-endpoints-da-api)
- [Blocos de Conteúdo (Polimorfismo)](#-blocos-de-conteúdo-polimorfismo)
- [Como Executar](#-como-executar)

---

## 🔭 Visão Geral

Este projeto serve como a espinha dorsal para o portal administrativo e público da Inforplace. Ele resolve dois problemas principais:
1.  **Segurança Centralizada:** Controle de acesso via Tokens JWT Stateless.
2.  **Comunicação de Updates:** Um CMS headless para criar "Release Notes" ricas visualmente, onde cada parágrafo, imagem ou alerta é um bloco independente.

---

## 🛠 Tecnologias

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Linguagem** | **Java 21** | Utilizando Records, Pattern Matching e Virtual Threads (futuro). |
| **Framework** | **Spring Boot 3** | Web, Security, Validation, JPA. |
| **Database** | **PostgreSQL** | Banco de dados relacional robusto. |
| **Migração** | **Flyway** | Versionamento de schema de banco de dados. |
| **Segurança** | **Spring Security** | Autenticação JWT e proteção CSRF/CORS. |
| **JSON** | **Jackson** | Serialização com `@JsonTypeInfo` para polimorfismo. |
| **DevOps** | **Docker** | Containerização da aplicação e banco. |

---

## ✨ Funcionalidades

### 🔐 Segurança & Autenticação
* Login via **JWT (JSON Web Token)**.
* Senhas criptografadas com **BCrypt**.
* Proteção de rotas baseada em Roles (`ADMIN`, `USER`).
* Validação rigorosa de DTOs (Input Validation).

### 📢 Gestão de Releases (CMS Headless)
* Criação de notas de atualização com **slugs amigáveis** para SEO.
* **Contagem de Views separada:** Endpoint dedicado (`POST /view`) para evitar contagem por bots ou cache.
* **Arquitetura Polimórfica:** O Frontend recebe uma lista genérica de blocos e renderiza componentes específicos (React/Vue/Angular) baseados no `type`.

---

## 🔌 Endpoints da API

### 🛡️ Autenticação (`/api/auth`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/register` | Cria um novo usuário (Requer: nome, email, senha, role). |
| `POST` | `/login` | Autentica e retorna o **Bearer Token**. |

### 🌍 Área Pública (`/api/public`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/releases` | Lista releases publicadas com paginação. <br> Params: `?page=0&size=10&sort=publishedAt,desc` |
| `GET` | `/releases/{slug}` | Retorna o JSON completo de uma release específica. |
| `POST` | `/releases/{slug}/view` | Incrementa o contador de visualizações (Idempotente). |

### ⚙️ Área Administrativa (`/api/admin`)
> 🔒 **Requer:** Header `Authorization: Bearer <TOKEN>` e Role `ADMIN`.

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/releases` | Cria uma nova release com blocos de conteúdo dinâmicos. |

---

## 🧱 Blocos de Conteúdo (Polimorfismo)

O sistema de releases utiliza o padrão **Strategy/Polymorphism** no JSON. Ao criar ou ler uma release, a lista `contentBlocks` contém objetos que variam conforme o campo `type`.

**Tipos suportados (Java 21 Enum):**

1.  🟢 **`HEADER`**: Títulos e subtítulos (`h1`, `h2`...).
2.  📝 **`TEXT`**: Parágrafos de texto (suporta HTML safe).
3.  🖼️ **`IMAGE`**: Imagens com URL, legenda e texto alternativo.
4.  ⚖️ **`COMPARISON`**: Blocos "Antes e Depois" (ex: Diff de código).
5.  ✅ **`CHECKLIST`**: Listas de tarefas ou funcionalidades entregues.
6.  💡 **`MODULE_HIGHLIGHT`**: Destaque visual para módulos do sistema.
7.  ⚠️ **`ALERT`**: Caixas de aviso (`INFO`, `WARNING`, `ERROR`, `SUCCESS`).
8.  ⏳ **`TIMELINE`**: Linha do tempo para changelogs sequenciais.

---

## 🚀 Como Executar

### Pré-requisitos
* Java JDK 21
* Docker & Docker Compose (Opcional, mas recomendado)

### 1. Configure o Banco de Dados
Edite o arquivo `src/main/resources/application.properties` ou defina as variáveis de ambiente:

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/inforplace_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
API_SECURITY_TOKEN_SECRET=sua_chave_secreta_super_segura_base64

## 🚀 Como Executar

### Pré-requisitos
* Java JDK 21
* Docker (Opcional)

### 1. Execute a Aplicação

Utilize o wrapper do Maven incluído no projeto:

```bash
# Linux/Mac
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run

API estará disponível em: http://localhost:8080

## 🤝 Contribuição

Quer ajudar a melhorar o portal? Siga os passos:

1. Faça um **Fork** do projeto.
2. Crie uma nova branch: `git checkout -b feature/minha-feature`.
3. Commit suas mudanças: `git commit -m 'feat: Adiciona nova funcionalidade'`.
4. Push para a branch: `git push origin feature/minha-feature`.
5. Abra um **Pull Request**.

---

<p align="center">
  Desenvolvido com 💙 pela equipe <strong>Inforplace</strong>
</p>


