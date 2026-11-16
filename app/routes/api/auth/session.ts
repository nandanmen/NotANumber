import type { Route } from "./+types/session";
import { getSession } from "./session.server";

/** Same contract as next-auth's `/api/auth/session`: the session, or `{}`. */
export async function loader({ request, context }: Route.LoaderArgs) {
  const session = await getSession(context.cloudflare.env, request);
  return Response.json(session ?? {}, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
