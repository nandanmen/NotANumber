import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Static-assets incremental cache: no R2/KV. Fits a mostly prerendered site
 * without ISR-style revalidation. Tag cache + queue stay default "dummy".
 */
export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
});
