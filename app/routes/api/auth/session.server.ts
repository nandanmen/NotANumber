import { createCookie } from "react-router";

/**
 * GitHub sign-in for the SVG paths comments, replacing next-auth. The session
 * is kept in a signed, HTTP-only cookie and has the same shape next-auth's
 * session callback produced, so the client code is unchanged.
 */

export type Session = {
  user: {
    name: string | null;
    email: string | null;
    username: string;
    image: string;
  };
  expires: string;
  access_token: string;
};

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days, next-auth's default

const isSecure = (request: Request) => new URL(request.url).protocol === "https:";

export const sessionCookie = (env: Env, request: Request) =>
  createCookie("nan_session", {
    secrets: [env.AUTH_SECRET],
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure(request),
    path: "/",
    maxAge: MAX_AGE,
  });

export const stateCookie = (env: Env, request: Request) =>
  createCookie("nan_oauth_state", {
    secrets: [env.AUTH_SECRET],
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure(request),
    path: "/api/auth",
    maxAge: 60 * 10,
  });

export async function getSession(env: Env, request: Request): Promise<Session | null> {
  const session = (await sessionCookie(env, request).parse(
    request.headers.get("Cookie"),
  )) as Session | null;
  if (!session || new Date(session.expires).getTime() < Date.now()) return null;
  return session;
}

export function newSession(
  user: Session["user"],
  accessToken: string,
): Session {
  return {
    user,
    access_token: accessToken,
    expires: new Date(Date.now() + MAX_AGE * 1000).toISOString(),
  };
}

/** Only allow redirects back to this site. */
export function safeCallbackUrl(request: Request, callbackUrl: string | null) {
  const origin = new URL(request.url).origin;
  if (!callbackUrl) return `${origin}/`;
  try {
    const url = new URL(callbackUrl, origin);
    return url.origin === origin ? url.toString() : `${origin}/`;
  } catch {
    return `${origin}/`;
  }
}
