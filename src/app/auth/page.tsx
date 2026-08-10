import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = {
  title: "Sign In - fastsudoku",
};

export default function AuthPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Sign in to fastsudoku</h1>
        <p className="mt-2 text-sm text-gray-500">
          Unlock premium features and remove the print watermark.
        </p>
      </div>
      <div className="mt-8">
        <Suspense>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
