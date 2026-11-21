import { APIError } from "loops";
import { getLoops } from "../loops";
import type { Route } from "./+types/route";

const CONFIRM_EMAIL_ID = "cmc14q1uu0ylizl0i59n1sv7l";

const randomToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const { env } = context.cloudflare;
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  if (!email) {
    return Response.json(
      { code: "missing_email", error: "Email is required" },
      { status: 400 },
    );
  }

  const loops = getLoops(env);
  try {
    await loops.createContact(email, {
      subscribed: false,
    });
  } catch (error) {
    if (
      error instanceof APIError &&
      (error.json as { message?: string }).message === "Email already on list."
    ) {
      return Response.json(
        { code: "email_already_exists", error: "Email already exists" },
        { status: 409 },
      );
    }
    return Response.json(
      { code: "loops_error", error: "An unknown error occurred" },
      { status: 500 },
    );
  }

  const token = randomToken();
  await env.SUBSCRIBE_TOKENS.put(`token:${token}`, email, {
    expirationTtl: 60 * 60 * 24 * 7,
  });

  await loops.sendTransactionalEmail({
    transactionalId: CONFIRM_EMAIL_ID,
    email,
    dataVariables: {
      confirmation_link: `${url.origin}/api/verify?token=${token}`,
    },
  });

  return new Response(null, { status: 201 });
}
