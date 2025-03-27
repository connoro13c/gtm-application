#!/bin/bash

# Text formatting
BOLD=$(tput bold)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RED=$(tput setaf 1)
RESET=$(tput sgr0)

echo "${BOLD}${BLUE}===== Performing Docker Reset =====${RESET}"

# 1. Attempt to stop all containers cleanly
echo "${BLUE}Attempting to stop any running Docker containers...${RESET}"
if docker ps -q 2>/dev/null | xargs docker stop 2>/dev/null; then
  echo "${GREEN}✓ Stopped running containers${RESET}"
else
  echo "${YELLOW}! Could not stop containers - Docker may not be responding${RESET}"
fi

# 2. Kill Docker Desktop process
echo "${BLUE}Stopping Docker Desktop...${RESET}"
if pkill -f "Docker Desktop"; then
  echo "${GREEN}✓ Docker Desktop process terminated${RESET}"
else
  echo "${YELLOW}! Docker Desktop process not found or could not be terminated${RESET}"
fi

# 3. Wait for processes to fully end
echo "${BLUE}Waiting for processes to terminate completely...${RESET}"
sleep 3

# 4. Clean up socket files which might be stale
echo "${BLUE}Cleaning up potential stale socket files...${RESET}"
if [ -e "/var/run/docker.sock" ]; then
  sudo rm -f /var/run/docker.sock 2>/dev/null
  echo "${GREEN}✓ Removed /var/run/docker.sock${RESET}"
fi

if [ -e "$HOME/.docker/run/docker.sock" ]; then
  rm -f "$HOME/.docker/run/docker.sock" 2>/dev/null
  echo "${GREEN}✓ Removed $HOME/.docker/run/docker.sock${RESET}"
fi

# 5. Restart Docker Desktop
echo "${BLUE}Starting Docker Desktop...${RESET}"
open -a "Docker"

# 6. Wait for Docker to initialize
echo "${YELLOW}Waiting for Docker to initialize (30 seconds)...${RESET}"
for i in {1..30}; do
  echo -n "."
  sleep 1
done
echo ""

# 7. Check if Docker is responsive
echo "${BLUE}Checking if Docker is responsive...${RESET}"
MAX_ATTEMPTS=10
for i in $(seq 1 $MAX_ATTEMPTS); do
  echo "Attempt $i of $MAX_ATTEMPTS..."
  if docker info >/dev/null 2>&1; then
    echo "${GREEN}✓ Docker is now responsive!${RESET}"
    DOCKER_READY=true
    break
  else
    echo "${YELLOW}Docker not ready yet...${RESET}"
    sleep 3
  fi
done

if [ "$DOCKER_READY" != "true" ]; then
  echo "${RED}✗ Docker still not responsive after waiting.${RESET}"
  echo "${YELLOW}You may need to manually restart your computer.${RESET}"
fi

echo "${BOLD}${BLUE}===== Docker Reset Complete =====${RESET}"

# 8. Clean up old docker-compose resources
echo "${BLUE}Cleaning up old Docker Compose resources...${RESET}"
if [ -f "docker-compose.yml" ]; then
  echo "${YELLOW}Removing old containers, networks, and volumes...${RESET}"
  if docker-compose down -v --remove-orphans 2>/dev/null; then
    echo "${GREEN}✓ Successfully cleaned up Docker Compose resources${RESET}"
  else
    echo "${YELLOW}! Could not clean up Docker Compose resources${RESET}"
  fi
fi

echo "${BOLD}${GREEN}Docker environment has been reset!${RESET}"
echo "Try running your application again with: npm start"