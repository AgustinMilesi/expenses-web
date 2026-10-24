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

interface RecentExpensesSectionProps {
  items: ExpenseItem[];
  currency: string;
  onDeleteItem: (id: string) => void;
  onOpenAddModal: () => void;
}

export function RecentExpensesSection({
  items,
  currency,
  onDeleteItem,
  onOpenAddModal,
}: RecentExpensesSectionProps) {
  const symbol = currency === "USD" ? "$" : currency === "ARS" ? "ARS $" : "€";
  const format = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

  const total = items.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="vout-card p-6 border-[#1E293B]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Micro-gastos & Salidas</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-900/40">
              {items.length} {items.length === 1 ? "gasto" : "gastos"} · {symbol} {format(total)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Café, almuerzos, compras cotidianas y salidas de ocio.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="vout-btn-primary text-xs py-2 px-3"
        >
          <span>+</span> Cargar Gasto
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-6 rounded-xl bg-[#0A0E14]/40 border border-dashed border-[#1E293B] text-center text-xs text-slate-500">
          No tienes salidas o micro-gastos registrados este mes.
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
                <span className="text-[10px] text-slate-400">
                  {item.category === "micro" ? "Micro-gasto diario" : "Salida / Ocio"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-white">
                  {symbol} {format(item.amount)}
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
