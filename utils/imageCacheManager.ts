import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

interface CachedImage {
  uri: string;
  localPath?: string;
  isLoaded: boolean;
  timestamp: number;
  size?: number;
}

class ImageCacheManager {
  private cache = new Map<string, CachedImage>();
  private preloadPromises = new Map<string, Promise<void>>();
  private cacheDirectory: string;
  
  constructor() {
    // Create a dedicated directory for cached images
    this.cacheDirectory = `${FileSystem.cacheDirectory}images/`;
    this.ensureCacheDirectoryExists();
  }
  
  private async ensureCacheDirectoryExists(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDirectory, { intermediates: true });
      }
    } catch (error) {
      console.warn('Failed to create cache directory:', error);
    }
  }
  
  private async generateCacheKey(uri: string): Promise<string> {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.MD5,
      uri
    );
    // Extract file extension from URL
    const extension = uri.split('.').pop()?.split('?')[0] || 'jpg';
    return `${hash}.${extension}`;
  }
  
  async preloadImage(uri: string): Promise<void> {
    // If already preloading, return the existing promise
    if (this.preloadPromises.has(uri)) {
      return this.preloadPromises.get(uri)!;
    }
    
    // If already cached and loaded, resolve immediately
    if (this.cache.has(uri) && this.cache.get(uri)!.isLoaded) {
      return Promise.resolve();
    }
    
    // Create new preload promise
    const preloadPromise = this.performPreload(uri);
    this.preloadPromises.set(uri, preloadPromise);
    
    try {
      await preloadPromise;
    } finally {
      // Clean up the promise after completion
      this.preloadPromises.delete(uri);
    }
  }
  
  private async performPreload(uri: string): Promise<void> {
    try {
      // Generate cache key for the file
      const cacheKey = await this.generateCacheKey(uri);
      const localPath = `${this.cacheDirectory}${cacheKey}`;
      
      // Check if file already exists locally
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (fileInfo.exists) {
        console.log('✅ Image already cached locally:', uri);
        this.cache.set(uri, {
          uri,
          localPath,
          isLoaded: true,
          timestamp: Date.now(),
          size: fileInfo.size
        });
        return;
      }
      
      // Download image to local storage
      console.log('📥 Downloading image to cache:', uri);
      const downloadResult = await FileSystem.downloadAsync(uri, localPath);
      
      if (downloadResult.status === 200) {
        // Mark as cached and loaded with local file
        this.cache.set(uri, {
          uri,
          localPath,
          isLoaded: true,
          timestamp: Date.now(),
          size: downloadResult.headers['content-length'] ? 
            parseInt(downloadResult.headers['content-length']) : undefined
        });
        
        console.log('✅ Image downloaded and cached successfully:', uri);
      } else {
        throw new Error(`Download failed with status: ${downloadResult.status}`);
      }
    } catch (error) {
      console.warn('❌ Failed to cache image:', uri, error);
      
      // Mark as cached but failed
      this.cache.set(uri, {
        uri,
        isLoaded: false,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }
  
  async preloadImages(uris: string[]): Promise<void> {
    const preloadPromises = uris.map(uri => 
      this.preloadImage(uri).catch(error => {
        console.warn('Failed to preload image:', uri, error);
        return undefined; // Continue with other images even if one fails
      })
    );
    
    await Promise.all(preloadPromises);
  }
  
  isImageLoaded(uri: string): boolean {
    const cached = this.cache.get(uri);
    return cached ? cached.isLoaded : false;
  }
  
  getImageSource(uri: string) {
    const cached = this.cache.get(uri);
    
    // If we have a locally cached file, use it instead of the network URI
    if (cached?.isLoaded && cached.localPath) {
      return {
        uri: cached.localPath,
        cache: 'force-cache' as const
      };
    }
    
    // Fallback to network URI with cache headers
    return {
      uri,
      cache: cached?.isLoaded ? 'force-cache' as const : 'default' as const,
      headers: {
        'Cache-Control': 'max-age=3600' // Cache for 1 hour
      }
    };
  }
  
  clearCache(): void {
    this.cache.clear();
    this.preloadPromises.clear();
  }
  
  async clearFileCache(): Promise<void> {
    try {
      // Delete all cached files
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDirectory);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.cacheDirectory);
        await this.ensureCacheDirectoryExists();
      }
      this.clearCache();
      console.log('🗑️ File cache cleared successfully');
    } catch (error) {
      console.warn('Failed to clear file cache:', error);
    }
  }
  
  async getCacheSize(): Promise<number> {
    try {
      let totalSize = 0;
      const cachedImages = Array.from(this.cache.values());
      for (const cached of cachedImages) {
        if (cached.size) {
          totalSize += cached.size;
        }
      }
      return totalSize;
    } catch (error) {
      console.warn('Failed to calculate cache size:', error);
      return 0;
    }
  }
  
  getCacheInfo() {
    return {
      totalCached: this.cache.size,
      loadedImages: Array.from(this.cache.values()).filter(img => img.isLoaded).length,
      pendingPreloads: this.preloadPromises.size,
      localFiles: Array.from(this.cache.values()).filter(img => img.localPath).length
    };
  }
}

// Export singleton instance
export const imageCacheManager = new ImageCacheManager();
