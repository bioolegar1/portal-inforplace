-- 1. LIMPEZA (Garante que começamos do zero absoluto)
DROP TABLE IF EXISTS portal_posts;
DROP TABLE IF EXISTS users;
-- Lógica: Removemos o tipo se ele já existir para evitar conflito na recriação.
DROP TYPE IF EXISTS post_type;

-- 2. CRIAÇÃO DO TIPO (O "Molde")
-- Lógica: Este comando DEVE vir antes de qualquer tabela que use esse tipo.
CREATE TYPE post_type AS ENUM ('RELEASE_NOTE', 'TUTORIAL', 'TIP', 'NEWS');

-- 3. FUNÇÃO DE TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. TABELA DE USUÁRIOS
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL DEFAULT 'EDITOR',
                       is_active BOOLEAN DEFAULT TRUE,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       last_login TIMESTAMP
);

-- 5. TABELA DE POSTAGENS (Agora o 'post_type' será resolvido com sucesso)
CREATE TABLE portal_posts (
                              id BIGSERIAL PRIMARY KEY,
                              version VARCHAR(50),
                              title VARCHAR(200) NOT NULL,
                              slug VARCHAR(200) UNIQUE NOT NULL,
                              post_type post_type NOT NULL DEFAULT 'RELEASE_NOTE', -- Aqui o banco já conhece o tipo
                              category VARCHAR(100),
                              summary TEXT,
                              cover_image TEXT,
                              content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
                              is_published BOOLEAN DEFAULT FALSE,
                              published_at TIMESTAMP,
                              created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
                              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              view_count INTEGER DEFAULT 0,
                              product_system VARCHAR(50) NOT NULL DEFAULT 'PILLAR'
);

-- 6. ÍNDICES E TRIGGERS
CREATE INDEX idx_portal_posts_slug ON portal_posts(slug);
CREATE INDEX idx_portal_posts_type ON portal_posts(post_type);
CREATE INDEX idx_portal_posts_system ON portal_posts(product_system);

CREATE TRIGGER trg_update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_update_posts_updated_at BEFORE UPDATE ON portal_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();