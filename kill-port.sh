#!/bin/bash

# Define the port to kill processes on
PORT=3000

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