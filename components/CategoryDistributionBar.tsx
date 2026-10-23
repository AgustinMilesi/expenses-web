"use client";

interface CategoryDistributionBarProps {
  fixedTotal: number;
  subsTotal: number;
  leisureTotal: number;
  microTotal: number;
  currency: string;
}

export function CategoryDistributionBar({
  fixedTotal,
  subsTotal,
  leisureTotal,
  microTotal,
  currency,
}: CategoryDistributionBarProps) {
  const total = fixedTotal + subsTotal + leisureTotal + microTotal;
  const symbol = currency === "USD" ? "$" : currency === "ARS" ? "ARS $" : "€";
  const format = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

  if (total === 0) {
    return null;
  }

  const pFixed = (fixedTotal / total) * 100;
  const pSubs = (subsTotal / total) * 100;
  const pLeisure = (leisureTotal / total) * 100;
  const pMicro = (microTotal / total) * 100;

  return (
    <div className="vout-card p-5 border-[#1E293B]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
          Distribución de Salidas
        </span>
        <span className="text-xs font-mono font-bold text-white">
          Total: {symbol} {format(total)}
        </span>
      </div>

      {/* Stacked Bar */}
      <div className="h-3 w-full rounded-full bg-[#0A0E14] overflow-hidden flex gap-0.5 p-0.5 border border-[#1E293B]">
        {pFixed > 0 && (
          <div
            style={{ width: `${pFixed}%` }}
            className="h-full bg-blue-500 rounded-sm transition-all duration-300"
            title={`Fijos: ${pFixed.toFixed(1)}%`}
          />
        )}
        {pSubs > 0 && (
          <div
            style={{ width: `${pSubs}%` }}
            className="h-full bg-purple-500 rounded-sm transition-all duration-300"
            title={`Suscripciones: ${pSubs.toFixed(1)}%`}
          />
        )}
        {pLeisure > 0 && (
          <div
            style={{ width: `${pLeisure}%` }}
            className="h-full bg-emerald-500 rounded-sm transition-all duration-300"
            title={`Salidas/Ocio: ${pLeisure.toFixed(1)}%`}
          />
        )}
        {pMicro > 0 && (
          <div
            style={{ width: `${pMicro}%` }}
            className="h-full bg-[#C6F827] rounded-sm transition-all duration-300"
            title={`Micro-gastos: ${pMicro.toFixed(1)}%`}
          />
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#1E293B]/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-slate-400">Fijos ({pFixed.toFixed(0)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span className="text-slate-400">Suscripciones ({pSubs.toFixed(0)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-400">Salidas ({pLeisure.toFixed(0)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C6F827]" />
          <span className="text-slate-400">Micro ({pMicro.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  );
}
