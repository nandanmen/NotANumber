import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { kv } from "../kv";
import { APIError } from "loops";
import { loops } from "../loops";

const CONFIRM_EMAIL_ID = "cmc14q1uu0ylizl0i59n1sv7l";

export async function POST(request: NextRequest) {
    const email: string | null = request.nextUrl.searchParams.get("email");
    if (!email) {
        return NextResponse.json(
            { code: "missing_email", error: "Email is required" },
            { status: 400 }
        );
    }

    try {
        await loops.createContact(email, {
            subscribed: false,
        });
    } catch (error) {
        // @ts-ignore
        if (error instanceof APIError && error.json.message === "Email already on list.") {
            return NextResponse.json(
                { code: "email_already_exists", error: "Email already exists" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { code: "loops_error", error: 'An unknown error occurred' },
            { status: 500 }
        );
    }

    const token = crypto.randomBytes(12).toString("hex");
    await kv.set(`token:${token}`, email, { ex: 60 * 60 * 24 * 7 });

    await loops.sendTransactionalEmail({
        transactionalId: CONFIRM_EMAIL_ID,
        email,
        dataVariables: {
            confirmation_link: `${request.nextUrl.origin}/api/verify?token=${token}`,
        }
    });

    return new Response(null, { status: 201 });
}