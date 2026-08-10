import type { Metadata } from "next";
import { PricingContent } from "./pricing-content";

export const metadata: Metadata = {
  title: "Pricing - fastsudoku",
  description:
    "Print watermark-free, generate large batches, and go ad-free with a one-time lifetime purchase.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Simple pricing</h1>
        <p className="mt-3 text-gray-500">
          One payment, lifetime access. No subscriptions. No hidden fees.
        </p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <PricingContent />
      </div>
    </div>
  );
}
