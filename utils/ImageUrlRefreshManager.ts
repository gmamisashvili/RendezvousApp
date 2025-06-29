import { photoService } from '../services';

/**
 * Utility to detect and handle expired Azure Blob Storage SAS URLs
 */
export class ImageUrlRefreshManager {
  private static urlCache = new Map<string, string>();

  /**
   * Check if a URL appears to be an expired Azure SAS URL
   */
  static isExpiredAzureUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    // Check if it's an Azure blob URL with SAS token
    if (!url.includes('blob.core.windows.net') || !url.includes('se=')) {
      return false;
    }

    try {
      const urlObj = new URL(url);
      const expiryParam = urlObj.searchParams.get('se');
      
      if (expiryParam) {
        const expiryDate = new Date(expiryParam);
        const now = new Date();
        return expiryDate < now;
      }
    } catch (error) {
      console.warn('Failed to parse URL for expiry check:', error);
    }

    return false;
  }

  /**
   * Attempt to refresh an expired URL by extracting the photo ID from the URL
   */
  static async refreshExpiredUrl(originalUrl: string): Promise<string | null> {
    try {
      // Check cache first
      const cached = this.urlCache.get(originalUrl);
      if (cached) {
        return cached;
      }

      // Try to extract photo ID from the URL path
      // Azure blob URLs typically have format: https://account.blob.core.windows.net/container/filename
      const urlObj = new URL(originalUrl);
      const pathParts = urlObj.pathname.split('/');
      const filename = pathParts[pathParts.length - 1];
      
      // If the filename looks like a photo ID or contains one, we might be able to refresh
      // This is a best-effort approach since we don't have the actual photo ID
      const photoIdMatch = filename.match(/(\d+)/);
      
      if (photoIdMatch) {
        const photoId = parseInt(photoIdMatch[1]);
        const response = await photoService.refreshPhotoUrl(photoId);
        
        if (response.success && response.data) {
          // Cache the new URL
          this.urlCache.set(originalUrl, response.data);
          return response.data;
        }
      }

      return null;
    } catch (error) {
      console.warn('Failed to refresh expired URL:', error);
      return null;
    }
  }

  /**
   * Clear the URL cache
   */
  static clearCache(): void {
    this.urlCache.clear();
  }
}
