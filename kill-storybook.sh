#!/bin/bash

# Define the ports to kill processes on
PORTS=(6006 6008)

for PORT in "${PORTS[@]}"; do
  echo "Looking for processes on port $PORT..."

  # Find process IDs using the port
  PIDS=$(lsof -i :$PORT -t)

  if [ -z "$PIDS" ]; then
    echo "No processes found using port $PORT."
  else
    echo "Found processes using port $PORT: $PIDS"
    echo "Killing processes..."
    
    # Kill each process
    for PID in $PIDS; do
      echo "Killing process $PID"
      kill -9 $PID
    done
    
    echo "All processes on port $PORT have been terminated."
  fi

  echo "Port $PORT should now be available."
done

# Also kill any Node.js processes with storybook in the command line
echo "Looking for storybook processes..."
# Filter out our own parent process
MY_PID=$$
PARENT_PID=$(ps -o ppid= -p $MY_PID | tr -d ' ')
STORYBOOK_PIDS=$(ps aux | grep -i storybook | grep -v grep | grep -v $PARENT_PID | awk '{print $2}')

if [ -z "$STORYBOOK_PIDS" ]; then
  echo "No storybook processes found."
else
  echo "Found storybook processes: $STORYBOOK_PIDS"
  echo "Killing processes..."
  
  # Kill each process
  for PID in $STORYBOOK_PIDS; do
    echo "Killing process $PID"
    kill -9 $PID 2>/dev/null || true
  done
  
  echo "All storybook processes have been terminated."
fi

echo "Storybook should now be stopped."