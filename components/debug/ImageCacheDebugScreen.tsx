import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Image
} from 'react-native';
import { runImageCacheTest } from '../scripts/test-image-cache';
import { imageCacheManager } from '../utils/imageCacheManager';
import { getCacheStatistics } from '../utils/testImageCache';

// Test images for validation
const testImages = [
  'https://picsum.photos/400/600?random=1',
  'https://picsum.photos/400/600?random=2',
  'https://picsum.photos/400/600?random=3',
  'https://picsum.photos/400/600?random=4',
  'https://picsum.photos/400/600?random=5'
];

/**
 * Debug screen for testing image cache functionality
 * Add this to your app temporarily to test the caching system
 */
export default function ImageCacheDebugScreen() {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cacheStats, setCacheStats] = useState<any>(null);

  const runTest = async () => {
    setIsRunningTest(true);
    setTestResults('Running comprehensive image cache test...\n');
    
    try {
      const success = await runImageCacheTest();
      const stats = getCacheStatistics();
      setCacheStats(stats);
      
      setTestResults(prev => prev + 
        `\n✅ Test completed successfully: ${success}\n` +
        `📊 Cache Statistics:\n` +
        `   - Total cached: ${stats.totalCached}\n` +
        `   - Loaded images: ${stats.loadedImages}\n` +
        `   - Local files: ${stats.localFiles}\n` +
        `   - Cache hit rate: ${stats.cacheHitRate.toFixed(2)}%\n` +
        `   - Local cache rate: ${stats.localCacheRate.toFixed(2)}%\n`
      );
      
      Alert.alert('Test Complete', success ? 'All tests passed!' : 'Some tests failed');
    } catch (error) {
      setTestResults(prev => prev + `\n❌ Test failed: ${error}\n`);
      Alert.alert('Test Failed', `Error: ${error}`);
    } finally {
      setIsRunningTest(false);
    }
  };

  const preloadTestImages = async () => {
    try {
      setTestResults('Preloading test images...\n');
      await imageCacheManager.preloadImages(testImages);
      const stats = getCacheStatistics();
      setCacheStats(stats);
      setTestResults(prev => prev + '✅ Test images preloaded successfully\n');
    } catch (error) {
      setTestResults(prev => prev + `❌ Failed to preload: ${error}\n`);
    }
  };

  const clearCache = async () => {
    try {
      await imageCacheManager.clearFileCache();
      setCacheStats(getCacheStatistics());
      setTestResults('🗑️ Cache cleared successfully\n');
    } catch (error) {
      setTestResults(prev => prev + `❌ Failed to clear cache: ${error}\n`);
    }
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % testImages.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + testImages.length) % testImages.length);
    }
  };

  const currentImageSource = imageCacheManager.getImageSource(testImages[currentImageIndex]);
  const isLocalFile = currentImageSource.uri.startsWith('file://');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Image Cache Debug</Text>
        <Text style={styles.subtitle}>Test the file-based image caching system</Text>
      </View>

      {/* Test Image Display */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Image Navigation</Text>
        <View style={styles.imageContainer}>
          <Image 
            source={currentImageSource}
            style={styles.testImage}
            onLoad={() => console.log('Image loaded:', currentImageSource.uri)}
            onError={(error) => console.log('Image error:', error)}
          />
          <View style={styles.imageInfo}>
            <Text style={styles.infoText}>
              Image {currentImageIndex + 1} of {testImages.length}
            </Text>
            <Text style={[styles.infoText, isLocalFile ? styles.successText : styles.errorText]}>
              Source: {isLocalFile ? 'Local File' : 'Network'}
            </Text>
            <Text style={styles.uriText} numberOfLines={2}>
              {currentImageSource.uri}
            </Text>
          </View>
        </View>
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateImage('prev')}
          >
            <Text style={styles.buttonText}>← Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateImage('next')}
          >
            <Text style={styles.buttonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cache Controls</Text>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={preloadTestImages}
        >
          <Text style={styles.buttonText}>Preload Test Images</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.testButton]} 
          onPress={runTest}
          disabled={isRunningTest}
        >
          <Text style={styles.buttonText}>
            {isRunningTest ? 'Running Test...' : 'Run Comprehensive Test'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearCache}
        >
          <Text style={styles.buttonText}>Clear Cache</Text>
        </TouchableOpacity>
      </View>

      {/* Cache Statistics */}
      {cacheStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cache Statistics</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Total Cached: {cacheStats.totalCached}</Text>
            <Text style={styles.statText}>Loaded Images: {cacheStats.loadedImages}</Text>
            <Text style={styles.statText}>Local Files: {cacheStats.localFiles}</Text>
            <Text style={styles.statText}>Hit Rate: {cacheStats.cacheHitRate.toFixed(2)}%</Text>
            <Text style={styles.statText}>Local Rate: {cacheStats.localCacheRate.toFixed(2)}%</Text>
          </View>
        </View>
      )}

      {/* Test Results */}
      {testResults ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          <ScrollView style={styles.resultsContainer}>
            <Text style={styles.resultsText}>{testResults}</Text>
          </ScrollView>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  testImage: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageInfo: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  successText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  uriText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    maxWidth: 250,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  navButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  testButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  statText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  resultsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    maxHeight: 200,
  },
  resultsText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
});
