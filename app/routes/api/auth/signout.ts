import type { Route } from "./+types/signout";
import { sessionCookie } from "./session.server";

export async function action({ request, context }: Route.ActionArgs) {
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": await sessionCookie(context.cloudflare.env, request).serialize("", {
        maxAge: 0,
      }),
    },
  });
}
