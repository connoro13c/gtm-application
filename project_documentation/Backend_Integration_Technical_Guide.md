# Backend Integration Technical Guide

## Database Schema for Scoring Scenarios

### Overview

This document outlines the database schema and API endpoints needed to support the account scoring functionality. The system stores and manages scoring scenarios, uploads account data, and calculates propensity-to-buy scores based on user-defined criteria.

## Database Schema

### Scoring Scenarios

```sql
CREATE TABLE scoring_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  created_by VARCHAR(255),
  description TEXT,
  is_archived BOOLEAN DEFAULT FALSE
);
```

### Account Lists

```sql
CREATE TABLE account_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES scoring_scenarios(id) ON DELETE CASCADE,
  original_filename VARCHAR(255) NOT NULL,
  storage_path VARCHAR(255) NOT NULL, -- S3 or local storage path
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  row_count INTEGER,
  id_column_name VARCHAR(100) NOT NULL,
  name_column_name VARCHAR(100) NOT NULL
);
```

### Scoring Criteria

```sql
CREATE TABLE scoring_criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES scoring_scenarios(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  weight INTEGER DEFAULT 1, -- Importance multiplier for this criterion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Account Scores

```sql
CREATE TABLE account_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID REFERENCES scoring_scenarios(id) ON DELETE CASCADE,
  account_id VARCHAR(255) NOT NULL, -- Extracted from the uploaded file
  account_name VARCHAR(255) NOT NULL, -- Extracted from the uploaded file
  total_score INTEGER, -- 0-100 final score
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (scenario_id, account_id)
);
```

### Criterion Scores

```sql
CREATE TABLE criterion_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_score_id UUID REFERENCES account_scores(id) ON DELETE CASCADE,
  criterion_id UUID REFERENCES scoring_criteria(id) ON DELETE CASCADE,
  score INTEGER NOT NULL, -- 0-10 score for this specific criterion
  notes TEXT,
  UNIQUE (account_score_id, criterion_id)
);
```

## API Endpoints

### Scoring Scenarios

- `GET /api/scoring-scenarios` - List all scenarios
- `GET /api/scoring-scenarios/:id` - Get scenario details
- `POST /api/scoring-scenarios` - Create new scenario
- `PUT /api/scoring-scenarios/:id` - Update scenario
- `DELETE /api/scoring-scenarios/:id` - Archive scenario (not delete)

### Account Lists

- `POST /api/scoring-scenarios/:id/upload` - Upload account list file
- `GET /api/scoring-scenarios/:id/accounts` - List accounts for a scenario
- `GET /api/scoring-scenarios/:id/preview` - Preview account data (first 10 rows)

### Criteria

- `POST /api/scoring-scenarios/:id/criteria` - Add criteria to scenario
- `GET /api/scoring-scenarios/:id/criteria` - List criteria for scenario
- `PUT /api/scoring-scenarios/:id/criteria/:criterionId` - Update criterion

### Scores

- `POST /api/scoring-scenarios/:id/calculate` - Calculate scores for accounts
- `GET /api/scoring-scenarios/:id/scores` - Get scores for all accounts
- `PUT /api/scoring-scenarios/:id/scores/:accountId` - Update score for account

## File Processing Flow

1. User uploads CSV/Excel file
2. Frontend parses file to show preview and allow column selection
3. On submission:
   - File is sent to backend
   - Backend validates file format
   - File is stored in a secure location (S3, Azure Blob Storage, etc.)
   - File metadata is stored in `account_lists` table
   - File is parsed and account data is extracted
   - Initial account records are created without scores

## Score Calculation Process

1. After criteria are defined, the scoring process starts
2. Each account is scored against each criterion (either manually or algorithmically)
3. Individual criterion scores are stored in `criterion_scores` table
4. Total scores are calculated as weighted averages and stored in `account_scores` table
5. Scenario status is updated to 'completed'

## Technology Considerations

### Storage Options

- PostgreSQL for relational data
- Amazon S3 or Azure Blob Storage for file storage
- Redis for caching and session management

### Backend Framework

- Node.js with Express.js (matching current stack)
- TypeScript for type safety
- Prisma ORM for database interactions

### File Processing

- Use streams for efficient file handling
- Consider using worker threads or a queue system (like Bull) for processing large files
- Implement progress tracking for long-running operations

### Security

- Implement proper authentication and authorization
- Validate and sanitize all user inputs
- Set up proper CORS policies
- Use HTTPS for all API endpoints
- Implement rate limiting

## Deployment Architecture

### Development

- Local Docker containers for services
- GitHub Actions for CI/CD

### Production

- Backend API: AWS ECS or Azure App Service
- Database: AWS RDS or Azure Database for PostgreSQL
- File Storage: S3 or Azure Blob Storage
- Caching: Redis (ElastiCache or Azure Cache for Redis)
- Load Balancing: ALB or Azure Front Door

## Monitoring and Logging

- Implement centralized logging with ELK stack or similar
- Set up application performance monitoring (APM)
- Create dashboards for key metrics
- Configure alerts for system issues

## Development Roadmap

### Phase 1: Basic Implementation

- Set up database schema
- Implement file upload and parsing
- Create basic API endpoints
- Implement manual scoring

### Phase 2: Enhanced Features

- Add automated scoring algorithms
- Implement scoring templates
- Add batch operations for efficiency
- Create detailed reporting

### Phase 3: Advanced Features

- Implement ML-based scoring
- Add integration with external data sources
- Create webhook notifications
- Add real-time collaboration features