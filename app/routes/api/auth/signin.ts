import { redirect } from "react-router";
import type { Route } from "./+types/signin";
import { safeCallbackUrl, stateCookie } from "./session.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const callbackUrl = safeCallbackUrl(request, url.searchParams.get("callbackUrl"));

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.GITHUB_ID);
  authorize.searchParams.set("redirect_uri", `${url.origin}/api/auth/callback/github`);
  authorize.searchParams.set("scope", "read:user user:email");
  authorize.searchParams.set("state", state);

  return redirect(authorize.toString(), {
    headers: {
      "Set-Cookie": await stateCookie(env, request).serialize({ state, callbackUrl }),
    },
  });
}
