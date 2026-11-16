import { redirect } from "react-router";
import { getKv } from "../kv";
import { getLoops } from "../loops";
import type { Route } from "./+types/route";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return new Response(null, { status: 401 });
  }

  const kv = getKv(env);
  const email = await kv.get<string>(`token:${token}`);
  if (!email) {
    return new Response(null, { status: 401 });
  }

  await kv.del(`token:${token}`);
  await getLoops(env).updateContact(email, { subscribed: true });

  url.searchParams.delete("token");
  url.searchParams.set("confirmed", "true");
  url.pathname = "/";
  return redirect(url.toString(), 307);
}
