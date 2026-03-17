#!/bin/bash

# Setup Script for CNH Rapida on Hostinger VPS (Ubuntu)

echo "--- Starting VPS Setup ---"

# 1. Update System
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# 2. Install Docker
echo "Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Create Project Directory
echo "Preparing project directory..."
mkdir -p ~/cnh_rapida
cd ~/cnh_rapida

# 4. Instructions for the user
echo "--- Setup Complete! ---"
echo "Next steps:"
echo "1. Upload your project files (Cnh_rapida/, frontend/, nginx/, docker-compose.yml) to ~/cnh_rapida on the VPS."
echo "2. Run: sudo docker compose build"
echo "3. Run: sudo docker compose up -d"
echo "4. Your site will be live at http://72.62.15.46.nip.io (or your VPS IP)."
