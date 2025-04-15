#!/bin/bash

# Voice Clone Setup Script

echo "Setting up Voice Clone application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js and try again."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is required but not installed. Please install pip3 and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is required but not installed. Please install npm and try again."
    exit 1
fi

# Create necessary directories
mkdir -p app/data/voices

echo "Setting up backend..."
cd app/api

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

echo "Setting up frontend..."
cd ../client

# Install Node.js dependencies
npm install

echo "Setup complete!"
echo ""
echo "To start the backend:"
echo "  cd app/api"
echo "  source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "  python run.py"
echo ""
echo "To start the frontend:"
echo "  cd app/client"
echo "  npm start"
echo ""
echo "Make sure MongoDB is running on your system!"

# Return to the root directory
cd ../.. 