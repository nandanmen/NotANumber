import { NextRequest, NextResponse } from "next/server";
import { kv } from "../kv";
import { loops } from "../loops";

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
        return new Response(null, { status: 401 });
    }

    const email = await kv.get<string>(`token:${token}`);
    if (!email) {
        return new Response(null, { status: 401 });
    }

    await kv.del(`token:${token}`);
    await loops.updateContact(email, { subscribed: true });

    const redirectTo = request.nextUrl.clone();
    redirectTo.searchParams.delete("token");
    redirectTo.searchParams.set('confirmed', 'true')
    redirectTo.pathname = "/";
    return NextResponse.redirect(redirectTo);
}