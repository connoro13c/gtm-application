#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Please provide the port number to kill"
    exit 1
fi

PORT=$1
PID=$(lsof -i :$PORT -t)

if [ -z "$PID" ]; then
    echo "No process found running on port $PORT"
    exit 0
fi

echo "Killing process $PID running on port $PORT"
kill -9 $PID

echo "Port $PORT is now available"