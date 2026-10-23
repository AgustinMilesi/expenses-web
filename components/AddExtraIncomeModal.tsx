"use client";

import { useState } from "react";
import { toast } from "sonner";

interface AddExtraIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (extra: { title: string; amount: number; date: string }) => void;
}

export function AddExtraIncomeModal({
  isOpen,
  onClose,
  onAdd,
}: AddExtraIncomeModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Ingresa un concepto y monto válido");
      return;
    }

    onAdd({
      title: title.trim(),
      amount: parsedAmount,
      date: new Date().toLocaleDateString("es-AR", { month: "short", day: "numeric" }),
    });

    setTitle("");
    setAmount("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="vout-card w-full max-w-sm p-6 bg-[#121824] border-[#1E293B] shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎁</span> Agregar Dinero Extra
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Concepto
            </label>
            <input
              type="text"
              placeholder="Ej: Regalo de cumpleaños, Bono freelance..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="vout-input text-sm"
              required
            />
          </div>

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

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E293B]">
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
              Agregar Ingreso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
