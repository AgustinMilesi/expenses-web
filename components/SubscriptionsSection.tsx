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

interface SubscriptionsSectionProps {
  items: ExpenseItem[];
  currency: string;
  onTogglePaid: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddPreset: (title: string, defaultAmount: number, dueDate: number) => void;
  onOpenAddModal: () => void;
}

const SUB_PRESETS = [
  { title: "Netflix", icon: "🎬", defaultAmount: 9500, due: 7 },
  { title: "Spotify", icon: "🎵", defaultAmount: 4200, due: 14 },
  { title: "YouTube Premium", icon: "▶️", defaultAmount: 4800, due: 21 },
  { title: "ChatGPT Plus", icon: "🤖", defaultAmount: 24000, due: 1 },
  { title: "Gimnasio", icon: "🏋️", defaultAmount: 32000, due: 5 },
  { title: "Amazon Prime", icon: "📦", defaultAmount: 4900, due: 18 },
];

export function SubscriptionsSection({
  items,
  currency,
  onTogglePaid,
  onDeleteItem,
  onAddPreset,
  onOpenAddModal,
}: SubscriptionsSectionProps) {
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
            <span className="text-xl">🔁</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Suscripciones Recurrentes</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-950/50 text-purple-400 border border-purple-900/40">
              {items.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total mensual: <span className="font-mono text-white font-bold">{symbol} {format(total)}</span>
            {" • "}
            Pagado: <span className="font-mono text-purple-300 font-bold">{symbol} {format(paidTotal)}</span>
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="vout-btn-primary text-xs py-2 px-3 self-start sm:self-auto bg-purple-500 hover:bg-purple-400 text-white"
        >
          <span>+</span> Agregar Suscripción
        </button>
      </div>

      {/* Quick Presets Bar */}
      <div className="mb-5 pb-4 border-b border-[#1E293B]/60">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Presets Populares
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SUB_PRESETS.map((p) => {
            const alreadyAdded = items.some((i) => i.title.toLowerCase().includes(p.title.toLowerCase()));
            return (
              <button
                key={p.title}
                onClick={() => onAddPreset(p.title, p.defaultAmount, p.due)}
                disabled={alreadyAdded}
                className={`text-xs px-2.5 py-1.5 rounded-lg border whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  alreadyAdded
                    ? "opacity-40 bg-[#161F30] border-[#1E293B] text-slate-500 cursor-not-allowed"
                    : "bg-[#161F30] border-[#1E293B] text-slate-300 hover:text-white hover:border-purple-400/40 hover:bg-[#1E293B]"
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
          <p className="text-slate-400 text-sm mb-2">No tienes suscripciones registradas.</p>
          <p className="text-xs text-slate-500">
            Agrega Netflix, Spotify, Gym o membresías para monitorear débitos automáticos.
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
                      ? "bg-purple-500 border-purple-400 text-white font-black text-xs"
                      : "border-slate-600 hover:border-purple-400 bg-[#0A0E14]"
                  }`}
                  title={item.isPaid ? "Marcar como pendiente" : "Marcar como debitado/pagado"}
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
                        Débito día {item.dueDate}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold ${
                        item.isPaid ? "text-purple-400" : "text-amber-400"
                      }`}
                    >
                      {item.isPaid ? "Debitado" : "Pendiente"}
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
                  title="Eliminar suscripción"
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
