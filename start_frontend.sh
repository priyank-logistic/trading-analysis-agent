#!/bin/bash
# DEPRECATED: This script is for the old HTML frontend
# Use start_backend.sh for backend and npm run dev in frontend/ for Next.js frontend

echo "⚠️  DEPRECATED: This script is for the old HTML frontend"
echo "📝 For backend: Use ./start_backend.sh"
echo "📝 For frontend: cd frontend && npm run dev"
echo ""
echo "Starting backend server (old method)..."
echo ""

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start the FastAPI server
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

