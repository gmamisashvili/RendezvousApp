#!/usr/bin/env node

// Simple script to test API connectivity
const https = require('https');
const http = require('http');

const API_BASE = 'http://192.168.31.107:5166';

// Test health check
const testHealthCheck = () => {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}/health`;
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Health check successful:', res.statusCode);
        resolve(data);
      });
    }).on('error', (err) => {
      console.log('❌ Health check failed:', err.message);
      reject(err);
    });
  });
};

// Test discovery endpoint (without auth - should fail with 401)
const testDiscoveryEndpoint = () => {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}/api/discovery/nearby?latitude=40.7128&longitude=-74.0060&radius=10`;
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 401) {
          console.log('✅ Discovery endpoint reachable (401 Unauthorized as expected)');
        } else {
          console.log('⚠️  Discovery endpoint response:', res.statusCode, data);
        }
        resolve(data);
      });
    }).on('error', (err) => {
      console.log('❌ Discovery endpoint failed:', err.message);
      reject(err);
    });
  });
};

async function main() {
  console.log('Testing API connectivity...\n');
  
  try {
    await testHealthCheck();
  } catch (err) {
    console.log('Health check failed, trying discovery endpoint anyway...\n');
  }
  
  try {
    await testDiscoveryEndpoint();
  } catch (err) {
    console.log('Discovery endpoint test failed');
  }
  
  console.log('\nAPI test completed.');
}

main().catch(console.error);
