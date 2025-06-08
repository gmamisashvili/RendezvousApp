import { imageCacheManager } from '../utils/imageCacheManager';
import { testImageCaching, testZeroNetworkNavigation, runComprehensiveTest } from '../utils/testImageCache';

// Test URLs using public image service
const testImageUrls = [
  'https://picsum.photos/400/600?random=1',
  'https://picsum.photos/400/600?random=2', 
  'https://picsum.photos/400/600?random=3',
  'https://picsum.photos/400/600?random=4',
  'https://picsum.photos/400/600?random=5'
];

/**
 * Run a comprehensive test of the image caching system
 */
export async function runImageCacheTest() {
  console.log('🧪 Starting Image Cache System Test');
  console.log('===================================');
  
  try {
    // Test 1: Basic caching functionality
    console.log('\n📥 Testing basic image caching...');
    const cacheResult = await testImageCaching(testImageUrls);
    
    if (cacheResult.success) {
      console.log('✅ All images successfully cached locally');
      console.log(`📊 Cache summary:`);
      console.log(`   - Total images: ${cacheResult.totalImages}`);
      console.log(`   - Cached locally: ${cacheResult.cachedLocally}`);
      console.log(`   - Cache size: ${(cacheResult.cacheSize / 1024).toFixed(2)} KB`);
      console.log(`   - Duration: ${cacheResult.testDuration}ms`);
    } else {
      console.log('❌ Some images failed to cache:', cacheResult.failedImages);
      return false;
    }
    
    // Test 2: Zero-network navigation
    console.log('\n🚀 Testing zero-network navigation...');
    const navigationResult = await testZeroNetworkNavigation(testImageUrls);
    
    if (navigationResult) {
      console.log('✅ Zero-network navigation test passed!');
    } else {
      console.log('❌ Zero-network navigation test failed');
      return false;
    }
    
    // Test 3: Performance validation
    console.log('\n⚡ Running performance test...');
    const startTime = Date.now();
    
    // Simulate rapid photo navigation (100 switches)
    for (let i = 0; i < 100; i++) {
      const randomIndex = Math.floor(Math.random() * testImageUrls.length);
      const imageSource = imageCacheManager.getImageSource(testImageUrls[randomIndex]);
      
      // Verify we're always getting local files
      if (!imageSource.uri.startsWith('file://')) {
        console.log('❌ Network URI detected during rapid navigation');
        return false;
      }
    }
    
    const endTime = Date.now();
    console.log(`✅ 100 rapid image switches completed in ${endTime - startTime}ms`);
    
    // Test 4: Cache statistics
    console.log('\n📊 Final Cache Statistics:');
    const cacheInfo = imageCacheManager.getCacheInfo();
    console.log(`   - Total cached: ${cacheInfo.totalCached}`);
    console.log(`   - Loaded images: ${cacheInfo.loadedImages}`);
    console.log(`   - Local files: ${cacheInfo.localFiles}`);
    console.log(`   - Pending preloads: ${cacheInfo.pendingPreloads}`);
    
    const hitRate = cacheInfo.totalCached > 0 ? (cacheInfo.loadedImages / cacheInfo.totalCached) * 100 : 0;
    const localRate = cacheInfo.totalCached > 0 ? (cacheInfo.localFiles / cacheInfo.totalCached) * 100 : 0;
    
    console.log(`   - Cache hit rate: ${hitRate.toFixed(2)}%`);
    console.log(`   - Local cache rate: ${localRate.toFixed(2)}%`);
    
    console.log('\n🎉 All tests passed! Image caching system is working correctly.');
    return true;
    
  } catch (error) {
    console.error('🧪 Test failed with error:', error);
    return false;
  }
}

// For manual testing in development
if (__DEV__) {
  // You can call this function manually to test the cache system
  // runImageCacheTest().then(success => console.log('Test result:', success));
}
