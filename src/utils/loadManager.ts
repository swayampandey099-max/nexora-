/**
 * Nexora Asset Load Manager
 * High-performance asynchronous image preloader, in-memory cache,
 * and CacheStorage manager for sub-10ms network latency.
 */

const CACHE_NAME = 'nexora-assets-v1';
const loadedMemoryCache = new Set<string>();

export class AssetLoadManager {
  /**
   * Asynchronously preloads an image into browser memory and CacheStorage
   */
  static async preloadImage(src: string): Promise<boolean> {
    if (!src) return false;
    if (loadedMemoryCache.has(src)) return true;

    return new Promise((resolve) => {
      // 1. Memory Image Preload
      const img = new Image();
      img.src = src;

      img.onload = async () => {
        loadedMemoryCache.add(src);

        // 2. CacheStorage persistence
        if ('caches' in window) {
          try {
            const cache = await caches.open(CACHE_NAME);
            const match = await cache.match(src);
            if (!match) {
              fetch(src, { mode: 'cors' })
                .then((res) => {
                  if (res.ok) cache.put(src, res.clone());
                })
                .catch(() => {});
            }
          } catch {
            // Ignore cache errors in restricted contexts
          }
        }

        resolve(true);
      };

      img.onerror = () => {
        resolve(false);
      };
    });
  }

  /**
   * Preloads an array of critical visual assets concurrently
   */
  static async preloadCriticalAssets(sources: string[]): Promise<void> {
    await Promise.allSettled(sources.map((src) => this.preloadImage(src)));
  }

  /**
   * Checks if an image is already cached in memory
   */
  static isCached(src: string): boolean {
    return loadedMemoryCache.has(src);
  }
}

export const loadManager = AssetLoadManager;
