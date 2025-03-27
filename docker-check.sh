#!/bin/bash

# Check for Docker socket connectivity issues

# Text formatting
BOLD=$(tput bold)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RED=$(tput setaf 1)
RESET=$(tput sgr0)

echo "${BOLD}${BLUE}===== Docker Connectivity Check =====${RESET}"

# 1. Check Docker Desktop status
echo "${BLUE}Checking for Docker Desktop processes...${RESET}"

DOCKER_DESKTOP_RUNNING=false
if pgrep -f "Docker Desktop" > /dev/null; then
  echo "${GREEN}✓ Docker Desktop process found${RESET}"
  DOCKER_DESKTOP_RUNNING=true
else
  echo "${YELLOW}! Docker Desktop process not found${RESET}"
  DOCKER_DESKTOP_RUNNING=false
fi

# 2. Check socket files
echo "${BLUE}Checking for Docker socket files...${RESET}"
SOCKET_FILES=(
  "/var/run/docker.sock"
  "$HOME/.docker/run/docker.sock"
  "/usr/local/var/run/docker.sock"
)

FOUND_SOCKET=false
for socket in "${SOCKET_FILES[@]}"; do
  if [ -e "$socket" ]; then
    echo "${GREEN}✓ Found socket file: $socket${RESET}"
    FOUND_SOCKET=true
    FOUND_SOCKET_PATH="$socket"
    # Test this socket
    echo "${BLUE}Testing connection to $socket...${RESET}"
    export DOCKER_HOST="unix://$socket"
    if docker ps > /dev/null 2>&1; then
      echo "${GREEN}✓ Successfully connected to Docker using socket: $socket${RESET}"
      WORKING_SOCKET="$socket"
      break
    else
      echo "${YELLOW}! Socket exists but connection failed: $socket${RESET}"
    fi
  else
    echo "${YELLOW}! Socket file not found: $socket${RESET}"
  fi
done

if [ "$FOUND_SOCKET" = false ]; then
  echo "${RED}✗ No Docker socket files found.${RESET}"
fi

# 3. Check Docker CLI version
echo "${BLUE}Checking Docker CLI version...${RESET}"
DOCKER_VERSION=$(docker --version 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "${GREEN}✓ Docker CLI installed: $DOCKER_VERSION${RESET}"
else
  echo "${RED}✗ Docker CLI not found or not in PATH${RESET}"
fi

# 4. Check Docker Compose version
echo "${BLUE}Checking Docker Compose version...${RESET}"
DOCKER_COMPOSE_VERSION=$(docker-compose --version 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "${GREEN}✓ Docker Compose installed: $DOCKER_COMPOSE_VERSION${RESET}"
else
  echo "${RED}✗ Docker Compose not found or not in PATH${RESET}"
fi

# 5. Status summary
echo "\n${BOLD}${BLUE}===== Docker Status Summary =====${RESET}"

if [ "$DOCKER_DESKTOP_RUNNING" = true ] && [ -n "$WORKING_SOCKET" ]; then
  echo "${GREEN}✓ Docker appears to be running correctly${RESET}"
  echo "${GREEN}✓ Working socket path: $WORKING_SOCKET${RESET}"
  echo "\n${BOLD}Try the following command to start your application:${RESET}"
  echo "  DOCKER_HOST=unix://$WORKING_SOCKET docker-compose up -d"
  
  # Create a convenience script for using the working socket
  echo "#!/bin/bash\nexport DOCKER_HOST=unix://$WORKING_SOCKET\ndocker-compose \$@" > ./docker-compose-fixed.sh
  chmod +x ./docker-compose-fixed.sh
  echo "\n${BOLD}${GREEN}Created helper script: ./docker-compose-fixed.sh${RESET}"
  echo "Use this to run Docker Compose commands with the correct socket:"
  echo "  ./docker-compose-fixed.sh up -d"
  
else
  echo "${RED}✗ Docker connectivity issues detected${RESET}"
  echo "\n${BOLD}${YELLOW}Recommended actions:${RESET}"
  
  if [ "$DOCKER_DESKTOP_RUNNING" = false ]; then
    echo "1. ${BOLD}Start Docker Desktop${RESET} - Docker process was not detected"
  fi
  
  if [ "$FOUND_SOCKET" = false ]; then
    echo "2. ${BOLD}Check Docker installation${RESET} - No socket files were found"
  elif [ -z "$WORKING_SOCKET" ]; then
    echo "2. ${BOLD}Check Docker permissions${RESET} - Socket found but connection failed"
    echo "   Try: sudo chmod 666 $FOUND_SOCKET_PATH"
  fi
  
  echo "3. ${BOLD}Restart Docker Desktop${RESET} - This often fixes connection issues"
  echo "4. ${BOLD}Use frontend-only mode${RESET} - Skip Docker with 'npm run start:frontend'"
fi