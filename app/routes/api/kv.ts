import { Redis } from "@upstash/redis/cloudflare";

export const getKv = (env: Env) =>
  new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
