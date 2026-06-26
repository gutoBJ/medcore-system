CREATE TABLE especialidades (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  area VARCHAR(100)
);

CREATE TABLE profissionais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  registro VARCHAR(50) NOT NULL,
  cargo VARCHAR(100),
  turno VARCHAR(50),
  telefone VARCHAR(20),
  email VARCHAR(150),
  ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE profissional_especialidades (
  profissional_id INTEGER NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
  especialidade_id INTEGER NOT NULL REFERENCES especialidades(id) ON DELETE CASCADE,
  PRIMARY KEY (profissional_id, especialidade_id)
);

CREATE TABLE pacientes (
  id SERIAL PRIMARY KEY,
  nome_completo VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  data_nascimento DATE,
  sexo CHAR(1),
  telefone VARCHAR(20),
  email VARCHAR(150),
  endereco TEXT,
  convenio VARCHAR(100),
  numero_carteirinha VARCHAR(50)
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(20) NOT NULL DEFAULT 'ATENDENTE' CHECK (perfil IN ('ADMIN', 'DENTISTA', 'ATENDENTE')),
  profissional_id INTEGER REFERENCES profissionais(id)
);

CREATE TABLE atendimentos (
  id SERIAL PRIMARY KEY,
  paciente_id INTEGER REFERENCES pacientes(id),
  profissional_id INTEGER REFERENCES profissionais(id),
  data_hora TIMESTAMP NOT NULL,
  data_hora_fim TIMESTAMP NOT NULL,
  tipo VARCHAR(50),
  status VARCHAR(50),
  motivo_cancelamento TEXT,
  diagnostico TEXT,
  observacoes TEXT,
  valor NUMERIC(10, 2),
  CHECK (data_hora_fim > data_hora),
  CHECK (status <> 'Cancelado' OR motivo_cancelamento IS NOT NULL)
);
