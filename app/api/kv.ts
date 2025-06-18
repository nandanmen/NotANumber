import { Redis } from '@upstash/redis';

export const kv = Redis.fromEnv();