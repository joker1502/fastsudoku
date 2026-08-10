"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckoutButton } from "@/components/checkout-button";

export function AccountContent() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/auth");
        return;
      }
      setUser(data.user);

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("payment") === "success") {
        router.replace("/account");
      }

      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const body = await res.json();
          setPremium(body.isPremium);
        }
      } catch {
        // silent
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return <p className="text-center text-sm text-gray-400">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  const onetimeId = process.env.NEXT_PUBLIC_CREEM_ONETIME_PRODUCT_ID ?? "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">
          {premium ? "Lifetime Access" : "Get Lifetime Access"}
        </h2>
        {premium ? (
          <div className="mt-3 space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              &#9733; Lifetime
            </span>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>&#10003; Watermark-free printing</li>
              <li>&#10003; Large print batches (10+)</li>
              <li>&#10003; PDF export</li>
              <li>&#10003; Ad-free experience</li>
            </ul>
            <p className="text-xs text-gray-400">Lifetime purchase — no expiration, no recurring fees.</p>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-gray-500">
              Unlock watermark-free printing, large print batches, and an ad-free experience — one payment, forever.
            </p>
            <CheckoutButton
              productId={onetimeId}
              className="mt-3 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Get Lifetime Access — $9.99
            </CheckoutButton>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">Sign out</h2>
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/");
            router.refresh();
          }}
          className="mt-3 rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
