import { redirect } from "react-router";
import { getLoops } from "../loops";
import type { Route } from "./+types/route";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return new Response(null, { status: 401 });
  }

  const email = await env.SUBSCRIBE_TOKENS.get(`token:${token}`);
  if (!email) {
    return new Response(null, { status: 401 });
  }

  await env.SUBSCRIBE_TOKENS.delete(`token:${token}`);
  await getLoops(env).updateContact(email, { subscribed: true });

  url.searchParams.delete("token");
  url.searchParams.set("confirmed", "true");
  url.pathname = "/";
  return redirect(url.toString(), 307);
}
