import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Datos inválidos" },
        { status: 400 }
      );
    }

    const { email, name, password } = parsed.data;
    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este correo" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user with default budget & preferences
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        budget: {
          create: {
            monthlyNetIncome: 0,
            incomeType: "fixed",
            startingBalance: 0,
            currency: "USD",
          },
        },
        preferences: {
          create: {
            currency: "USD",
            theme: "dark",
            accent: "lime",
            locale: "es",
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        membershipTier: true,
        createdAt: true,
      },
    });

    const { token, expiresAt } = await createSession(user.id);

    return NextResponse.json({
      user,
      token,
      expiresAt,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Error interno al crear la cuenta" },
      { status: 500 }
    );
  }
}
