CREATE TABLE especialidades (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  area VARCHAR(100)
);

CREATE TABLE profissionais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  registro VARCHAR(50) NOT NULL, -- CRM/COREN/CRF
  especialidade_id INTEGER REFERENCES especialidades(id),
  cargo VARCHAR(100),
  turno VARCHAR(50),
  telefone VARCHAR(20),
  email VARCHAR(150),
  ativo BOOLEAN DEFAULT TRUE
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

CREATE TABLE atendimentos (
  id SERIAL PRIMARY KEY,
  paciente_id INTEGER REFERENCES pacientes(id),
  profissional_id INTEGER REFERENCES profissionais(id),
  data_hora TIMESTAMP NOT NULL,
  tipo VARCHAR(50), -- consulta/exame/internação
  status VARCHAR(50),
  diagnostico TEXT,
  observacoes TEXT,
  valor NUMERIC(10, 2)
);