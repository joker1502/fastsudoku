"use client";

import { createClient } from "@/lib/supabase/client";

export function CheckoutButton({
  productId,
  children,
  className,
}: {
  productId: string;
  children: React.ReactNode;
  className?: string;
}) {
  async function handleClick() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const origin = window.location.origin;
    const userId = user?.id;
    const successUrl = `${origin}/account?payment=success`;

    const url = new URL(`${origin}/checkout`);
    url.searchParams.set("productId", productId);
    url.searchParams.set("successUrl", successUrl);
    if (userId) {
      url.searchParams.set("metadata", JSON.stringify({ userId }));
    }
    window.location.href = url.toString();
  }

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
