import { Webhook } from "@creem_io/nextjs";
import { prisma } from "@/lib/prisma";

const ONETIME_PRODUCT_ID = process.env.NEXT_PUBLIC_CREEM_ONETIME_PRODUCT_ID!;

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  onCheckoutCompleted: async (data) => {
    const checkout = data as unknown as {
      product_id: string;
      metadata: { userId?: string };
    };

    if (checkout.product_id !== ONETIME_PRODUCT_ID) return;

    const userId = checkout.metadata?.userId;
    if (!userId) return;

    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email: `${userId}@creem.io` },
      update: {},
    });

    await prisma.user.update({
      where: { id: userId },
      data: { lifetimePremium: true },
    });
  },
});
