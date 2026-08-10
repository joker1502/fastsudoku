import type { Metadata } from "next";
import { AccountContent } from "./account-content";

export const metadata: Metadata = {
  title: "Account - fastsudoku",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <AccountContent />
    </div>
  );
}
