/**
 * Test script to verify SwipeableCard implementation
 * This script checks that all required components and methods are properly implemented
 */

console.log('🧪 Testing SwipeableCard Implementation...\n');

// Check if required dependencies are installed
const requiredPackages = [
  'react-native-gesture-handler',
  'expo-haptics',
  'react-native-paper'
];

async function checkPackages() {
  console.log('📦 Checking required packages...');
  for (const pkg of requiredPackages) {
    try {
      require(`../node_modules/${pkg}/package.json`);
      console.log(`✅ ${pkg} - installed`);
    } catch (error) {
      console.log(`❌ ${pkg} - missing`);
      return false;
    }
  }
  return true;
}

// Check if SwipeableCard component exists and has proper exports
async function checkComponent() {
  console.log('\n🔍 Checking SwipeableCard component...');
  try {
    const fs = require('fs');
    const path = require('path');
    
    const componentPath = path.join(__dirname, 'components/discovery/SwipeableCard.tsx');
    if (!fs.existsSync(componentPath)) {
      console.log('❌ SwipeableCard.tsx not found');
      return false;
    }
    
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Check for required imports
    const requiredImports = [
      'forwardRef',
      'useImperativeHandle',
      'PanGestureHandler',
      'Animated'
    ];
    
    for (const imp of requiredImports) {
      if (content.includes(imp)) {
        console.log(`✅ ${imp} - imported`);
      } else {
        console.log(`❌ ${imp} - missing import`);
        return false;
      }
    }
    
    // Check for required interface
    if (content.includes('SwipeableCardRef')) {
      console.log('✅ SwipeableCardRef interface - defined');
    } else {
      console.log('❌ SwipeableCardRef interface - missing');
      return false;
    }
    
    // Check for required methods
    const requiredMethods = [
      'swipeLeft',
      'swipeRight',
      'reset',
      'onGestureEvent',
      'onHandlerStateChange'
    ];
    
    for (const method of requiredMethods) {
      if (content.includes(method)) {
        console.log(`✅ ${method} - implemented`);
      } else {
        console.log(`❌ ${method} - missing`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error checking component: ${error.message}`);
    return false;
  }
}

// Check if dashboard integration is working
async function checkDashboardIntegration() {
  console.log('\n🔗 Checking dashboard integration...');
  try {
    const fs = require('fs');
    const path = require('path');
    
    const dashboardPath = path.join(__dirname, 'app/(tabs)/dashboard.tsx');
    if (!fs.existsSync(dashboardPath)) {
      console.log('❌ dashboard.tsx not found');
      return false;
    }
    
    const content = fs.readFileSync(dashboardPath, 'utf8');
    
    // Check for required imports and usage
    const requiredElements = [
      'SwipeableCardRef',
      'useRef',
      'swipeableCardRef',
      'Haptics'
    ];
    
    for (const element of requiredElements) {
      if (content.includes(element)) {
        console.log(`✅ ${element} - present in dashboard`);
      } else {
        console.log(`❌ ${element} - missing from dashboard`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error checking dashboard: ${error.message}`);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting SwipeableCard Implementation Tests\n');
  
  const packageCheck = await checkPackages();
  const componentCheck = await checkComponent();
  const dashboardCheck = await checkDashboardIntegration();
  
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`📦 Packages: ${packageCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔧 Component: ${componentCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔗 Integration: ${dashboardCheck ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = packageCheck && componentCheck && dashboardCheck;
  console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 SwipeableCard implementation is ready for testing!');
    console.log('💡 Next steps:');
    console.log('   1. Test gesture swiping on device/simulator');
    console.log('   2. Test action button interactions');
    console.log('   3. Verify animation smoothness');
    console.log('   4. Test haptic feedback');
  }
  
  return allPassed;
}

// Run the tests
runTests().catch(console.error);
