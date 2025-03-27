-- Scoring Sessions Schema

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default user if none exists
INSERT INTO users (id, email, password_hash)
SELECT 1, 'default@example.com', 'placeholder_hash'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 1);

-- Table for storing scoring scenarios
CREATE TABLE IF NOT EXISTS scoring_scenarios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) DEFAULT 1,
  scenario_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active' -- 'active', 'archived', 'deleted'
);

-- Table for storing criteria used in scoring scenarios
CREATE TABLE IF NOT EXISTS scoring_criteria (
  id SERIAL PRIMARY KEY,
  scenario_id INTEGER REFERENCES scoring_scenarios(id) ON DELETE CASCADE,
  criterion_id VARCHAR(50) NOT NULL, -- e.g. 'industry_fit'
  criterion_label VARCHAR(255) NOT NULL, -- e.g. 'Industry Fit'
  criterion_description TEXT,
  score_low INTEGER DEFAULT 10,
  score_medium INTEGER DEFAULT 30,
  score_high INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing accounts in scoring scenarios
CREATE TABLE IF NOT EXISTS scoring_accounts (
  id SERIAL PRIMARY KEY,
  scenario_id INTEGER REFERENCES scoring_scenarios(id) ON DELETE CASCADE,
  account_id VARCHAR(255) NOT NULL, -- Original ID from uploaded data
  account_name VARCHAR(255) NOT NULL,
  total_score INTEGER,
  tier VARCHAR(50), -- 'Low', 'Medium', 'High'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing individual account scores per criterion
CREATE TABLE IF NOT EXISTS account_criterion_scores (
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES scoring_accounts(id) ON DELETE CASCADE,
  criterion_id INTEGER REFERENCES scoring_criteria(id) ON DELETE CASCADE,
  score_level VARCHAR(50), -- 'low', 'medium', 'high'
  score_value INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing export/sync history
CREATE TABLE IF NOT EXISTS scoring_exports (
  id SERIAL PRIMARY KEY,
  scenario_id INTEGER REFERENCES scoring_scenarios(id) ON DELETE CASCADE,
  export_type VARCHAR(50) NOT NULL, -- 'csv', 'salesforce', 'hubspot', etc.
  export_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  export_details JSONB -- Any additional details about the export
);