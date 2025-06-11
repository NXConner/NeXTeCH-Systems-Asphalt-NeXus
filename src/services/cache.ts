/**
 * Structure of a cache entry with value and expiry timestamp
 */
interface CacheEntry<T> {
  value: T;
  expiry: number;
  lastAccessed: number;
  size: number;
}

/**
 * A singleton caching service that provides in-memory caching with TTL support.
 * Automatically cleans up expired entries and manages memory usage.
 */
class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly maxSize = 50 * 1024 * 1024; // 50MB
  private currentSize = 0;
  private readonly cleanupInterval = 60 * 1000; // 1 minute

  private constructor() {
    // Start cleanup interval
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  /**
   * Gets the singleton instance of the cache
   */
  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  /**
   * Estimates the size of a value in bytes
   * @param value - The value to measure
   * @returns Estimated size in bytes
   */
  private estimateSize(value: unknown): number {
    try {
      const str = JSON.stringify(value);
      return new Blob([str]).size;
    } catch {
      return 0;
    }
  }

  /**
   * Stores a value in the cache
   * @param key - The cache key
   * @param value - The value to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const size = this.estimateSize(value);
    
    // Check if we need to make space
    if (this.currentSize + size > this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      value,
      expiry: Date.now() + ttl,
      lastAccessed: Date.now(),
      size
    };

    // Remove old entry if it exists
    const oldEntry = this.cache.get(key);
    if (oldEntry) {
      this.currentSize -= oldEntry.size;
    }

    this.cache.set(key, entry);
    this.currentSize += size;
  }

  /**
   * Retrieves a value from the cache
   * @param key - The cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiry) {
      this.delete(key);
      return null;
    }

    // Update last accessed time
    entry.lastAccessed = now;
    return entry.value;
  }

  /**
   * Removes a value from the cache
   * @param key - The cache key
   */
  delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
    }
  }

  /**
   * Clears all values from the cache
   */
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  /**
   * Internal method to clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.delete(key);
      }
    }
  }

  /**
   * Evicts the oldest entries to make space
   */
  private evictOldest(): void {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    for (const [key] of entries) {
      if (this.currentSize <= this.maxSize * 0.8) { // Keep 80% of max size
        break;
      }
      this.delete(key);
    }
  }

  /**
   * Gets the current cache size in bytes
   */
  getSize(): number {
    return this.currentSize;
  }

  /**
   * Gets the number of entries in the cache
   */
  getEntryCount(): number {
    return this.cache.size;
  }

  /**
   * Generates a cache key from a prefix and arguments
   * @param prefix - The key prefix
   * @param args - Arguments to include in the key
   * @returns A string key
   */
  static generateKey(prefix: string, ...args: unknown[]): string {
    return `${prefix}:${args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(':')}`;
  }
}

export const cache = Cache.getInstance(); 