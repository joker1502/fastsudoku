import { prisma } from "@/lib/prisma";

export async function isPremium(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.lifetimePremium ?? false;
}

export function entitlements(lifetimePremium: boolean): string[] {
  return lifetimePremium ? ["print-pro", "ad-free"] : [];
}
