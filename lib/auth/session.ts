import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import db from "@/lib/prisma";

const COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-vout_session" : "vout_session";
const SESSION_TTL_DAYS = 30;

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({
    data: {
      id: sha256(token),
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { token, expiresAt };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await db.session.deleteMany({
      where: { id: sha256(token) },
    }).catch(() => {});
    cookieStore.delete(COOKIE_NAME);
  }
}

export async function getSessionUser(req?: Request) {
  let token: string | undefined;

  // 1. Check Bearer token from Mobile App Authorization header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Fallback to Cookie for Web Browser
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      // In standalone route or middleware without cookies
    }
  }

  if (!token) return null;

  const session = await db.session.findUnique({
    where: { id: sha256(token) },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          membershipTier: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}
