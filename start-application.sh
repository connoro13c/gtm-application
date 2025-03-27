#!/bin/bash

# Text formatting
BOLD=$(tput bold)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RED=$(tput setaf 1)
RESET=$(tput sgr0)

echo "${BOLD}${BLUE}===== GTM Application Startup Script =====${RESET}"

# Function to check if a port is in use
check_port() {
  local port=$1
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
    return 0  # Port is in use
  else
    return 1  # Port is free
  fi
}

# Function to kill process on a port if needed
kill_port_if_needed() {
  local port=$1
  if check_port $port; then
    echo "${YELLOW}Port $port is in use. Killing the process...${RESET}"
    ./kill-port.sh $port
    sleep 1
  fi
}

# Variable to track if we're running without Docker
SKIP_DOCKER=false

# Check if Docker is running
echo "${BLUE}Checking if Docker is running...${RESET}"

# First check using docker-compose directly (which you're using in the screenshot)
# This bypasses the normal Docker socket location
if docker-compose ps >/dev/null 2>&1; then
  echo "${GREEN}✓ Docker is running${RESET}"
  SKIP_DOCKER=false
else
  # If that fails, try docker ps
  if docker ps >/dev/null 2>&1; then
    echo "${GREEN}✓ Docker is running${RESET}"
    SKIP_DOCKER=false
  else
    # Last resort, try docker info
    if docker info >/dev/null 2>&1; then
      echo "${GREEN}✓ Docker is running${RESET}"
      SKIP_DOCKER=false
    else
      echo "${RED}Cannot connect to Docker!${RESET}"
      echo "${YELLOW}Your Docker appears to be running, but we can't connect to it.${RESET}"
      echo "${YELLOW}This might be due to:${RESET}"
      echo "  - Docker socket path mismatch"
      echo "  - Permission issues"
      echo "  - Docker context configuration"
      echo ""
      
      # Offer to try alternative Docker socket paths
      read -p "Would you like to try running with a different Docker socket path? (y/n): " try_alt_socket
      
      if [[ $try_alt_socket == "y" || $try_alt_socket == "Y" ]]; then
        # Common socket locations
        SOCKET_PATHS=(
          "/var/run/docker.sock"
          "$HOME/.docker/run/docker.sock"
          "/usr/local/var/run/docker.sock"
        )
        
        for socket in "${SOCKET_PATHS[@]}"; do
          echo "Trying socket: $socket"
          if [ -e "$socket" ]; then
            export DOCKER_HOST="unix://$socket"
            if docker ps >/dev/null 2>&1; then
              echo "${GREEN}✓ Successfully connected to Docker using socket: $socket${RESET}"
              SKIP_DOCKER=false
              break
            fi
          fi
        done
        
        # If we still can't connect, offer to skip Docker
        if [ "$SKIP_DOCKER" = true ]; then
          echo "${RED}Still can't connect to Docker.${RESET}"
          echo "${BLUE}Alternatives when Docker is unavailable:${RESET}"
          echo "1. You can run the frontend only without database services"
          read -p "Skip Docker and continue with frontend only? (y/n): " skip_docker
          
          if [[ $skip_docker == "y" || $skip_docker == "Y" ]]; then
            echo "${YELLOW}Skipping Docker services and proceeding with frontend only...${RESET}"
            SKIP_DOCKER=true
          else
            echo "${RED}Exiting. Please fix Docker connection issues and try again.${RESET}"
            exit 1
          fi
        fi
      else
        # Offer to skip Docker entirely
        echo "${BLUE}Alternatives when Docker is unavailable:${RESET}"
        echo "1. You can run the frontend only without database services"
        read -p "Skip Docker and continue with frontend only? (y/n): " skip_docker
        
        if [[ $skip_docker == "y" || $skip_docker == "Y" ]]; then
          echo "${YELLOW}Skipping Docker services and proceeding with frontend only...${RESET}"
          SKIP_DOCKER=true
        else
          echo "${RED}Exiting. Please fix Docker connection issues and try again.${RESET}"
          exit 1
        fi
      fi
    fi
  fi
fi

# Kill potentially conflicting port processes
echo "${BLUE}Checking for conflicting processes...${RESET}"
kill_port_if_needed 3000  # Frontend port
if [ "$SKIP_DOCKER" = false ]; then
  kill_port_if_needed 5000  # ML service port
  kill_port_if_needed 5001  # Alternate ML service port
  kill_port_if_needed 5432  # Postgres port
fi
echo "${GREEN}✓ Ports cleared${RESET}"

# Start docker containers if Docker is available
if [ "$SKIP_DOCKER" = false ]; then
  echo "${BLUE}Starting Docker containers (PostgreSQL, Backend)...${RESET}"
  # First try with the current environment
  if ! docker-compose up -d; then
    echo "${YELLOW}First docker-compose attempt failed, trying with COMPOSE_DOCKER_CLI_BUILD=0${RESET}"
    # Sometimes this environment variable helps with connection issues
    export COMPOSE_DOCKER_CLI_BUILD=0
    if ! docker-compose up -d; then
      echo "${RED}Failed to start Docker containers. Please check docker-compose.yml and try again.${RESET}"
      read -p "Continue with frontend only? (y/n): " continue_frontend
      if [[ $continue_frontend == "y" || $continue_frontend == "Y" ]]; then
        SKIP_DOCKER=true
      else
        exit 1
      fi
    else
      echo "${GREEN}✓ Docker containers started${RESET}"
    fi
  else
    echo "${GREEN}✓ Docker containers started${RESET}"
  fi

  if [ "$SKIP_DOCKER" = false ]; then
    # Wait for PostgreSQL to be ready
    echo "${BLUE}Waiting for PostgreSQL to be ready...${RESET}"
    sleep 5  # Initial wait

    MAX_RETRIES=30
    RETRIES=0

    while [ $RETRIES -lt $MAX_RETRIES ]; do
      if docker-compose exec db pg_isready -U user -d revops_db >/dev/null 2>&1; then
        echo "${GREEN}✓ PostgreSQL is ready${RESET}"
        break
      else
        echo "${YELLOW}Waiting for PostgreSQL... ($(($RETRIES+1))/$MAX_RETRIES)${RESET}"
        RETRIES=$(($RETRIES+1))
        sleep 2
      fi
      
      if [ $RETRIES -eq $MAX_RETRIES ]; then
        echo "${RED}PostgreSQL did not become ready in time. Continuing anyway, but this might cause issues.${RESET}"
      fi
    done

    # Initialize database
    echo "${BLUE}Initializing database schema...${RESET}"
    if ! ./initialize-database.sh; then
      echo "${YELLOW}Database initialization encountered issues. This might be fine if tables already exist.${RESET}"
    else
      echo "${GREEN}✓ Database initialized${RESET}"
    fi
  fi
fi

if [ "$SKIP_DOCKER" = true ]; then
  echo "${YELLOW}Skipping backend services (PostgreSQL, Backend API)${RESET}"
  echo "${YELLOW}⚠️ Note: Functionality requiring backend services will not work${RESET}"
fi

# Build frontend
echo "${BLUE}Building frontend application...${RESET}"
cd frontend
npm run build
if [ $? -ne 0 ]; then
  cd ..
  echo "${RED}Frontend build failed. Check for errors and try again.${RESET}"
  exit 1
fi
cd ..
echo "${GREEN}✓ Frontend built successfully${RESET}"

# Start the frontend server
echo "${BLUE}Starting frontend server...${RESET}"
cd frontend
npm run start &
FRONTEND_PID=$!
cd ..
echo "${GREEN}✓ Frontend server started (PID: $FRONTEND_PID)${RESET}"

# Print success message
echo "\n${BOLD}${GREEN}===== Application Started Successfully! =====${RESET}"
echo "${BOLD}Frontend:${RESET} http://localhost:3000"

if [ "$SKIP_DOCKER" = false ]; then
  echo "${BOLD}Backend API:${RESET} http://localhost:3000/api"
  echo "${BOLD}Database:${RESET} PostgreSQL on port 5432"
else
  echo "${YELLOW}⚠️ Running in frontend-only mode. Backend services are not available.${RESET}"
fi

echo "\n${YELLOW}Press Ctrl+C to shut down all services${RESET}\n"

# Function to clean up on exit
cleanup() {
  echo "\n${BOLD}${BLUE}Shutting down services...${RESET}"
  
  # Kill the frontend process
  if [ ! -z "$FRONTEND_PID" ]; then
    echo "${BLUE}Stopping frontend server...${RESET}"
    kill $FRONTEND_PID 2>/dev/null
  fi
  
  # Stop docker containers if Docker was used
  if [ "$SKIP_DOCKER" = false ]; then
    echo "${BLUE}Stopping Docker containers...${RESET}"
    docker-compose down
  fi
  
  echo "${GREEN}Application shutdown complete.${RESET}"
}

# Set up trap for clean shutdown
trap cleanup EXIT INT TERM

# Keep the script running until Ctrl+C
wait $FRONTEND_PID