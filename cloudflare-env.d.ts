/// <reference types="@cloudflare/workers-types" />

declare global {
	interface CloudflareEnv {
		SUBSCRIBE_KV: KVNamespace;
	}
}

export {};
