"use client";

import { useState } from "react";
import { toast } from "sonner";

interface EditBudgetModalProps {
  isOpen: boolean;
  currentIncome: number;
  currentType: string;
  onClose: () => void;
  onSave: (income: number, type: "fixed" | "variable") => void;
}

export function EditBudgetModal({
  isOpen,
  currentIncome,
  currentType,
  onClose,
  onSave,
}: EditBudgetModalProps) {
  const [income, setIncome] = useState(currentIncome.toString());
  const [type, setType] = useState<"fixed" | "variable">(currentType === "variable" ? "variable" : "fixed");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(income);
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Por favor ingresa un monto válido");
      return;
    }

    onSave(parsed, type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="vout-card w-full max-w-md p-6 bg-[#121824] border-[#1E293B] shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💼</span> Configurar Ingreso Mensual
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Income Type Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">
              Modalidad de Ingresos
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("fixed")}
                className={`p-3 rounded-lg border text-xs font-bold transition-all text-left ${
                  type === "fixed"
                    ? "bg-[#C6F827]/10 border-[#C6F827] text-[#C6F827]"
                    : "bg-[#0A0E14] border-[#1E293B] text-slate-400 hover:text-white"
                }`}
              >
                <span className="block font-bold">🏢 Sueldo Fijo</span>
                <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">
                  Cobras lo mismo cada mes
                </span>
              </button>

              <button
                type="button"
                onClick={() => setType("variable")}
                className={`p-3 rounded-lg border text-xs font-bold transition-all text-left ${
                  type === "variable"
                    ? "bg-[#C6F827]/10 border-[#C6F827] text-[#C6F827]"
                    : "bg-[#0A0E14] border-[#1E293B] text-slate-400 hover:text-white"
                }`}
              >
                <span className="block font-bold">🚀 Liquidez Inicial</span>
                <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">
                  Para freelancers o variable
                </span>
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              {type === "variable"
                ? "¿Con cuánta plata arrancas el mes?"
                : "Monto Neto del Sueldo"}
            </label>
            <input
              type="number"
              step="any"
              placeholder="0"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="vout-input text-base font-mono font-bold"
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
              Guardar Ingreso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
