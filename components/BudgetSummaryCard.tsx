"use client";

interface BudgetSummaryCardProps {
  monthlyNetIncome: number;
  incomeType: string;
  startingBalance: number;
  totalExtraIncome: number;
  totalCommitted: number;
  totalPaid: number;
  disposableBalance: number;
  currency: string;
  onEditIncome: () => void;
  onAddExtra: () => void;
  onOpenRollover: () => void;
}

export function BudgetSummaryCard({
  monthlyNetIncome,
  incomeType,
  totalExtraIncome,
  totalCommitted,
  totalPaid,
  disposableBalance,
  currency,
  onEditIncome,
  onAddExtra,
  onOpenRollover,
}: BudgetSummaryCardProps) {
  const symbol = currency === "USD" ? "$" : currency === "ARS" ? "ARS $" : "€";
  const format = (num: number) =>
    num.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const isHealthy = disposableBalance > 0;
  const isDanger = disposableBalance < 0;

  return (
    <div className="vout-card p-6 relative overflow-hidden bg-gradient-to-br from-[#121824] via-[#101620] to-[#0D121A] border-[#1E293B] shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Saldo Disponible Libre
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isDanger
                  ? "bg-rose-950/40 text-rose-400 border-rose-800/50"
                  : isHealthy
                  ? "bg-[#C6F827]/10 text-[#C6F827] border-[#C6F827]/30"
                  : "bg-amber-950/40 text-amber-400 border-amber-800/50"
              }`}
            >
              {isDanger ? "⚠️ En Déficit" : isHealthy ? "🟢 Seguro para Gastar" : "🟡 Al Límite"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
              {symbol} {format(disposableBalance)}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAddExtra}
            className="px-3 py-2 text-xs font-bold rounded-lg bg-[#161F30] border border-[#1E293B] text-[#C6F827] hover:border-[#C6F827]/40 hover:bg-[#C6F827]/10 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🎁</span> + Dinero Extra
          </button>
          <button
            onClick={onEditIncome}
            className="px-3 py-2 text-xs font-bold rounded-lg bg-[#161F30] border border-[#1E293B] text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>💼</span> {incomeType === "variable" ? "Liquidez Inicial" : "Ajustar Sueldo"}
          </button>
          <button
            onClick={onOpenRollover}
            title="Conciliación de cierre de mes"
            className="px-3 py-2 text-xs font-bold rounded-lg bg-[#161F30] border border-[#1E293B] text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🔄</span> Fin de Mes
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        {/* Metric 1: Monthly Income */}
        <div className="p-3.5 rounded-xl bg-[#0A0E14]/60 border border-[#1E293B]">
          <span className="text-xs text-slate-400 block mb-1">
            {incomeType === "variable" ? "Liquidez Inicial" : "Ingreso Mensual"}
          </span>
          <span className="text-lg font-bold text-white font-mono block">
            {symbol} {format(monthlyNetIncome)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {incomeType === "variable" ? "Variable / Independiente" : "Sueldo Fijo Recurrente"}
          </span>
        </div>

        {/* Metric 2: Extra Income */}
        <div className="p-3.5 rounded-xl bg-[#0A0E14]/60 border border-[#1E293B]">
          <span className="text-xs text-slate-400 block mb-1">Dinero Extra del Mes</span>
          <span className="text-lg font-bold text-[#C6F827] font-mono block">
            +{symbol} {format(totalExtraIncome)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">Regalos, bonos y changas</span>
        </div>

        {/* Metric 3: Committed Expenses */}
        <div className="p-3.5 rounded-xl bg-[#0A0E14]/60 border border-[#1E293B]">
          <span className="text-xs text-slate-400 block mb-1">Gastos Comprometidos</span>
          <span className="text-lg font-bold text-white font-mono block">
            {symbol} {format(totalCommitted)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">Fijos + Suscripciones</span>
        </div>

        {/* Metric 4: Already Paid */}
        <div className="p-3.5 rounded-xl bg-[#0A0E14]/60 border border-[#1E293B]">
          <span className="text-xs text-slate-400 block mb-1">Pagado hasta hoy</span>
          <span className="text-lg font-bold text-emerald-400 font-mono block">
            {symbol} {format(totalPaid)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Pendiente: {symbol} {format(Math.max(0, totalCommitted - totalPaid))}
          </span>
        </div>
      </div>
    </div>
  );
}
