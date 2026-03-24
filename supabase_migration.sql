-- Migrations para FuelChain Industrial Dashboard

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Ledger (Blockchain)
CREATE TABLE IF NOT EXISTS ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  height TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  txns INTEGER DEFAULT 0,
  hash TEXT NOT NULL,
  prev_hash TEXT NOT NULL,
  status TEXT DEFAULT 'verified',
  terminal TEXT,
  volume NUMERIC
);

-- Tabela de Analytics (Produção vs Distribuição)
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL, -- ex: '01 OCT'
  production NUMERIC DEFAULT 0,
  distribution NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Market Mix (Tipos de Combustível)
CREATE TABLE IF NOT EXISTS market_mix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "value" INTEGER NOT NULL,
  color TEXT NOT NULL
);

-- Inserção de dados iniciais (Seed)
INSERT INTO ledger (height, txns, hash, prev_hash, status, terminal, volume)
VALUES 
('8442109', 142, '0x7f4e7a12', '0x3b2ae45f', 'verified', 'Terminal 1', 12400),
('8442108', 89, '0xa9c323bb', '0x12ff9c22', 'verified', 'Terminal 2', 8200),
('8442107', 215, '0xd44160ea', '0xbb21ff01', 'verified', 'Terminal 3', 45000),
('8442106', 44, '0xee423312', '0x44a19100', 'verified', 'Terminal 4', 1250);

INSERT INTO analytics (label, production, distribution)
VALUES 
('01 OCT', 4000, 2400),
('07 OCT', 3000, 1398),
('14 OCT', 2000, 9800),
('21 OCT', 2780, 3908),
('28 OCT', 1890, 4800),
('31 OCT', 2390, 3800);

INSERT INTO market_mix (name, "value", color)
VALUES 
('Diesel Grade A', 55, '#ffb4a8'),
('Unleaded Premium', 25, '#acc7ff'),
('Bio-Fuel E85', 20, '#353534');
