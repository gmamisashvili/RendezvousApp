/**
 * Simple validation script to check photo management implementation
 */

console.log('🔍 Validating Photo Management Implementation...\n');

// Check if all required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'services/photoService.ts',
  'hooks/usePhotoManagement.ts', 
  'components/profile/PhotoManagement.tsx',
  'types/index.ts'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
  }
});

// Check backend connectivity
console.log('\n🌐 Testing backend connectivity:');
const axios = require('axios');

async function testBackend() {
  try {
    const response = await axios.get('http://localhost:5166/api/photo', {
      validateStatus: () => true // Accept any status code
    });
    
    if (response.status === 401) {
      console.log('✅ Backend responding (401 Unauthorized as expected)');
    } else {
      console.log(`✅ Backend responding (Status: ${response.status})`);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend not running on port 5166');
    } else {
      console.log('❌ Backend connection error:', error.message);
    }
  }
}

// Check frontend is running
async function testFrontend() {
  try {
    const response = await axios.get('http://localhost:8082', {
      validateStatus: () => true,
      timeout: 5000
    });
    console.log('✅ Frontend responding on port 8082');
  } catch (error) {
    console.log('❌ Frontend not accessible on port 8082');
  }
}

async function runValidation() {
  await testBackend();
  await testFrontend();
  
  console.log('\n📱 Manual Testing Steps:');
  console.log('1. Open http://localhost:8082 in your browser');
  console.log('2. Navigate to the Profile tab');
  console.log('3. Expand the "Photos" section');
  console.log('4. Test the photo management features');
  
  console.log('\n🎯 Key Features to Test:');
  console.log('- Photo upload (Add Photo button)');
  console.log('- Photo grid display');
  console.log('- Set main photo functionality'); 
  console.log('- Photo description editing');
  console.log('- Photo deletion');
  console.log('- Main photo display in profile header');
}

runValidation().catch(console.error);
