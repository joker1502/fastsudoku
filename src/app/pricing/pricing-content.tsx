"use client";

import { CheckoutButton } from "@/components/checkout-button";

export function PricingContent() {
  const onetimeId = process.env.NEXT_PUBLIC_CREEM_ONETIME_PRODUCT_ID ?? "";

  const item = (included: boolean, text: string) => (
    <li className="flex items-center gap-2">
      <span className={included ? "text-blue-600" : "text-gray-300"}>
        &#10003;
      </span>
      {text}
    </li>
  );

  return (
    <>
      {/* Free */}
      <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Free</h2>
        <p className="mt-1 text-sm text-gray-500">
          Everything you need to play and learn.
        </p>
        <p className="mt-4">
          <span className="text-3xl font-bold">$0</span>
        </p>
        <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-600">
          {item(true, "Sudoku hints (unlimited)")}
          {item(true, "All puzzle sizes & variants")}
          {item(true, "Puzzle maker (up to 3/batch)")}
          {item(false, "Watermark-free printing")}
          {item(false, "Large print batches (10+)")}
          {item(false, "Ad-free experience")}
        </ul>
        <p className="mt-5 text-center text-xs text-gray-400">
          No sign-up needed
        </p>
      </div>

      {/* One-time */}
      <div className="relative flex flex-col rounded-xl border-2 border-blue-600 bg-white p-6">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
          Lifetime
        </span>
        <h2 className="text-lg font-semibold">One-time</h2>
        <p className="mt-1 text-sm text-gray-500">
          Pay once, unlock everything forever.
        </p>
        <p className="mt-4">
          <span className="text-3xl font-bold">$9.99</span>
        </p>
        <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-600">
          {item(true, "Watermark-free printing")}
          {item(true, "Large print batches (up to 10)")}
          {item(true, "PDF export")}
          {item(true, "Ad-free experience")}
        </ul>
        <CheckoutButton
          productId={onetimeId}
          className="mt-5 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Get Lifetime Access
        </CheckoutButton>
      </div>
    </>
  );
}
