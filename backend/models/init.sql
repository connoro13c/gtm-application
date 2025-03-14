-- Database schema for RevOps application

-- User accounts
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data sources
CREATE TABLE data_sources (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  source_type VARCHAR(50) NOT NULL, -- 'salesforce', 'hubspot', 'csv', etc.
  source_name VARCHAR(255) NOT NULL,
  connection_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raw data storage
CREATE TABLE raw_datasets (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES data_sources(id),
  data_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Field mappings
CREATE TABLE field_mappings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  mapping_name VARCHAR(255),
  mapping_json JSONB, -- Store the field mappings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Account matching rules
CREATE TABLE matching_rules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  rule_name VARCHAR(255),
  rule_config JSONB, -- Configuration for matching
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wizard session states
CREATE TABLE wizard_session_states (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  session_id VARCHAR(255),
  wizard_step VARCHAR(50), -- 'data_loading', 'data_mapping', etc.
  state_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Final processed data snapshots
CREATE TABLE data_snapshots (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  snapshot_name VARCHAR(255),
  snapshot_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);