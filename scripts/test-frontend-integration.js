#!/usr/bin/env node

// Test script to register a user and test discovery functionality
const http = require('http');

const API_BASE = 'http://192.168.31.107:5166/api';

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (err) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function loginTestUser() {
  const testUser = {
    email: "frontend-test@example.com",
    password: "password123"
  };
  
  console.log('Logging in test user...');
  try {
    const response = await makeRequest('/auth/login', 'POST', testUser);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ User logged in successfully');
      console.log('Auth token:', response.data.token);
      return response.data.token;
    } else {
      console.log('❌ Login failed:', response.status, response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
}

async function testDiscoveryWithAuth(token) {
  console.log('\nTesting discovery endpoint with authentication...');
  
  try {
    const response = await makeRequest(
      '/discovery/nearby?latitude=40.7128&longitude=-74.0060&radius=10&minAge=18&maxAge=35',
      'GET',
      null,
      { 'Authorization': `Bearer ${token}` }
    );
    
    console.log('Discovery API Response:', response.status);
    
    if (response.status === 200) {
      console.log('✅ Discovery successful!');
      console.log('Found users:', response.data.length);
      
      response.data.forEach((user, index) => {
        console.log(`User ${index + 1}: ${user.name}, Age: ${user.age}, Distance: ${user.distance}km, Verified: ${user.isVerified}`);
      });
    } else {
      console.log('❌ Discovery failed:', response.data);
    }
  } catch (error) {
    console.log('❌ Discovery error:', error.message);
  }
}

async function main() {
  console.log('Testing Rendezvous API for frontend integration...\n');
  
  try {
    // Login with existing test user to get fresh token
    const token = await loginTestUser();
    
    if (token) {
      // Test discovery with authentication
      await testDiscoveryWithAuth(token);
    }
  } catch (error) {
    console.log('Main error:', error);
  }
  
  console.log('\nTest completed.');
}

main().catch(console.error);
