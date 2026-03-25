import { getCloudflareContext } from "@opennextjs/cloudflare";

const TOKEN_TTL_SEC = 60 * 60 * 24 * 7;

async function subscribeKv() {
	const { env } = await getCloudflareContext({ async: true });
	const kv = env.SUBSCRIBE_KV;
	if (!kv) {
		throw new Error("SUBSCRIBE_KV Workers KV binding is not configured");
	}
	return kv;
}

export async function setSubscribeToken(token: string, email: string) {
	const kv = await subscribeKv();
	await kv.put(`token:${token}`, email, { expirationTtl: TOKEN_TTL_SEC });
}

export async function getSubscribeEmailForToken(token: string) {
	const kv = await subscribeKv();
	return kv.get(`token:${token}`);
}

export async function deleteSubscribeToken(token: string) {
	const kv = await subscribeKv();
	await kv.delete(`token:${token}`);
}
