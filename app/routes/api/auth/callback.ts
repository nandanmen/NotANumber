import { redirect } from "react-router";
import type { Route } from "./+types/callback";
import { newSession, sessionCookie, stateCookie } from "./session.server";

type GitHubUser = {
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateCookieValue = stateCookie(env, request);
  const saved = (await stateCookieValue.parse(request.headers.get("Cookie"))) as {
    state: string;
    callbackUrl: string;
  } | null;

  if (!code || !saved || saved.state !== url.searchParams.get("state")) {
    return new Response("Invalid sign-in request", { status: 400 });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_ID,
      client_secret: env.GITHUB_SECRET,
      code,
      redirect_uri: `${url.origin}/api/auth/callback/github`,
    }),
  });
  const { access_token: accessToken } = (await tokenResponse.json()) as {
    access_token?: string;
  };
  if (!accessToken) {
    return new Response("GitHub sign-in failed", { status: 401 });
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "nan.fyi",
    },
  });
  if (!userResponse.ok) {
    return new Response("GitHub sign-in failed", { status: 401 });
  }
  const profile = (await userResponse.json()) as GitHubUser;

  const session = newSession(
    {
      name: profile.name,
      email: profile.email,
      username: profile.login,
      image: profile.avatar_url,
    },
    accessToken,
  );

  const headers = new Headers();
  headers.append("Set-Cookie", await sessionCookie(env, request).serialize(session));
  headers.append("Set-Cookie", await stateCookieValue.serialize("", { maxAge: 0 }));
  return redirect(saved.callbackUrl, { headers });
}
