"use client";

import { useState } from "react";
import { toast } from "sonner";

interface AddExpenseModalProps {
  isOpen: boolean;
  defaultCategory?: "fixed" | "subscription" | "leisure" | "micro";
  onClose: () => void;
  onAdd: (expense: {
    title: string;
    amount: number;
    category: "fixed" | "subscription" | "leisure" | "micro";
    dueDate?: number | null;
    notes?: string | null;
  }) => void;
}

export function AddExpenseModal({
  isOpen,
  defaultCategory = "fixed",
  onClose,
  onAdd,
}: AddExpenseModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<"fixed" | "subscription" | "leisure" | "micro">(defaultCategory);
  const [dueDate, setDueDate] = useState<string>("10");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Por favor completa el título y un monto válido");
      return;
    }

    const parsedDue = dueDate ? parseInt(dueDate, 10) : null;

    onAdd({
      title: title.trim(),
      amount: parsedAmount,
      category,
      dueDate: isNaN(Number(parsedDue)) ? null : parsedDue,
      notes: notes.trim() || null,
    });

    setTitle("");
    setAmount("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="vout-card w-full max-w-md p-6 bg-[#121824] border-[#1E293B] shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>➕</span> Agregar Compromiso / Gasto
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">
              Tipo de Gasto
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "fixed", label: "🏠 Fijo / Servicio" },
                { id: "subscription", label: "🔁 Suscripción" },
                { id: "leisure", label: "🎉 Salida / Ocio" },
                { id: "micro", label: "☕ Micro-gasto" },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as any)}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-left ${
                    category === c.id
                      ? "bg-[#C6F827]/10 border-[#C6F827] text-[#C6F827]"
                      : "bg-[#0A0E14] border-[#1E293B] text-slate-400 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Nombre o Concepto
            </label>
            <input
              type="text"
              placeholder="Ej: Internet, Netflix, Supermercado..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="vout-input text-sm"
              required
            />
          </div>

          {/* Amount & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Monto
              </label>
              <input
                type="number"
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="vout-input text-sm font-mono"
                required
              />
            </div>

            {(category === "fixed" || category === "subscription") && (
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Día Vencimiento (1-31)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="10"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="vout-input text-sm font-mono"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Notas adicionales (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Con tarjeta Visa terminada en 3501"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="vout-input text-xs"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="vout-btn-secondary text-xs py-2 px-3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="vout-btn-primary text-xs py-2 px-4"
            >
              Guardar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
