"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { BudgetSummaryCard } from "@/components/BudgetSummaryCard";
import { CategoryDistributionBar } from "@/components/CategoryDistributionBar";
import { FixedBillsSection } from "@/components/FixedBillsSection";
import { SubscriptionsSection } from "@/components/SubscriptionsSection";
import { ExtraIncomeSection } from "@/components/ExtraIncomeSection";
import { RecentExpensesSection } from "@/components/RecentExpensesSection";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { AddExtraIncomeModal } from "@/components/AddExtraIncomeModal";
import { EditBudgetModal } from "@/components/EditBudgetModal";
import { MonthRolloverModal } from "@/components/MonthRolloverModal";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  membershipTier?: string;
}

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: "fixed" | "subscription" | "leisure" | "micro";
  dueDate?: number | null;
  isPaid: boolean;
  notes?: string | null;
}

interface ExtraIncomeItem {
  id: string;
  title: string;
  amount: number;
  date: string;
}

interface BudgetState {
  monthlyNetIncome: number;
  incomeType: "fixed" | "variable";
  startingBalance: number;
  currency: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Core Data
  const [budget, setBudget] = useState<BudgetState>({
    monthlyNetIncome: 650000,
    incomeType: "fixed",
    startingBalance: 0,
    currency: "ARS",
  });
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: "1", title: "Alquiler Depto", amount: 220000, category: "fixed", dueDate: 5, isPaid: true },
    { id: "2", title: "Luz Edenor", amount: 24000, category: "fixed", dueDate: 12, isPaid: false },
    { id: "3", title: "Fibertel 300Mb", amount: 26500, category: "fixed", dueDate: 15, isPaid: false },
    { id: "4", title: "Netflix 4K", amount: 11000, category: "subscription", dueDate: 7, isPaid: true },
    { id: "5", title: "Spotify Familiar", amount: 5200, category: "subscription", dueDate: 14, isPaid: false },
    { id: "6", title: "Gimnasio", amount: 35000, category: "subscription", dueDate: 5, isPaid: true },
    { id: "7", title: "Cena amigos", amount: 18500, category: "leisure", isPaid: true },
    { id: "8", title: "Café de paso", amount: 3800, category: "micro", isPaid: true },
  ]);
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncomeItem[]>([
    { id: "1", title: "Bono freelance diseño", amount: 80000, date: "20 Oct" },
  ]);

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseModalCategory, setExpenseModalCategory] = useState<"fixed" | "subscription" | "leisure" | "micro">("fixed");
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isRolloverModalOpen, setIsRolloverModalOpen] = useState(false);

  // Sync with cloud helper
  const syncWithCloud = useCallback(async (currentBudget = budget, currentExpenses = expenses, currentExtras = extraIncomes) => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: currentBudget,
          expenses: currentExpenses,
          extraIncomes: currentExtras,
          preferences: {
            currency: currentBudget.currency,
            theme: "dark",
            accent: "lime",
            locale: "es",
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLastSyncTime(data.lastSyncAt);
      }
    } catch {
      // offline silent catch
    } finally {
      setIsSyncing(false);
    }
  }, [user, budget, expenses, extraIncomes]);

  // Initial fetch
  useEffect(() => {
    async function loadInitial() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const { user: userData } = await meRes.json();
          setUser(userData);

          // Fetch user cloud data
          const syncRes = await fetch("/api/sync");
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData.budget) {
              setBudget({
                monthlyNetIncome: syncData.budget.monthlyNetIncome || 0,
                incomeType: (syncData.budget.incomeType as any) || "fixed",
                startingBalance: syncData.budget.startingBalance || 0,
                currency: syncData.budget.currency || "ARS",
              });
            }
            if (syncData.expenses && syncData.expenses.length > 0) {
              setExpenses(syncData.expenses);
            }
            if (syncData.extraIncomes) {
              setExtraIncomes(syncData.extraIncomes);
            }
            setLastSyncTime(syncData.lastSyncAt);
          }
        }
      } catch {
        // Fallback to demo mode
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // Filtered lists
  const fixedBills = useMemo(() => expenses.filter((e) => e.category === "fixed"), [expenses]);
  const subscriptions = useMemo(() => expenses.filter((e) => e.category === "subscription"), [expenses]);
  const leisureAndMicro = useMemo(() => expenses.filter((e) => e.category === "leisure" || e.category === "micro"), [expenses]);

  // Calculations
  const totalExtra = useMemo(() => extraIncomes.reduce((acc, c) => acc + c.amount, 0), [extraIncomes]);
  const fixedTotal = useMemo(() => fixedBills.reduce((acc, c) => acc + c.amount, 0), [fixedBills]);
  const subsTotal = useMemo(() => subscriptions.reduce((acc, c) => acc + c.amount, 0), [subscriptions]);
  const leisureTotal = useMemo(() => expenses.filter((e) => e.category === "leisure").reduce((acc, c) => acc + c.amount, 0), [expenses]);
  const microTotal = useMemo(() => expenses.filter((e) => e.category === "micro").reduce((acc, c) => acc + c.amount, 0), [expenses]);

  const totalCommitted = fixedTotal + subsTotal;
  const totalPaid = useMemo(() => {
    return expenses.filter((e) => e.isPaid && (e.category === "fixed" || e.category === "subscription")).reduce((acc, c) => acc + c.amount, 0);
  }, [expenses]);

  const totalLiquidIncome = budget.monthlyNetIncome + totalExtra;
  const disposableBalance = totalLiquidIncome - totalCommitted;

  // Actions
  const handleTogglePaid = (id: string) => {
    const updated = expenses.map((item) =>
      item.id === id ? { ...item, isPaid: !item.isPaid } : item
    );
    setExpenses(updated);
    toast.success("Estado de pago actualizado");
    syncWithCloud(budget, updated, extraIncomes);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
    toast.success("Gasto eliminado");
    syncWithCloud(budget, updated, extraIncomes);
  };

  const handleAddExpense = (newExp: {
    title: string;
    amount: number;
    category: "fixed" | "subscription" | "leisure" | "micro";
    dueDate?: number | null;
    notes?: string | null;
  }) => {
    const item: ExpenseItem = {
      id: Date.now().toString(),
      ...newExp,
      isPaid: false,
    };
    const updated = [item, ...expenses];
    setExpenses(updated);
    toast.success(`"${newExp.title}" agregado`);
    syncWithCloud(budget, updated, extraIncomes);
  };

  const handleAddPreset = (title: string, defaultAmount: number, dueDate: number) => {
    const isSub = ["Netflix", "Spotify", "YouTube Premium", "ChatGPT Plus", "Gimnasio", "Amazon Prime"].includes(title);
    handleAddExpense({
      title,
      amount: defaultAmount,
      category: isSub ? "subscription" : "fixed",
      dueDate,
    });
  };

  const handleAddExtraIncome = (newExtra: { title: string; amount: number; date: string }) => {
    const item: ExtraIncomeItem = {
      id: Date.now().toString(),
      ...newExtra,
    };
    const updated = [item, ...extraIncomes];
    setExtraIncomes(updated);
    toast.success("Dinero extra registrado");
    syncWithCloud(budget, expenses, updated);
  };

  const handleDeleteExtraIncome = (id: string) => {
    const updated = extraIncomes.filter((item) => item.id !== id);
    setExtraIncomes(updated);
    toast.success("Ingreso extra eliminado");
    syncWithCloud(budget, expenses, updated);
  };

  const handleSaveBudget = (income: number, type: "fixed" | "variable") => {
    const updated: BudgetState = {
      ...budget,
      monthlyNetIncome: income,
      incomeType: type,
    };
    setBudget(updated);
    toast.success("Ingreso mensual actualizado");
    syncWithCloud(updated, expenses, extraIncomes);
  };

  const handleCurrencyChange = (curr: string) => {
    const updated = { ...budget, currency: curr };
    setBudget(updated);
    syncWithCloud(updated, expenses, extraIncomes);
  };

  const handleConfirmRollover = (confirmedAmount: number) => {
    const updatedBudget: BudgetState = {
      ...budget,
      startingBalance: confirmedAmount,
      monthlyNetIncome: budget.incomeType === "variable" ? confirmedAmount : budget.monthlyNetIncome,
    };
    setBudget(updatedBudget);
    // Mark expenses unpaid for the fresh month
    const resetExpenses = expenses.map((e) => ({ ...e, isPaid: false }));
    setExpenses(resetExpenses);
    // Clear old extras
    setExtraIncomes([]);
    syncWithCloud(updatedBudget, resetExpenses, []);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E14]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C6F827] flex items-center justify-center font-black text-black text-xl animate-pulse">
            V
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-wider">CARGANDO VOUT WEB...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white flex flex-col pb-16">
      {/* Navbar */}
      <Navbar
        user={user}
        currency={budget.currency}
        onCurrencyChange={handleCurrencyChange}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        onManualSync={() => {
          syncWithCloud();
          toast.success("Sincronización en la nube completada ✓");
        }}
      />

      {/* Demo Banner if not logged in */}
      {!user && (
        <div className="bg-gradient-to-r from-amber-950/40 via-[#161F30] to-amber-950/40 border-b border-amber-900/40 py-2.5 px-4 text-center">
          <p className="text-xs text-amber-300 font-medium flex items-center justify-center gap-2 flex-wrap">
            <span>⚡ Modo Demostración Local:</span>
            <span className="text-slate-300">
              Inicia sesión o crea una cuenta para sincronizar tus gastos con la app móvil de VOUT en vivo.
            </span>
            <Link
              href="/register"
              className="text-[#C6F827] font-bold underline hover:text-white ml-1"
            >
              Crear cuenta gratis →
            </Link>
          </p>
        </div>
      )}

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6 flex-1">
        {/* 1. Budget Summary Hero */}
        <BudgetSummaryCard
          monthlyNetIncome={budget.monthlyNetIncome}
          incomeType={budget.incomeType}
          startingBalance={budget.startingBalance}
          totalExtraIncome={totalExtra}
          totalCommitted={totalCommitted}
          totalPaid={totalPaid}
          disposableBalance={disposableBalance}
          currency={budget.currency}
          onEditIncome={() => setIsBudgetModalOpen(true)}
          onAddExtra={() => setIsExtraModalOpen(true)}
          onOpenRollover={() => setIsRolloverModalOpen(true)}
        />

        {/* 2. Category Distribution Bar */}
        <CategoryDistributionBar
          fixedTotal={fixedTotal}
          subsTotal={subsTotal}
          leisureTotal={leisureTotal}
          microTotal={microTotal}
          currency={budget.currency}
        />

        {/* 3. Fixed Bills & Subscriptions Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FixedBillsSection
            items={fixedBills}
            currency={budget.currency}
            onTogglePaid={handleTogglePaid}
            onDeleteItem={handleDeleteExpense}
            onAddPreset={handleAddPreset}
            onOpenAddModal={() => {
              setExpenseModalCategory("fixed");
              setIsExpenseModalOpen(true);
            }}
          />

          <SubscriptionsSection
            items={subscriptions}
            currency={budget.currency}
            onTogglePaid={handleTogglePaid}
            onDeleteItem={handleDeleteExpense}
            onAddPreset={handleAddPreset}
            onOpenAddModal={() => {
              setExpenseModalCategory("subscription");
              setIsExpenseModalOpen(true);
            }}
          />
        </div>

        {/* 4. Extra Incomes & Recent Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExtraIncomeSection
            items={extraIncomes}
            currency={budget.currency}
            onDeleteItem={handleDeleteExtraIncome}
            onOpenAddModal={() => setIsExtraModalOpen(true)}
          />

          <RecentExpensesSection
            items={leisureAndMicro}
            currency={budget.currency}
            onDeleteItem={handleDeleteExpense}
            onOpenAddModal={() => {
              setExpenseModalCategory("leisure");
              setIsExpenseModalOpen(true);
            }}
          />
        </div>
      </main>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        defaultCategory={expenseModalCategory}
        onClose={() => setIsExpenseModalOpen(false)}
        onAdd={handleAddExpense}
      />

      <AddExtraIncomeModal
        isOpen={isExtraModalOpen}
        onClose={() => setIsExtraModalOpen(false)}
        onAdd={handleAddExtraIncome}
      />

      <EditBudgetModal
        isOpen={isBudgetModalOpen}
        currentIncome={budget.monthlyNetIncome}
        currentType={budget.incomeType}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
      />

      <MonthRolloverModal
        isOpen={isRolloverModalOpen}
        leftoverCalculated={disposableBalance}
        currency={budget.currency}
        onClose={() => setIsRolloverModalOpen(false)}
        onConfirmRollover={handleConfirmRollover}
      />

      {/* Mobile Download Bar Footer */}
      <footer className="mt-12 border-t border-[#1E293B] bg-[#0A0E14] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6F827]" />
            <span>VOUT Software Ecosystem • Web Companion & Cloud Sync v1.0.0</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AgustinMilesi/expenses/releases/latest/download/VOUT.apk"
              className="text-[#C6F827] font-bold hover:underline flex items-center gap-1.5"
            >
              <span>📱</span> Descargar VOUT.apk para Android
            </a>
            <span>•</span>
            <a
              href="https://github.com/AgustinMilesi/expenses"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              GitHub Repo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
