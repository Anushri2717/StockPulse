-- server/db/schema.sql

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE portfolios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,        -- e.g. 'AAPL'
  company_name VARCHAR(150),           -- e.g. 'Apple Inc.'
  shares DECIMAL(10,4) NOT NULL,       -- how many shares bought
  buy_price DECIMAL(10,2) NOT NULL,    -- price when bought
  bought_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  condition VARCHAR(10) NOT NULL,      -- 'above' or 'below'
  is_triggered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  volume BIGINT,
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_portfolio_user ON portfolios(user_id);
CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_price_history_symbol ON price_history(symbol);