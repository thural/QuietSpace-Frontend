/**
 * Feed Feature Types
 * 
 * Common types used across the feed feature
 */

export type ResId = string | number;

export interface CacheOptions {
  ttl?: number;
}

export interface ICacheProvider {
  get(key: string): Promise<any>;
  set(key: string, value: any, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
}
