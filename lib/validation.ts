import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const budgetSchema = z.object({
  monthlyNetIncome: z.number().min(0).default(0),
  incomeType: z.enum(["fixed", "variable"]).default("fixed"),
  startingBalance: z.number().min(0).default(0),
  currency: z.enum(["USD", "ARS", "EUR"]).default("USD"),
});

export const expenseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es obligatorio").max(100),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  category: z.enum(["fixed", "subscription", "leisure", "micro"]),
  dueDate: z.number().int().min(1).max(31).nullable().optional(),
  isPaid: z.boolean().default(false),
  iconName: z.string().optional().nullable(),
  notes: z.string().max(250).optional().nullable(),
});

export const extraIncomeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es obligatorio").max(100),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  date: z.string(),
});

export const syncPayloadSchema = z.object({
  budget: budgetSchema.optional(),
  expenses: z.array(expenseSchema).optional(),
  extraIncomes: z.array(extraIncomeSchema).optional(),
  preferences: z.object({
    currency: z.enum(["USD", "ARS", "EUR"]).default("USD"),
    theme: z.enum(["dark", "light"]).default("dark"),
    accent: z.string().default("lime"),
    locale: z.enum(["es", "en"]).default("es"),
  }).optional(),
});
