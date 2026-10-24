"use client";

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  dueDate?: number | null;
  isPaid: boolean;
  notes?: string | null;
}

interface FixedBillsSectionProps {
  items: ExpenseItem[];
  currency: string;
  onTogglePaid: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddPreset: (title: string, defaultAmount: number, dueDate: number) => void;
  onOpenAddModal: () => void;
}

const PRESETS = [
  { title: "Alquiler", icon: "🏠", defaultAmount: 180000, due: 5 },
  { title: "Luz (Edenor/Edesur)", icon: "💡", defaultAmount: 25000, due: 12 },
  { title: "Internet Fibra", icon: "📶", defaultAmount: 28000, due: 15 },
  { title: "Agua (AySA)", icon: "💧", defaultAmount: 12000, due: 18 },
  { title: "Gas Natural", icon: "🔥", defaultAmount: 9000, due: 20 },
  { title: "Expensas", icon: "🏢", defaultAmount: 45000, due: 10 },
];

export function FixedBillsSection({
  items,
  currency,
  onTogglePaid,
  onDeleteItem,
  onAddPreset,
  onOpenAddModal,
}: FixedBillsSectionProps) {
  const symbol = currency === "USD" ? "$" : currency === "ARS" ? "ARS $" : "€";
  const format = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

  const total = items.reduce((acc, curr) => acc + curr.amount, 0);
  const paidTotal = items.filter((i) => i.isPaid).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="vout-card p-6 border-[#1E293B]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Gastos Fijos & Servicios</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-950/50 text-blue-400 border border-blue-900/40">
              {items.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total mensual: <span className="font-mono text-white font-bold">{symbol} {format(total)}</span>
            {" • "}
            Pagado: <span className="font-mono text-emerald-400 font-bold">{symbol} {format(paidTotal)}</span>
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="vout-btn-primary text-xs py-2 px-3 self-start sm:self-auto"
        >
          <span>+</span> Agregar Fijo
        </button>
      </div>

      {/* Quick Presets Bar */}
      <div className="mb-5 pb-4 border-b border-[#1E293B]/60">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Presets Rápidos de Hogar
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {PRESETS.map((p) => {
            const alreadyAdded = items.some((i) => i.title.toLowerCase().includes(p.title.toLowerCase()));
            return (
              <button
                key={p.title}
                onClick={() => onAddPreset(p.title, p.defaultAmount, p.due)}
                disabled={alreadyAdded}
                className={`text-xs px-2.5 py-1.5 rounded-lg border whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  alreadyAdded
                    ? "opacity-40 bg-[#161F30] border-[#1E293B] text-slate-500 cursor-not-allowed"
                    : "bg-[#161F30] border-[#1E293B] text-slate-300 hover:text-white hover:border-[#C6F827]/40 hover:bg-[#1E293B]"
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.title}</span>
                {alreadyAdded && <span className="text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="p-8 rounded-xl bg-[#0A0E14]/50 border border-dashed border-[#1E293B] text-center">
          <p className="text-slate-400 text-sm mb-2">No tienes gastos fijos cargados este mes.</p>
          <p className="text-xs text-slate-500">
            Usa los presets de arriba o el botón &quot;+ Agregar Fijo&quot; para registrar alquiler, luz, internet, etc.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                item.isPaid
                  ? "bg-[#121824]/40 border-[#1E293B]/60 opacity-75"
                  : "bg-[#161F30] border-[#1E293B] hover:border-slate-600"
              }`}
            >
              {/* Checkbox & Details */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onTogglePaid(item.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                    item.isPaid
                      ? "bg-emerald-500 border-emerald-400 text-black font-black text-xs"
                      : "border-slate-600 hover:border-[#C6F827] bg-[#0A0E14]"
                  }`}
                  title={item.isPaid ? "Marcar como pendiente" : "Marcar como pagado"}
                >
                  {item.isPaid && "✓"}
                </button>

                <div>
                  <h3 className={`text-sm font-bold ${item.isPaid ? "line-through text-slate-400" : "text-white"}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.dueDate && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0A0E14] text-slate-400 border border-[#1E293B]">
                        Vence día {item.dueDate}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold ${
                        item.isPaid ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {item.isPaid ? "Pagado" : "Pendiente"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount & Delete */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-mono text-white">
                  {symbol} {format(item.amount)}
                </span>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors text-xs cursor-pointer"
                  title="Eliminar gasto"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
