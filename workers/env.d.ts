// Secrets set with `wrangler secret put` (see .dev.vars.example). They aren't
// in wrangler.json, so `wrangler types` doesn't know about them.
declare namespace Cloudflare {
  interface Env {
    LOOPS_API_KEY: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  }
}
