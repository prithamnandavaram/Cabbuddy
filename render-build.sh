#!/bin/bash
# Script for building the server for Render deployment

echo "=== CabBuddy Server Deployment Script ==="
echo "Navigating to server directory..."
cd server

echo "Installing server dependencies..."
npm install

echo "Server build completed."
