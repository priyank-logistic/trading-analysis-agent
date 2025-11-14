#!/bin/bash

# Start Backend Server
# This script starts the FastAPI backend server

echo "Starting CryptoAnalytica Backend Server..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found!"
    echo "Please create a .env file with your OPENAI_API_KEY"
    echo "Example: echo 'OPENAI_API_KEY=your_key_here' > .env"
    echo ""
fi

# Install dependencies if needed
if [ ! -d "venv/lib/python3.12/site-packages/fastapi" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Start the server
echo "Starting backend server on http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""
python -m uvicorn api.main:app --reload --port 8000

