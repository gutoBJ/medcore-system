-- Use este arquivo apenas no DATABASE errado onde voce executou a migration sem querer.
--
-- No pgAdmin:
-- 1. Conecte no database errado.
-- 2. Confira com: SELECT current_database(), current_schema();
-- 3. Se o database retornado for o errado e o schema for public, execute este arquivo.
--
-- Este rollback remove somente as alteracoes criadas pela migration de regras
-- de negocio. Ele nao apaga as tabelas principais do sistema.

DO $$
DECLARE
  v_schema text := 'public';
  v_database_atual text;
  v_qtd integer;
BEGIN
  SELECT current_database() INTO v_database_atual;

  RAISE NOTICE 'Executando rollback no database %, schema %', v_database_atual, v_schema;

  IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = v_schema) THEN
    RAISE EXCEPTION 'Schema % nao existe no database %.', v_schema, v_database_atual;
  END IF;

  IF to_regclass(format('%I.profissional_especialidades', v_schema)) IS NOT NULL THEN
    EXECUTE format('SELECT count(*) FROM %I.profissional_especialidades', v_schema) INTO v_qtd;

    IF v_qtd > 0 THEN
      RAISE EXCEPTION 'A tabela %.profissional_especialidades tem % registros. Revise esses dados antes de apagar.', v_schema, v_qtd;
    END IF;

    EXECUTE format('DROP TABLE %I.profissional_especialidades', v_schema);
    RAISE NOTICE 'Tabela %.profissional_especialidades removida.', v_schema;
  END IF;

  IF to_regclass(format('%I.atendimentos', v_schema)) IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I.atendimentos DROP CONSTRAINT IF EXISTS atendimentos_horario_check', v_schema);
    EXECUTE format('ALTER TABLE %I.atendimentos DROP CONSTRAINT IF EXISTS atendimentos_cancelamento_check', v_schema);
    EXECUTE format('ALTER TABLE %I.atendimentos DROP COLUMN IF EXISTS data_hora_fim', v_schema);
    EXECUTE format('ALTER TABLE %I.atendimentos DROP COLUMN IF EXISTS motivo_cancelamento', v_schema);
    RAISE NOTICE 'Alteracoes de atendimentos removidas.';
  END IF;

  IF to_regclass(format('%I.usuarios', v_schema)) IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I.usuarios DROP CONSTRAINT IF EXISTS usuarios_perfil_check', v_schema);
    EXECUTE format('ALTER TABLE %I.usuarios DROP COLUMN IF EXISTS profissional_id', v_schema);
    EXECUTE format('ALTER TABLE %I.usuarios DROP COLUMN IF EXISTS perfil', v_schema);
    RAISE NOTICE 'Alteracoes de usuarios removidas.';
  END IF;

  RAISE NOTICE 'Rollback finalizado no database %, schema %.', v_database_atual, v_schema;
END $$;
