import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { runComprehensiveTest, getCacheStatistics } from '../../utils/testImageCache';
import { imageCacheManager } from '../../utils/imageCacheManager';

export const ImageCacheTestScreen = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await runComprehensiveTest();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsRunning(false);
    }
  };

  const clearCache = async () => {
    await imageCacheManager.clearFileCache();
    setTestResults(null);
    console.log('Cache cleared');
  };

  const getStats = () => {
    const stats = getCacheStatistics();
    console.log('Current cache stats:', stats);
    return stats;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Image Cache Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isRunning && styles.buttonDisabled]} 
          onPress={runTest}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Running Tests...' : 'Run Comprehensive Test'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={clearCache}>
          <Text style={styles.buttonText}>Clear Cache</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={getStats}>
          <Text style={styles.buttonText}>Show Stats</Text>
        </TouchableOpacity>
      </View>

      {testResults && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          
          {testResults.error ? (
            <Text style={styles.errorText}>Error: {testResults.error}</Text>
          ) : (
            <>
              <Text style={styles.resultText}>
                ✅ Caching Success: {testResults.cachingSuccess ? 'PASS' : 'FAIL'}
              </Text>
              <Text style={styles.resultText}>
                🚀 Navigation Success: {testResults.navigationSuccess ? 'PASS' : 'FAIL'}
              </Text>
              <Text style={styles.resultText}>
                📊 Cache Hit Rate: {testResults.cacheStats.cacheHitRate.toFixed(2)}%
              </Text>
              <Text style={styles.resultText}>
                💾 Local Cache Rate: {testResults.cacheStats.localCacheRate.toFixed(2)}%
              </Text>
              <Text style={styles.resultText}>
                📁 Total Cached: {testResults.cacheStats.totalCached}
              </Text>
              <Text style={styles.resultText}>
                🗃️ Local Files: {testResults.cacheStats.localFiles}
              </Text>
            </>
          )}
        </View>
      )}
      
      <Text style={styles.instructions}>
        This test validates that:
        {'\n'}• Images are downloaded to local storage
        {'\n'}• Photo navigation uses zero network requests
        {'\n'}• File-based caching works reliably
        {'\n'}• Performance is optimal for rapid navigation
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
    fontFamily: 'monospace',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  instructions: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
