import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isPremium, entitlements } from "@/lib/subscription";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ isPremium: false, entitlements: [] }, { status: 401 });
  }

  const premium = await isPremium(user.id);
  const ents = entitlements(premium);

  return NextResponse.json({
    isPremium: premium,
    lifetimePremium: premium,
    entitlements: ents,
  });
}
