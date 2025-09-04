#!/bin/bash
# Script to redirect Vercel to client directory

echo "=== CabBuddy Deployment Script ==="
echo "Navigating to client directory..."
cd client

echo "Installing client dependencies..."
npm install

echo "Building client application..."
npm run build

echo "Build completed. Output directory: $(pwd)/dist"
