-- Criação da tabela release_notes
CREATE TABLE release_notes (
                                id SERIAL PRIMARY KEY,
                                version VARCHAR(50) NOT NULL,
                                title VARCHAR(200) NOT NULL,
                                slug VARCHAR(200) UNIQUE NOT NULL,
                                summary TEXT,
                                cover_image TEXT,

    -- JSONB para blocos de conteúdo
                                content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Publicação
                                is_published BOOLEAN DEFAULT FALSE,
                                published_at TIMESTAMP,

    -- Auditoria
                                created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
                                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Métricas
                                view_count INTEGER DEFAULT 0
);

-- Índices para performance
CREATE INDEX idx_release_notes_slug ON release_notes(slug);
CREATE INDEX idx_release_notes_published ON release_notes(is_published, published_at DESC);
CREATE INDEX idx_release_notes_created_by ON release_notes(created_by);
CREATE INDEX idx_release_notes_version ON release_notes(version);

-- Índice GIN para busca em JSONB
CREATE INDEX idx_release_notes_blocks ON release_notes USING gin (content_blocks);

-- Trigger para updated_at
CREATE TRIGGER update_release_notes_updated_at
    BEFORE UPDATE ON release_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();