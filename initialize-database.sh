#!/bin/bash

# Text formatting
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RED=$(tput setaf 1)
RESET=$(tput sgr0)

# Make sure docker is running
if ! docker info > /dev/null 2>&1; then
  echo "${RED}Docker does not seem to be running, please start Docker first.${RESET}"
  exit 1
fi

# Check if the postgres container is running
if ! docker ps | grep -q "postgres:14"; then
  echo "${YELLOW}PostgreSQL container is not running. Starting docker-compose...${RESET}"
  docker-compose up -d db
  
  # Wait for database to be ready
  echo "${BLUE}Waiting for database to be ready...${RESET}"
  sleep 10
fi

# First check and wait until PostgreSQL is actually ready
echo "${BLUE}Checking database connection...${RESET}"
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  if docker-compose exec -T db pg_isready -U user -d revops_db > /dev/null 2>&1; then
    echo "${GREEN}Database is ready!${RESET}"
    break
  fi
  
  ATTEMPT=$((ATTEMPT+1))
  echo "${YELLOW}Waiting for database to be ready... ($ATTEMPT/$MAX_ATTEMPTS)${RESET}"
  sleep 2
  
  if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "${RED}Database did not become ready in time. Exiting.${RESET}"
    exit 1
  fi
done

# Copy the SQL file to the container
echo "${BLUE}Copying SQL schema to container...${RESET}"
SQL_CONTAINER_ID=$(docker-compose ps -q db)

if [ -z "$SQL_CONTAINER_ID" ]; then
  echo "${RED}Could not find database container. Is it running?${RESET}"
  exit 1
fi

docker cp backend/models/scoring_sessions.sql $SQL_CONTAINER_ID:/tmp/

if [ $? -ne 0 ]; then
  echo "${RED}Failed to copy SQL file to container${RESET}"
  exit 1
fi

echo "${GREEN}Successfully copied SQL schema to container${RESET}"

# Run the SQL file to initialize the schema
echo "${BLUE}Initializing database schema...${RESET}"
docker-compose exec -T db psql -U user -d revops_db -f /tmp/scoring_sessions.sql

echo "${GREEN}Database initialization complete!${RESET}"