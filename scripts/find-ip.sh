#!/bin/bash

# Script to help find your IP address for React Native development
# This script will show your computer's IP addresses

echo "🔍 Finding your IP address for React Native development..."
echo ""

# macOS/Linux - show all network interfaces
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "📱 Network Interfaces:"
    ifconfig | grep -E "inet [0-9]" | grep -v "127.0.0.1" | awk '{print $2}' | while read ip; do
        echo "   IP: $ip"
    done
    echo ""
    echo "🎯 Most likely IP addresses for development:"
    ifconfig | grep -E "inet 192\.168\.|inet 10\.|inet 172\." | awk '{print "   " $2}'
    
# Windows (Git Bash or WSL)
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo "📱 Network Interfaces:"
    ipconfig | grep -E "IPv4 Address" | awk -F: '{print "   IP:" $2}'
fi

echo ""
echo "💡 Instructions:"
echo "1. Copy one of the IP addresses above (usually starts with 192.168 or 10.)"
echo "2. Open config/development.ts"
echo "3. Set COMPUTER_IP to your IP address:"
echo "   COMPUTER_IP: '192.168.1.XXX'  // Replace XXX with your actual IP"
echo "4. Restart your Expo development server"
echo ""
echo "🔧 Make sure your backend server is running and accessible on your network!"
