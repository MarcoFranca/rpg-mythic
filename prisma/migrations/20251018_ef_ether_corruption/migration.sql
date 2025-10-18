-- EF explícito (se ainda não existir)
ALTER TABLE "Character"
    ADD COLUMN IF NOT EXISTS "spiritualBalance" JSONB
    DEFAULT '{"value":0,"trend":"STABLE"}';

-- Flag útil para recompute (se ainda não existir)
ALTER TABLE "Character"
    ADD COLUMN IF NOT EXISTS "needsRecompute" BOOLEAN DEFAULT TRUE;

-- ETHER: garantir chaves Eldoryon sem perder o que já existe
UPDATE "Character"
SET "ether" = COALESCE("ether", '{}'::jsonb)
    || '{"alignment":"HARMONICO","flux":0,"overload":0}'::jsonb
WHERE true;

-- CORRUPTION: garantir chaves Eldoryon sem perder o que já existe
UPDATE "Character"
SET "corruption" = COALESCE("corruption", '{}'::jsonb)
    || '{"level":0,"source":null,"manifestations":[],"thresholds":{"minor":2,"major":4,"critical":6}}'::jsonb
WHERE true;

-- Opcional: inicializar current/max se quiser defaults
UPDATE "Character"
SET "ether" = jsonb_set(
        jsonb_set(COALESCE("ether",'{}'::jsonb), '{current}', to_jsonb(0), true),
        '{max}', to_jsonb(6), true
              );

UPDATE "Character"
SET "corruption" = jsonb_set(
        jsonb_set(COALESCE("corruption",'{}'::jsonb), '{current}', to_jsonb(0), true),
        '{max}', to_jsonb(6), true
                   );

-- Marcar para recompute o snapshot na próxima operação do serviço
UPDATE "Character" SET "needsRecompute" = TRUE;
