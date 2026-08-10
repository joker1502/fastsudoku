import { Checkout } from "@creem_io/nextjs";

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: false,
  defaultSuccessUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/account?payment=success`,
});
