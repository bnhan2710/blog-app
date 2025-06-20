export interface ICacheService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  clear(): Promise<void>;

  // Redis specific methods
  zAdd(key: string, score: number, member: string): Promise<void>;
  zRange(key: string, start: number, stop: number): Promise<string[]>;
  zRemRangeByScore(key: string, min: number, max: number): Promise<void>;
}