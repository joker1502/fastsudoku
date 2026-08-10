import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/account";
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const supabase = await createClient();

  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: type as "signup" | "magiclink" | "recovery" | "invite",
      token_hash,
    });
    if (!verifyError) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/auth", request.url));
}
