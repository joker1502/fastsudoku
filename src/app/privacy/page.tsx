import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How fastsudoku handles your data: no accounts, no personal information collected, and how cookies and advertising work on this site.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-7 pb-14">
      <h1 className="mb-2 text-[1.6rem] font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mb-6 text-sm text-gray-500">Last updated: August 2026</p>
      <div className="prose">
        <p>
          This privacy policy explains what information this sudoku site
          collects and how it is used. Using this site is free and requires no
          account.
        </p>
        <h2>What we collect</h2>
        <p>
          We do not collect, store, or process any personal information. The
          site runs entirely in your browser: puzzles, solutions, and timers
          are generated and kept locally on your device. We do not offer
          accounts, and we do not ask for your name, email, or location.
        </p>
        <h2>Advertising</h2>
        <p>
          This site is funded by advertising served through third-party ad
          networks such as Google AdSense. These partners may use cookies and
          similar technologies to serve ads based on your visits to this and
          other websites. For Google&apos;s practices and opt-out options,
          see{" "}
          <Link href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            Google&apos;s advertising page
          </Link>.
        </p>
        <h2>Cookies</h2>
        <p>
          We do not set any cookies ourselves. Cookies may be set by
          third-party ad partners as described above. You can control or delete
          cookies through your browser settings.
        </p>
        <h2>Analytics</h2>
        <p>
          Aggregate, non-identifying usage statistics (such as page views) may
          be collected by our hosting or ad partners. This information cannot
          be used to identify you.
        </p>
        <h2>Contact</h2>
        <p>
          If you have questions about this policy, contact us via the{" "}
          <Link href="/">homepage</Link>.
        </p>
      </div>
    </div>
  );
}
