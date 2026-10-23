import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import db from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const profile = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      membershipTier: true,
      createdAt: true,
      budget: true,
      preferences: true,
    },
  });

  return NextResponse.json({ user: profile });
}
