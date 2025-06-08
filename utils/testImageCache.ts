import { imageCacheManager } from './imageCacheManager';
import * as FileSystem from 'expo-file-system';

export interface CacheTestResult {
  success: boolean;
  totalImages: number;
  cachedLocally: number;
  failedImages: string[];
  cacheSize: number;
  testDuration: number;
}

/**
 * Test the image cache system to ensure images are properly downloaded
 * and available locally for zero-network navigation
 */
export async function testImageCaching(imageUrls: string[]): Promise<CacheTestResult> {
  const startTime = Date.now();
  const failedImages: string[] = [];
  
  console.log('🧪 Starting image cache test with', imageUrls.length, 'images');
  
  try {
    // Clear any existing cache for clean test
    await imageCacheManager.clearFileCache();
    
    // Preload all images
    await imageCacheManager.preloadImages(imageUrls);
    
    // Verify each image is cached locally
    let cachedLocally = 0;
    for (const url of imageUrls) {
      const imageSource = imageCacheManager.getImageSource(url);
      
      // Check if we got a local file path (file:// URI)
      if (imageSource.uri.startsWith('file://')) {
        const fileInfo = await FileSystem.getInfoAsync(imageSource.uri);
        if (fileInfo.exists) {
          cachedLocally++;
          console.log('✅ Local cache verified for:', url);
        } else {
          failedImages.push(url);
          console.log('❌ Local file missing for:', url);
        }
      } else {
        failedImages.push(url);
        console.log('❌ No local cache for:', url);
      }
    }
    
    const cacheSize = await imageCacheManager.getCacheSize();
    const testDuration = Date.now() - startTime;
    
    const result: CacheTestResult = {
      success: failedImages.length === 0,
      totalImages: imageUrls.length,
      cachedLocally,
      failedImages,
      cacheSize,
      testDuration
    };
    
    console.log('🧪 Cache test completed:', result);
    return result;
    
  } catch (error) {
    console.error('🧪 Cache test failed:', error);
    return {
      success: false,
      totalImages: imageUrls.length,
      cachedLocally: 0,
      failedImages: imageUrls,
      cacheSize: 0,
      testDuration: Date.now() - startTime
    };
  }
}

/**
 * Test navigation between cached images to ensure zero network requests
 */
export async function testZeroNetworkNavigation(imageUrls: string[]): Promise<boolean> {
  console.log('🧪 Testing zero-network navigation...');
  
  try {
    // First ensure all images are cached
    const cacheResult = await testImageCaching(imageUrls);
    if (!cacheResult.success) {
      console.log('❌ Caching failed, navigation test aborted');
      return false;
    }
    
    // Simulate rapid navigation through all images
    for (let i = 0; i < imageUrls.length; i++) {
      const imageSource = imageCacheManager.getImageSource(imageUrls[i]);
      
      // Verify we're using local file
      if (!imageSource.uri.startsWith('file://')) {
        console.log('❌ Network URI detected during navigation:', imageUrls[i]);
        return false;
      }
      
      // Simulate rapid navigation
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log('✅ Zero-network navigation test passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Navigation test failed:', error);
    return false;
  }
}

/**
 * Get detailed cache statistics
 */
export function getCacheStatistics() {
  const info = imageCacheManager.getCacheInfo();
  
  return {
    ...info,
    cacheHitRate: info.totalCached > 0 ? (info.loadedImages / info.totalCached) * 100 : 0,
    localCacheRate: info.totalCached > 0 ? (info.localFiles / info.totalCached) * 100 : 0
  };
}

// Mock URLs for testing
const mockImageUrls = [
  'https://picsum.photos/400/600?random=1',
  'https://picsum.photos/400/600?random=2',
  'https://picsum.photos/400/600?random=3',
  'https://picsum.photos/400/600?random=4',
  'https://picsum.photos/400/600?random=5',
];

/**
 * Comprehensive test suite for the image cache system
 */
export async function runComprehensiveTest() {
  console.log('🧪 Starting Comprehensive Image Cache Test');
  console.log('==========================================');
  
  try {
    // Test 1: File-based caching
    console.log('\n📥 Testing file-based image caching...');
    const cacheResult = await testImageCaching(mockImageUrls);
    
    if (cacheResult.success) {
      console.log('✅ All images successfully cached locally');
      console.log(`📊 Cache size: ${(cacheResult.cacheSize / 1024).toFixed(2)} KB`);
    } else {
      console.log('❌ Some images failed to cache:', cacheResult.failedImages);
    }
    
    // Test 2: Zero-network navigation
    console.log('\n🚀 Testing zero-network navigation...');
    const navigationResult = await testZeroNetworkNavigation(mockImageUrls);
    
    // Test 3: Cache statistics
    console.log('\n📊 Cache Statistics:');
    const stats = getCacheStatistics();
    console.log('- Total cached:', stats.totalCached);
    console.log('- Loaded images:', stats.loadedImages);
    console.log('- Local files:', stats.localFiles);
    console.log('- Cache hit rate:', stats.cacheHitRate.toFixed(2) + '%');
    console.log('- Local cache rate:', stats.localCacheRate.toFixed(2) + '%');
    
    // Test 4: Performance test
    console.log('\n⚡ Performance test - rapid navigation simulation...');
    const startTime = Date.now();
    for (let i = 0; i < 100; i++) {
      const randomIndex = Math.floor(Math.random() * mockImageUrls.length);
      const imageSource = imageCacheManager.getImageSource(mockImageUrls[randomIndex]);
      // Verify it's a local file
      if (!imageSource.uri.startsWith('file://')) {
        console.log('❌ Network URI found during rapid navigation');
        break;
      }
    }
    const endTime = Date.now();
    console.log(`✅ 100 rapid image switches in ${endTime - startTime}ms`);
    
    return {
      cachingSuccess: cacheResult.success,
      navigationSuccess: navigationResult,
      cacheStats: stats
    };
    
  } catch (error) {
    console.error('🧪 Comprehensive test failed:', error);
    return {
      cachingSuccess: false,
      navigationSuccess: false,
      cacheStats: getCacheStatistics()
    };
  }
}
