# Relatório de Deploy — MedCore System

## Visão Geral

Deploy realizado em dois serviços:

- **Backend (Node/Express)** → Railway
- **Frontend (React/Vite)** → Vercel
- **Banco de dados (PostgreSQL)** → Railway

---

## 1. Deploy do Banco de Dados (Railway)

✅ **Sucesso sem problemas**

- Criado serviço PostgreSQL diretamente no Railway
- Tabelas criadas via painel Query do Railway
- Railway gerou automaticamente as variáveis `DATABASE_URL`, `PGHOST`, `PGPORT`, etc.

---

## 2. Deploy do Backend (Railway)

### Problema 1 — Build falhou: Railpack não encontrou o app

**Causa:** O repositório é um monorepo com `medcore-system-back/` e `medcore-system-front/` na raiz. O Railway tentou buildar a raiz e não encontrou nenhum projeto reconhecível.

**Tentativas:**
- Configurar Watch Paths → não resolveu (Watch Paths controla gatilho de deploy, não o diretório)
- Configurar Root Directory via painel → Railway não salvou a configuração corretamente
- Criar `railway.json` dentro do `medcore-system-back/` → Railway ainda lia a raiz

**Solução:** Criar `railway.json` na **raiz do repositório** apontando para o subdiretório:

```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": { "startCommand": "node medcore-system-back/src/index.js" }
}
```

---

### Problema 2 — Nixpacks falhou: `nodejs_22` não encontrado

**Causa:** Nome do pacote incorreto no `nixpacks.toml`.

**Solução:** Trocar `nodejs_22` por `nodejs_20`:

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]
```

---

### Problema 3 — Conexão com banco falhou: `ERR_SOCKET_BAD_PORT`

**Causa:** A variável `DB_PORT` estava chegando como `NaN` pois o Railway usa `DATABASE_URL` em vez de variáveis separadas.

**Solução:** Atualizar o `db.js` para usar `DATABASE_URL` quando disponível:

```js
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : { host: process.env.DB_HOST, port: process.env.DB_PORT, ... }
)
```

---

### Problema 4 — Domínio não provisionado

**Causa:** O Railway não gerou domínio público automaticamente após o build.

**Solução:** Gerar manualmente em **Settings → Networking → Generate Domain**.

**URL final:** `https://medcore-system-production.up.railway.app`

---

### Problema 5 — CORS bloqueando requisições do frontend

**Causa:** O header `Access-Control-Allow-Origin` não estava sendo enviado corretamente nas respostas.

**Tentativas:**
- `app.use(cors())` simples → não funcionou em produção
- `cors({ origin: '*' })` → não funcionou pois o Railway não estava redeployando o código novo
- Header manual com `res.header(...)` + `CORS_ORIGIN` via variável de ambiente → parcialmente funcionou mas bloqueava URLs dinâmicas da Vercel

**Solução final:** Definir `CORS_ORIGIN=*` nas variáveis de ambiente do Railway:

```js
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}))
```

---

## 3. Deploy do Frontend (Vercel)

### Problema 1 — URL da API apontando para localhost

**Causa:** O `axios.ts` tinha `baseURL` fixo em `http://localhost:3000/api`.

**Solução:** Usar variável de ambiente:

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})
```

E configurar `VITE_API_URL` nas variáveis da Vercel.

---

### Problema 2 — URL errada na variável de ambiente

**Causa:** O Railway gerou um novo domínio após reconfiguração e a `VITE_API_URL` na Vercel ainda apontava para a URL antiga.

**Solução:** Atualizar `VITE_API_URL` na Vercel para a URL correta e fazer redeploy.

**URL final:** `https://medcore-system-production.up.railway.app/api`

---

### Problema 3 — Usuário não existia no banco de produção

**Causa:** O banco do Railway é independente do banco local. O usuário criado localmente não existe em produção.

**Solução:** Registrar novo usuário diretamente via DevTools do navegador com `fetch()` para a rota `/api/auth/register`.

---

## Resumo dos Serviços em Produção

| Serviço | URL |
|---|---|
| Frontend | https://medcore-system.vercel.app |
| Backend | https://medcore-system-production.up.railway.app |
| Banco | PostgreSQL no Railway (interno) |

---

## Lições Aprendidas

1. **Monorepos no Railway** exigem `railway.json` na raiz apontando para o subdiretório
2. **DATABASE_URL** é a forma correta de conectar ao PostgreSQL no Railway
3. **CORS em produção** precisa de configuração explícita de métodos e headers
4. **Variáveis de ambiente do Vite** precisam do prefixo `VITE_` para serem expostas no frontend
5. **Bancos de produção** são independentes do local — usuários precisam ser recriados
