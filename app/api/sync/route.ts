import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import db from "@/lib/prisma";
import { syncPayloadSchema } from "@/lib/validation";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [budget, expenses, extraIncomes, preferences] = await Promise.all([
    db.budget.findUnique({ where: { userId: user.id } }),
    db.expense.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    db.extraIncome.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    db.userPreferences.findUnique({ where: { userId: user.id } }),
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      membershipTier: user.membershipTier,
    },
    budget: budget || {
      monthlyNetIncome: 0,
      incomeType: "fixed",
      startingBalance: 0,
      currency: "USD",
    },
    expenses: expenses || [],
    extraIncomes: extraIncomes || [],
    preferences: preferences || {
      currency: "USD",
      theme: "dark",
      accent: "lime",
      locale: "es",
    },
    lastSyncAt: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = syncPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Carga de sincronización inválida", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { budget, expenses, extraIncomes, preferences } = parsed.data;

    await db.$transaction(async (tx) => {
      // 1. Sync Budget
      if (budget) {
        await tx.budget.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            monthlyNetIncome: budget.monthlyNetIncome,
            incomeType: budget.incomeType,
            startingBalance: budget.startingBalance,
            currency: budget.currency,
          },
          update: {
            monthlyNetIncome: budget.monthlyNetIncome,
            incomeType: budget.incomeType,
            startingBalance: budget.startingBalance,
            currency: budget.currency,
          },
        });
      }

      // 2. Sync Preferences
      if (preferences) {
        await tx.userPreferences.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            currency: preferences.currency,
            theme: preferences.theme,
            accent: preferences.accent,
            locale: preferences.locale,
          },
          update: {
            currency: preferences.currency,
            theme: preferences.theme,
            accent: preferences.accent,
            locale: preferences.locale,
          },
        });
      }

      // 3. Sync Expenses (Replace or Upsert user expenses)
      if (expenses && expenses.length > 0) {
        // Clear old expenses and insert updated list for deterministic 2-way sync
        await tx.expense.deleteMany({ where: { userId: user.id } });
        await tx.expense.createMany({
          data: expenses.map((item) => ({
            userId: user.id,
            title: item.title,
            amount: item.amount,
            category: item.category,
            dueDate: item.dueDate ?? null,
            isPaid: item.isPaid ?? false,
            iconName: item.iconName ?? null,
            notes: item.notes ?? null,
          })),
        });
      }

      // 4. Sync Extra Incomes
      if (extraIncomes && extraIncomes.length > 0) {
        await tx.extraIncome.deleteMany({ where: { userId: user.id } });
        await tx.extraIncome.createMany({
          data: extraIncomes.map((item) => ({
            userId: user.id,
            title: item.title,
            amount: item.amount,
            date: item.date,
          })),
        });
      }
    });

    // Fetch unified saved state
    const [savedBudget, savedExpenses, savedExtra, savedPrefs] = await Promise.all([
      db.budget.findUnique({ where: { userId: user.id } }),
      db.expense.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
      db.extraIncome.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
      db.userPreferences.findUnique({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      success: true,
      budget: savedBudget,
      expenses: savedExpenses,
      extraIncomes: savedExtra,
      preferences: savedPrefs,
      lastSyncAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Error procesando sincronización en la nube" },
      { status: 500 }
    );
  }
}
