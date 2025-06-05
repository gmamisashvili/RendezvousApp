#!/usr/bin/env node

// Simple verification script to check if the Android app can successfully connect
// to the backend and retrieve discovery data

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

async function testFullFlow() {
  console.log('🔍 Testing full Rendezvous app integration...\n');
  
  // Step 1: Check backend health
  console.log('1. Checking backend health...');
  try {
    const healthCheck = await makeRequest('/health');
    if (healthCheck.status === 200 || healthCheck.status === 404) {
      console.log('✅ Backend is running and accessible');
    } else {
      console.log('❌ Backend health check failed:', healthCheck.status);
      return;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    return;
  }
  
  // Step 2: Login to get token
  console.log('\n2. Authenticating test user...');
  try {
    const loginResponse = await makeRequest('/auth/login', 'POST', {
      email: "frontend-test@example.com",
      password: "password123"
    });
    
    if (loginResponse.status === 200 && loginResponse.data.success) {
      console.log('✅ Authentication successful');
      const token = loginResponse.data.token;
      
      // Step 3: Test discovery endpoint
      console.log('\n3. Testing discovery API...');
      const discoveryResponse = await makeRequest(
        '/discovery/nearby?latitude=40.7128&longitude=-74.0060&radius=10&minAge=18&maxAge=35',
        'GET',
        null,
        { 'Authorization': `Bearer ${token}` }
      );
      
      if (discoveryResponse.status === 200) {
        console.log('✅ Discovery API working correctly');
        console.log(`📊 Found ${discoveryResponse.data.length} users`);
        
        if (discoveryResponse.data.length > 0) {
          const user = discoveryResponse.data[0];
          console.log(`👤 Sample user: ${user.name}, Age: ${user.age}, Distance: ${user.distance}km`);
          console.log(`🏷️  Interests: ${user.interests?.length || 0}`);
          console.log(`📸 Photos: ${user.photos?.length || 0}`);
          console.log(`✓ Verified: ${user.isVerified ? 'Yes' : 'No'}`);
        }
        
        // Step 4: Test swipe functionality
        if (discoveryResponse.data.length > 0) {
          console.log('\n4. Testing swipe functionality...');
          const targetUserId = discoveryResponse.data[0].userId;
          
          const swipeResponse = await makeRequest(
            '/discovery/swipe',
            'POST',
            { targetUserId, action: 'like' },
            { 'Authorization': `Bearer ${token}` }
          );
          
          if (swipeResponse.status === 200) {
            console.log('✅ Swipe functionality working');
            console.log(`💖 Swipe result: ${swipeResponse.data.isMatch ? 'Match!' : 'No match'}`);
          } else {
            console.log('❌ Swipe failed:', swipeResponse.status, swipeResponse.data);
          }
        }
        
      } else {
        console.log('❌ Discovery API failed:', discoveryResponse.status, discoveryResponse.data);
      }
      
    } else {
      console.log('❌ Authentication failed:', loginResponse.status, loginResponse.data);
    }
  } catch (error) {
    console.log('❌ Integration test error:', error.message);
  }
  
  console.log('\n🎉 Integration test completed!');
  console.log('\n📱 Android app should now be able to:');
  console.log('   - Connect to backend API');
  console.log('   - Authenticate users');
  console.log('   - Load discovery data');
  console.log('   - Display user cards with photos, interests, and verification status');
  console.log('   - Handle swipe actions');
  console.log('\n🔧 To test in Android app:');
  console.log('   1. Open the app in Android emulator');
  console.log('   2. Login with: frontend-test@example.com / password123');
  console.log('   3. Navigate to Discovery tab');
  console.log('   4. Verify cards display properly with user data');
}

testFullFlow().catch(console.error);
