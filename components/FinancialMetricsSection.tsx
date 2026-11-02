"use client";

import { useState, useMemo } from "react";

interface FinancialMetricsSectionProps {
  monthlyNetIncome: number;
  totalExtraIncome: number;
  fixedTotal: number;
  subsTotal: number;
  leisureTotal: number;
  microTotal: number;
  disposableBalance: number;
  currency: string;
  subsCount: number;
  fixedCount: number;
}

export function FinancialMetricsSection({
  monthlyNetIncome,
  totalExtraIncome,
  fixedTotal,
  subsTotal,
  leisureTotal,
  microTotal,
  disposableBalance,
  currency,
  subsCount,
  fixedCount,
}: FinancialMetricsSectionProps) {
  const [activeTab, setActiveTab] = useState<"cashflow" | "rule503020" | "pace">("cashflow");
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const symbol = currency === "USD" ? "$" : currency === "ARS" ? "ARS $" : "€";
  const format = (n: number) =>
    Math.round(n).toLocaleString("es-AR", { maximumFractionDigits: 0 });

  // Core Financial Formulas
  const totalLiquidIncome = monthlyNetIncome + totalExtraIncome;
  const totalCommitted = fixedTotal + subsTotal;
  const totalVariable = leisureTotal + microTotal;
  const totalOutflows = totalCommitted + totalVariable;

  // Calendar calculations for Runway
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay + 1);

  // 1. Savings Rate / Surplus Margin (%)
  const savingsRate =
    totalLiquidIncome > 0
      ? ((totalLiquidIncome - totalOutflows) / totalLiquidIncome) * 100
      : 0;

  // 2. Fixed Burn Rate / Committed Ratio (%)
  const committedRatio =
    totalLiquidIncome > 0 ? (totalCommitted / totalLiquidIncome) * 100 : 0;

  // 3. Daily Allowance / Runway
  const dailyRunway = disposableBalance > 0 ? disposableBalance / remainingDays : 0;

  // 4. Annualized Recurring Load
  const annualizedSubs = subsTotal * 12;

  // 50/30/20 Rule Calculations
  const needsPercent = totalLiquidIncome > 0 ? (fixedTotal / totalLiquidIncome) * 100 : 0;
  const wantsPercent =
    totalLiquidIncome > 0 ? ((subsTotal + leisureTotal + microTotal) / totalLiquidIncome) * 100 : 0;
  const savingsPercent = totalLiquidIncome > 0 ? (disposableBalance / totalLiquidIncome) * 100 : 0;

  // Cashflow bars configuration
  const cashflowItems = useMemo(() => {
    return [
      {
        id: "income",
        label: "Ingresos Totales",
        sublabel: "Sueldo neto + extras",
        amount: totalLiquidIncome,
        color: "bg-[#C6F827]",
        textColor: "text-[#C6F827]",
        borderColor: "border-[#C6F827]/30",
        type: "inflow",
      },
      {
        id: "fixed",
        label: "Costos Fijos",
        sublabel: `${fixedCount} servicios/alquiler`,
        amount: fixedTotal,
        color: "bg-blue-500",
        textColor: "text-blue-400",
        borderColor: "border-blue-500/30",
        type: "outflow",
      },
      {
        id: "subs",
        label: "Suscripciones",
        sublabel: `${subsCount} servicios activos`,
        amount: subsTotal,
        color: "bg-indigo-500",
        textColor: "text-indigo-400",
        borderColor: "border-indigo-500/30",
        type: "outflow",
      },
      {
        id: "variable",
        label: "Ocio y Microgastos",
        sublabel: "Salidas y gastos menores",
        amount: totalVariable,
        color: "bg-amber-500",
        textColor: "text-amber-400",
        borderColor: "border-amber-500/30",
        type: "outflow",
      },
      {
        id: "net",
        label: disposableBalance >= 0 ? "Margen Libre" : "Déficit Neto",
        sublabel: disposableBalance >= 0 ? "Ahorro o colchón" : "Sobregiro mensual",
        amount: Math.abs(disposableBalance),
        color: disposableBalance >= 0 ? "bg-emerald-400" : "bg-rose-500",
        textColor: disposableBalance >= 0 ? "text-emerald-400" : "text-rose-400",
        borderColor: disposableBalance >= 0 ? "border-emerald-500/30" : "border-rose-500/30",
        type: disposableBalance >= 0 ? "surplus" : "deficit",
      },
    ];
  }, [
    totalLiquidIncome,
    fixedTotal,
    fixedCount,
    subsTotal,
    subsCount,
    totalVariable,
    disposableBalance,
  ]);

  const maxCashflow = Math.max(...cashflowItems.map((c) => c.amount), 1);

  // Spending Pace / Velocity Curve Data (SVG)
  const pacePoints = useMemo(() => {
    const points: { day: number; ideal: number; actual: number | null }[] = [];
    const dailyIdealRate = totalLiquidIncome / daysInMonth;
    // Current spending cumulative trajectory
    const currentSpentSoFar = totalOutflows;
    const currentRatePerDay = currentDay > 0 ? currentSpentSoFar / currentDay : 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const ideal = dailyIdealRate * day;
      let actual: number | null = null;
      if (day <= currentDay) {
        actual = currentRatePerDay * day;
      }
      points.push({ day, ideal, actual });
    }
    return points;
  }, [totalLiquidIncome, daysInMonth, totalOutflows, currentDay]);

  return (
    <div className="vout-card p-6 border-[#1E293B] bg-gradient-to-b from-[#121824]/90 to-[#0A0E14] relative overflow-hidden">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C6F827] animate-pulse" />
            <h2 className="text-sm uppercase tracking-wider font-bold text-white font-mono">
              Panel Financiero & Métricas de Rendimiento
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Análisis de liquidez, capacidad de ahorro y ritmo de consumo mensual.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#0A0E14] p-1 rounded-lg border border-[#1E293B] text-xs">
          <button
            onClick={() => setActiveTab("cashflow")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === "cashflow"
                ? "bg-[#1E293B] text-[#C6F827] shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📊 Flujo de Caja
          </button>
          <button
            onClick={() => setActiveTab("rule503020")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === "rule503020"
                ? "bg-[#1E293B] text-[#C6F827] shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚖️ Regla 50/30/20
          </button>
          <button
            onClick={() => setActiveTab("pace")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === "pace"
                ? "bg-[#1E293B] text-[#C6F827] shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📈 Ritmo de Gasto
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {/* KPI 1: Tasa de Ahorro */}
        <div className="p-4 rounded-xl bg-[#0F141E] border border-[#1E293B] hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Tasa de Margen Libre
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                savingsRate >= 20
                  ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/40"
                  : savingsRate >= 5
                  ? "bg-amber-950/50 text-amber-300 border-amber-800/40"
                  : "bg-rose-950/50 text-rose-300 border-rose-800/40"
              }`}
            >
              {savingsRate >= 20 ? "Óptimo" : savingsRate >= 5 ? "Ajustado" : "Déficit"}
            </span>
          </div>
          <div className="text-2xl font-black font-mono tracking-tight text-white">
            {savingsRate >= 0 ? "+" : ""}
            {savingsRate.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            De cada {symbol}100 ingresados, retenés {symbol}
            {Math.max(0, savingsRate).toFixed(0)} libres.
          </p>
        </div>

        {/* KPI 2: Compromiso Fijo */}
        <div className="p-4 rounded-xl bg-[#0F141E] border border-[#1E293B] hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Compromiso Obligatorio
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                committedRatio <= 50
                  ? "bg-[#C6F827]/10 text-[#C6F827] border-[#C6F827]/30"
                  : committedRatio <= 70
                  ? "bg-amber-950/50 text-amber-300 border-amber-800/40"
                  : "bg-rose-950/50 text-rose-300 border-rose-800/40"
              }`}
            >
              {committedRatio <= 50 ? "Saludable" : committedRatio <= 70 ? "Moderado" : "Alto"}
            </span>
          </div>
          <div className="text-2xl font-black font-mono tracking-tight text-white">
            {committedRatio.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Fijos y suscripciones contratadas del mes.
          </p>
        </div>

        {/* KPI 3: Runway Diario */}
        <div className="p-4 rounded-xl bg-[#0F141E] border border-[#1E293B] hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Presupuesto Diario
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-[#161F30] px-1.5 py-0.5 rounded border border-[#1E293B]">
              {remainingDays}d restantes
            </span>
          </div>
          <div className="text-2xl font-black font-mono tracking-tight text-[#C6F827]">
            {symbol} {format(dailyRunway)}
            <span className="text-xs text-slate-400 font-normal ml-1">/ día</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Límite sugerido para terminar el mes en verde.
          </p>
        </div>

        {/* KPI 4: Carga Anualizada */}
        <div className="p-4 rounded-xl bg-[#0F141E] border border-[#1E293B] hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Drenaje Anual Suscrip.
            </span>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-800/30">
              12 meses
            </span>
          </div>
          <div className="text-2xl font-black font-mono tracking-tight text-white">
            {symbol} {format(annualizedSubs)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Impacto acumulado de tus {subsCount} suscripciones.
          </p>
        </div>
      </div>

      {/* VIEW 1: CASHFLOW BREAKDOWN BARS */}
      {activeTab === "cashflow" && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Comparativa de Flujo Monetario Mensual
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Escala de volumen relativo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
            {cashflowItems.map((item) => {
              const heightPercent = Math.max(12, Math.round((item.amount / maxCashflow) * 100));
              const isHovered = hoveredBar === item.id;
              const percentOfIncome =
                totalLiquidIncome > 0 ? ((item.amount / totalLiquidIncome) * 100).toFixed(1) : "0";

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredBar(item.id)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className={`flex flex-col items-center justify-end p-3 rounded-xl bg-[#0B0F17] border transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? `${item.borderColor} bg-[#131A26] scale-[1.02]`
                      : "border-[#1E293B]/70 hover:border-slate-600"
                  }`}
                >
                  {/* Amount tag */}
                  <span className={`text-xs font-mono font-bold mb-2 ${item.textColor}`}>
                    {symbol} {format(item.amount)}
                  </span>

                  {/* Vertical Bar Track */}
                  <div className="w-full h-36 bg-[#070A0F] rounded-lg p-1 flex items-end justify-center relative overflow-hidden border border-[#1E293B]/50">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-md ${item.color} transition-all duration-500 relative flex items-center justify-center opacity-90`}
                    >
                      <span className="text-[10px] font-mono font-bold text-black/80 rotate-[-90deg] select-none">
                        {percentOfIncome}%
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center mt-3">
                    <div className="text-xs font-bold text-white leading-tight">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {item.sublabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6F827]" /> Ingreso Total:{" "}
              <strong className="text-white font-mono">{symbol} {format(totalLiquidIncome)}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Gastos Totales:{" "}
              <strong className="text-white font-mono">{symbol} {format(totalOutflows)}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Margen Disponible:{" "}
              <strong className="text-[#C6F827] font-mono">{symbol} {format(disposableBalance)}</strong>
            </span>
          </div>
        </div>
      )}

      {/* VIEW 2: 50 / 30 / 20 RULE BENCHMARK */}
      {activeTab === "rule503020" && (
        <div className="pt-2 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Diagnóstico de Estructura Presupuestaria (50/30/20)
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Estándar financiero: 50% Necesidades básicas, 30% Estilo de vida, 20% Ahorro e inversión.
              </p>
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-md border ${
                  savingsPercent >= 20 && needsPercent <= 55
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                    : "bg-amber-950/60 text-amber-300 border-amber-800/50"
                }`}
              >
                {savingsPercent >= 20 && needsPercent <= 55
                  ? "✓ Estructura Óptima"
                  : "⚠️ Desbalance Detectado"}
              </span>
            </div>
          </div>

          {/* Bar 1: Necesidades (Target 50%) */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  50% Necesidades Básicas (Gastos Fijos)
                </span>
                <span className="text-[11px] text-slate-400">
                  Alquiler, servicios indispensables, alimentos y transporte esencial.
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-sm font-black text-white">{needsPercent.toFixed(1)}%</span>
                <span className="text-xs text-slate-400 ml-1">/ meta 50%</span>
              </div>
            </div>

            {/* Dual Track Bar */}
            <div className="h-3 w-full bg-[#070A0F] rounded-full overflow-hidden p-0.5 border border-[#1E293B] relative">
              {/* Target 50% indicator line */}
              <div
                className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40 z-10"
                title="Límite recomendado: 50%"
              />
              <div
                style={{ width: `${Math.min(100, needsPercent)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  needsPercent <= 50 ? "bg-blue-500" : "bg-rose-500"
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Actual: {symbol} {format(fixedTotal)}</span>
              <span>{needsPercent <= 50 ? "✓ Dentro del rango" : `⚠️ Excedido en ${(needsPercent - 50).toFixed(1)}%`}</span>
            </div>
          </div>

          {/* Bar 2: Deseos (Target 30%) */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  30% Deseos & Estilo de Vida (Suscripciones, Salidas y Ocio)
                </span>
                <span className="text-[11px] text-slate-400">
                  Streaming, salidas a comer, compras recreativas y microgastos.
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-sm font-black text-white">{wantsPercent.toFixed(1)}%</span>
                <span className="text-xs text-slate-400 ml-1">/ meta 30%</span>
              </div>
            </div>

            <div className="h-3 w-full bg-[#070A0F] rounded-full overflow-hidden p-0.5 border border-[#1E293B] relative">
              <div
                className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-white/40 z-10"
                title="Límite recomendado: 30%"
              />
              <div
                style={{ width: `${Math.min(100, wantsPercent)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  wantsPercent <= 30 ? "bg-amber-500" : "bg-rose-500"
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Actual: {symbol} {format(subsTotal + totalVariable)}</span>
              <span>{wantsPercent <= 30 ? "✓ Dentro del rango" : `⚠️ Excedido en ${(wantsPercent - 30).toFixed(1)}%`}</span>
            </div>
          </div>

          {/* Bar 3: Ahorro (Target 20%) */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C6F827]" />
                  20% Margen Libre, Ahorro e Inversión
                </span>
                <span className="text-[11px] text-slate-400">
                  Fondo de emergencia, inversiones y colchón disponible no gastado.
                </span>
              </div>
              <div className="text-right font-mono">
                <span
                  className={`text-sm font-black ${
                    savingsPercent >= 20 ? "text-[#C6F827]" : "text-amber-400"
                  }`}
                >
                  {savingsPercent.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400 ml-1">/ meta 20%</span>
              </div>
            </div>

            <div className="h-3 w-full bg-[#070A0F] rounded-full overflow-hidden p-0.5 border border-[#1E293B] relative">
              <div
                className="absolute top-0 bottom-0 left-[20%] w-0.5 bg-white/40 z-10"
                title="Meta mínima recomendada: 20%"
              />
              <div
                style={{ width: `${Math.max(0, Math.min(100, savingsPercent))}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  savingsPercent >= 20 ? "bg-[#C6F827]" : "bg-amber-500"
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Actual: {symbol} {format(disposableBalance)}</span>
              <span>{savingsPercent >= 20 ? "✓ Superávit saludable" : "⚠️ Por debajo del colchón ideal"}</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SPENDING PACE & VELOCITY CURVE */}
      {activeTab === "pace" && (
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Curva de Ritmo de Gasto Mensual (Día 1 a {daysInMonth})
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Compara tu velocidad de gasto real acumulado contra la proyección uniforme ideal.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-500" /> Ritmo Ideal
              </span>
              <span className="flex items-center gap-1.5 text-[#C6F827]">
                <span className="w-3 h-1 bg-[#C6F827] rounded-full" /> Ritmo Actual (Hoy: Día {currentDay})
              </span>
            </div>
          </div>

          {/* SVG Spending Curve */}
          <div className="w-full bg-[#080C14] rounded-xl p-4 border border-[#1E293B]/70 relative">
            <svg
              viewBox="0 0 600 200"
              className="w-full h-48 sm:h-56 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C6F827" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C6F827" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="idealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748B" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#64748B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              <line x1="0" y1="180" x2="600" y2="180" stroke="#1E293B" strokeWidth="1" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="600" y2="60" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />

              {/* Ideal Linear Line (from (0, 180) to (600, 20)) */}
              <line
                x1="20"
                y1="180"
                x2="580"
                y2="20"
                stroke="#64748B"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Current Day Vertical Guideline */}
              {(() => {
                const currentX = 20 + ((currentDay - 1) / (daysInMonth - 1)) * 560;
                return (
                  <g>
                    <line
                      x1={currentX}
                      y1="10"
                      x2={currentX}
                      y2="180"
                      stroke="#C6F827"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />
                    <text
                      x={currentX}
                      y="195"
                      fill="#C6F827"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      Día {currentDay}
                    </text>
                  </g>
                );
              })()}

              {/* Actual Spending Path up to Current Day */}
              {(() => {
                const pointsUpToNow = pacePoints.filter((p) => p.day <= currentDay);
                if (pointsUpToNow.length < 2) return null;

                const maxAmount = Math.max(totalLiquidIncome, totalOutflows, 1);
                const coords = pointsUpToNow.map((p) => {
                  const x = 20 + ((p.day - 1) / (daysInMonth - 1)) * 560;
                  const ratio = (p.actual || 0) / maxAmount;
                  const y = 180 - ratio * 150;
                  return `${x},${y}`;
                });

                const firstCoord = coords[0];
                const lastCoord = coords[coords.length - 1];
                const lastX = lastCoord.split(",")[0];
                const lastY = lastCoord.split(",")[1];

                const areaPath = `M ${coords.join(" L ")} L ${lastX},180 L 20,180 Z`;
                const linePath = `M ${coords.join(" L ")}`;

                return (
                  <g>
                    {/* Area under line */}
                    <path d={areaPath} fill="url(#actualGradient)" />
                    {/* Main solid line */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#C6F827"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Marker at current day */}
                    <circle cx={lastX} cy={lastY} r="5" fill="#C6F827" />
                    <circle cx={lastX} cy={lastY} r="9" fill="#C6F827" opacity="0.3" />
                  </g>
                );
              })()}
            </svg>

            {/* Bottom Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3 pt-2 border-t border-[#1E293B]">
              <span>Día 1</span>
              <span>Día 10</span>
              <span>Día 20</span>
              <span>Fin de Mes ({daysInMonth})</span>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-[#0F141E] border border-[#1E293B] flex items-center justify-between text-xs">
            <span className="text-slate-300">
              💡 <strong>Diagnóstico de Consumo:</strong>{" "}
              {totalOutflows <= (totalLiquidIncome / daysInMonth) * currentDay
                ? "Vas consumiendo por debajo del límite teórico del mes. Margen de seguridad favorable."
                : "Ritmo de salida acelerado. Considera reducir gastos variables durante los próximos días."}
            </span>
            <span className="font-mono text-[#C6F827] font-bold">
              {symbol} {format(totalOutflows / currentDay)} / día real
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
