# MedCore System

Sistema Integrado de Gestão Hospitalar desenvolvido como trabalho avaliativo da disciplina de Tecnologias para Internet (Full Stack).

Inspirado em sistemas HIS reais como o Tasy (Philips), o MedCore System oferece gerenciamento de Pacientes, Profissionais, Especialidades e Atendimentos através de uma API RESTful integrada a uma interface web responsiva.

---

## Deploys do projeto:

- **Backend**: https://medcore-system-production.up.railway.app
- **Frontend**: https://medcore-system.vercel.app

## Tecnologias utilizadas

**Backend**
- Node.js + Express
- PostgreSQL
- JWT (jsonwebtoken) + bcrypt
- dotenv, cors

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast
- Tabler Icons React

---

## Estrutura do repositório

```
medcore-system/
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── controllers/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── middlewares/
│   │   │   └── db.js
│   │   ├── index.js
│   │   └── routes.js
│   ├── .env.example
│   └── README.md
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   └── pages/
    └── README.md
```

---

## Como rodar o projeto

### Pré-requisitos
- Node.js 18+
- PostgreSQL instalado e rodando

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/medcore-system.git
cd medcore-system
```

### 2. Configurar e rodar o backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=medcore
JWT_SECRET=sua_chave_secreta
```

Execute o SQL de criação das tabelas (disponível em `backend/src/database.sql`), então:

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

### 3. Configurar e rodar o frontend

```bash
cd ../frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

---

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão: 3000) |
| `DB_HOST` | Host do PostgreSQL |
| `DB_PORT` | Porta do PostgreSQL (padrão: 5432) |
| `DB_USER` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `DB_NAME` | Nome do banco de dados |
| `JWT_SECRET` | Chave secreta para geração dos tokens JWT |

---

## Documentação da API

Base URL: `http://localhost:3000/api`

> Rotas protegidas exigem o header: `Authorization: Bearer <token>`
> Obtenha o token via `POST /auth/login`

---

### Autenticação

#### Registrar usuário
```
POST /auth/register
```
Body:
```json
{
  "nome": "Admin",
  "email": "admin@medcore.com",
  "senha": "123456"
}
```
Resposta `201`:
```json
{
  "id": 1,
  "nome": "Admin",
  "email": "admin@medcore.com"
}
```

#### Login
```
POST /auth/login
```
Body:
```json
{
  "email": "admin@medcore.com",
  "senha": "123456"
}
```
Resposta `200`:
```json
{
  "token": "eyJhbGci...",
  "usuario": {
    "id": 1,
    "nome": "Admin",
    "email": "admin@medcore.com"
  }
}
```

---

### Especialidades 🔒

| Método | Rota | Ação |
|---|---|---|
| GET | `/api/especialidades` | Listar todas |
| GET | `/api/especialidades/:id` | Buscar por ID |
| POST | `/api/especialidades` | Cadastrar |
| PUT | `/api/especialidades/:id` | Editar |
| DELETE | `/api/especialidades/:id` | Excluir |

**Exemplo — Cadastrar:**
```
POST /api/especialidades
```
Body:
```json
{
  "nome": "Cardiologia",
  "descricao": "Especialidade do coração",
  "area": "Clínica Geral"
}
```
Resposta `201`:
```json
{
  "id": 1,
  "nome": "Cardiologia",
  "descricao": "Especialidade do coração",
  "area": "Clínica Geral"
}
```

---

### Pacientes 🔒

| Método | Rota | Ação |
|---|---|---|
| GET | `/api/pacientes` | Listar todos |
| GET | `/api/pacientes/:id` | Buscar por ID |
| POST | `/api/pacientes` | Cadastrar |
| PUT | `/api/pacientes/:id` | Editar |
| DELETE | `/api/pacientes/:id` | Excluir |

**Exemplo — Cadastrar:**
```
POST /api/pacientes
```
Body:
```json
{
  "nome_completo": "João Silva",
  "cpf": "123.456.789-00",
  "data_nascimento": "1990-05-15",
  "sexo": "M",
  "telefone": "(11) 99999-0000",
  "email": "joao@email.com",
  "endereco": "Rua das Flores, 123",
  "convenio": "Unimed",
  "numero_carteirinha": "1234567"
}
```
Resposta `201`: objeto do paciente criado com `id`.

---

### Profissionais 🔒

| Método | Rota | Ação |
|---|---|---|
| GET | `/api/profissionais` | Listar todos |
| GET | `/api/profissionais/:id` | Buscar por ID |
| POST | `/api/profissionais` | Cadastrar |
| PUT | `/api/profissionais/:id` | Editar |
| DELETE | `/api/profissionais/:id` | Excluir |

**Exemplo — Cadastrar:**
```
POST /api/profissionais
```
Body:
```json
{
  "nome": "Dra. Ana Paula",
  "registro": "CRM-12345",
  "especialidade_id": 1,
  "cargo": "Médica",
  "turno": "Manhã",
  "telefone": "(11) 98888-0000",
  "email": "ana@medcore.com",
  "ativo": true
}
```
Resposta `201`: objeto do profissional criado com `id`.

---

### Atendimentos 🔒

| Método | Rota | Ação |
|---|---|---|
| GET | `/api/atendimentos` | Listar todos (com JOIN) |
| GET | `/api/atendimentos/filtrar?data=YYYY-MM-DD` | Filtrar por data |
| GET | `/api/atendimentos/:id` | Buscar por ID |
| POST | `/api/atendimentos` | Cadastrar |
| PUT | `/api/atendimentos/:id` | Editar |
| DELETE | `/api/atendimentos/:id` | Excluir |

**Exemplo — Filtrar por data:**
```
GET /api/atendimentos/filtrar?data=2024-06-15
```
Resposta `200`: lista de atendimentos do dia com `paciente_nome` e `profissional_nome`.

**Exemplo — Cadastrar:**
```
POST /api/atendimentos
```
Body:
```json
{
  "paciente_id": 1,
  "profissional_id": 1,
  "data_hora": "2024-06-15T10:30:00",
  "tipo": "Consulta",
  "status": "Agendado",
  "diagnostico": "Hipertensão leve",
  "observacoes": "Retorno em 30 dias",
  "valor": 250.00
}
```
Resposta `201`: objeto do atendimento criado com `id`.

---

### Códigos de status HTTP

| Código | Significado |
|---|---|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Dados inválidos ou faltando |
| `401` | Não autenticado |
| `403` | Token inválido ou expirado |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

---

## Funcionalidades implementadas

### Obrigatórias ✅
- CRUD completo das 4 entidades
- Filtro de atendimentos por data
- Validação de dados no backend e frontend
- Retorno em JSON com status HTTP corretos
- CORS habilitado
- Interface responsiva (desktop e mobile)
- Listagem, cadastro, edição e exclusão em todas as telas
- Feedback visual com toasts de sucesso e erro
- Spinner de carregamento
- Dashboard com cards de totais

### Diferenciais / Bônus ✅
- Autenticação com JWT (login, register, rotas protegidas)
- Relacionamentos com JOIN (atendimento retorna nome do paciente e profissional)
- Busca por nome/CPF em Pacientes
- Filtro por status em Atendimentos
- Título dinâmico por página
- Menu hambúrguer responsivo no mobile
