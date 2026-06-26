DO $$
BEGIN
  IF to_regclass('usuarios') IS NULL THEN
    RAISE EXCEPTION 'Tabela usuarios nao encontrada. Execute esta migration no mesmo banco/schema usado pelo sistema.';
  END IF;

  IF to_regclass('profissionais') IS NULL THEN
    RAISE EXCEPTION 'Tabela profissionais nao encontrada. Confirme se voce esta no banco/schema correto ou crie as tabelas base antes desta migration.';
  END IF;

  IF to_regclass('especialidades') IS NULL THEN
    RAISE EXCEPTION 'Tabela especialidades nao encontrada. Confirme se voce esta no banco/schema correto ou crie as tabelas base antes desta migration.';
  END IF;

  IF to_regclass('atendimentos') IS NULL THEN
    RAISE EXCEPTION 'Tabela atendimentos nao encontrada. Confirme se voce esta no banco/schema correto ou crie as tabelas base antes desta migration.';
  END IF;
END $$;

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS perfil VARCHAR(20) NOT NULL DEFAULT 'ATENDENTE',
  ADD COLUMN IF NOT EXISTS profissional_id INTEGER REFERENCES profissionais(id);

ALTER TABLE usuarios
  DROP CONSTRAINT IF EXISTS usuarios_perfil_check,
  ADD CONSTRAINT usuarios_perfil_check CHECK (perfil IN ('ADMIN', 'DENTISTA', 'ATENDENTE'));

UPDATE usuarios
   SET perfil = 'ADMIN'
 WHERE id = (SELECT MIN(id) FROM usuarios)
   AND NOT EXISTS (SELECT 1 FROM usuarios WHERE perfil = 'ADMIN');

CREATE TABLE IF NOT EXISTS profissional_especialidades (
  profissional_id INTEGER NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
  especialidade_id INTEGER NOT NULL REFERENCES especialidades(id) ON DELETE CASCADE,
  PRIMARY KEY (profissional_id, especialidade_id)
);

INSERT INTO profissional_especialidades (profissional_id, especialidade_id)
SELECT id, especialidade_id
  FROM profissionais
 WHERE especialidade_id IS NOT NULL
ON CONFLICT DO NOTHING;

ALTER TABLE atendimentos
  ADD COLUMN IF NOT EXISTS data_hora_fim TIMESTAMP,
  ADD COLUMN IF NOT EXISTS motivo_cancelamento TEXT;

UPDATE atendimentos
   SET data_hora_fim = data_hora + INTERVAL '1 hour'
 WHERE data_hora_fim IS NULL;

UPDATE atendimentos
   SET motivo_cancelamento = 'Cancelamento registrado antes da regra de motivo obrigatorio'
 WHERE status = 'Cancelado'
   AND motivo_cancelamento IS NULL;

ALTER TABLE atendimentos
  ALTER COLUMN data_hora_fim SET NOT NULL,
  DROP CONSTRAINT IF EXISTS atendimentos_horario_check,
  ADD CONSTRAINT atendimentos_horario_check CHECK (data_hora_fim > data_hora),
  DROP CONSTRAINT IF EXISTS atendimentos_cancelamento_check,
  ADD CONSTRAINT atendimentos_cancelamento_check CHECK (status <> 'Cancelado' OR motivo_cancelamento IS NOT NULL);
