"use client";

interface ExtraIncomeItem {
  id: string;
  title: string;
  amount: number;
  date: string;
}

interface ExtraIncomeSectionProps {
  items: ExtraIncomeItem[];
  currency: string;
  onDeleteItem: (id: string) => void;
  onOpenAddModal: () => void;
}

export function ExtraIncomeSection({
  items,
  currency,
  onDeleteItem,
  onOpenAddModal,
}: ExtraIncomeSectionProps) {
  const symbol = currency === "USD" ? "$" : currency === "ARS" ? "ARS $" : "€";
  const format = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
  const total = items.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="vout-card p-6 border-[#1E293B]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Dinero Extra & Bonos</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#C6F827]/10 text-[#C6F827] border border-[#C6F827]/30">
              +{symbol} {format(total)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cobros imprevistos, regalos o trabajos freelance que aumentan tu saldo disponible.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="vout-btn-primary text-xs py-2 px-3"
        >
          <span>+</span> Agregar Extra
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-6 rounded-xl bg-[#0A0E14]/40 border border-dashed border-[#1E293B] text-center text-xs text-slate-500">
          No has cargado ingresos extraordinarios este mes.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#161F30] border border-[#1E293B] flex items-center justify-between"
            >
              <div>
                <span className="text-sm font-bold text-white block">{item.title}</span>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-[#C6F827]">
                  +{symbol} {format(item.amount)}
                </span>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-slate-500 hover:text-rose-400 text-xs p-1"
                  title="Eliminar"
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
