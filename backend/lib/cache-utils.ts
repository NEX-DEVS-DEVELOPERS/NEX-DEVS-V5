type CacheItem<T> = {
  data: T;
  timestamp: number;
};

type CacheOptions = {
  ttl?: number; // Time to live in milliseconds
  tags?: string[]; // For invalidating related cache items
};

class DataCache {
  private static instance: DataCache;
  private cache: Map<string, CacheItem<any>> = new Map();
  private tagMap: Map<string, Set<string>> = new Map(); // Maps tags to keys
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache();
    }
    return DataCache.instance;
  }

  /**
   * Set data in the cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const { ttl = this.DEFAULT_TTL, tags = [] } = options;
    
    // Store the data with timestamp
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
    
    // Add the key to each tag's set
    tags.forEach(tag => {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set());
      }
      this.tagMap.get(tag)?.add(key);
    });
  }

  /**
   * Get data from the cache if it exists and is not expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    // Return null if item doesn't exist or is expired
    if (!item || item.timestamp < Date.now()) {
      if (item) {
        // Remove expired item
        this.cache.delete(key);
      }
      return null;
    }
    
    return item.data;
  }

  /**
   * Remove a specific item from the cache
   */
  delete(key: string): void {
    this.cache.delete(key);
    
    // Clean up tag references
    this.tagMap.forEach((keys, tag) => {
      if (keys.has(key)) {
        keys.delete(key);
        if (keys.size === 0) {
          this.tagMap.delete(tag);
        }
      }
    });
  }

  /**
   * Invalidate all cache items with the given tag
   */
  invalidateByTag(tag: string): void {
    const keys = this.tagMap.get(tag);
    if (keys) {
      keys.forEach(key => {
        this.cache.delete(key);
      });
      this.tagMap.delete(tag);
    }
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
    this.tagMap.clear();
  }
}

export const dataCache = DataCache.getInstance();

// Helper for fetching with cache
export async function fetchWithCache<T>(
  url: string, 
  options: RequestInit = {}, 
  cacheOptions: CacheOptions = {}
): Promise<T> {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;
  const cachedData = dataCache.get<T>(cacheKey);
  
  if (cachedData !== null) {
    return cachedData;
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}`);
  }
  
  const data = await response.json();
  dataCache.set(cacheKey, data, cacheOptions);
  return data;
} 