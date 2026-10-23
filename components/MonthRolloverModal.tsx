"use client";

import { useState } from "react";
import { toast } from "sonner";

interface MonthRolloverModalProps {
  isOpen: boolean;
  leftoverCalculated: number;
  currency: string;
  onClose: () => void;
  onConfirmRollover: (confirmedAmount: number) => void;
}

export function MonthRolloverModal({
  isOpen,
  leftoverCalculated,
  currency,
  onClose,
  onConfirmRollover,
}: MonthRolloverModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customAmount, setCustomAmount] = useState(Math.max(0, leftoverCalculated).toString());

  if (!isOpen) return null;

  const symbol = currency === "USD" ? "$" : currency === "ARS" ? "ARS $" : "€";
  const format = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

  const handleConfirmTrue = () => {
    onConfirmRollover(Math.max(0, leftoverCalculated));
    toast.success("¡Sobrante traspasado exitosamente al nuevo mes!");
    onClose();
  };

  const handleConfirmCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customAmount);
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    onConfirmRollover(parsed);
    toast.success("¡Monto ajustado y traspasado exitosamente!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="vout-card w-full max-w-md p-6 bg-[#121824] border-[#1E293B] shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔄</span> Conciliación de Fin de Mes
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-[#1E293B] text-center">
              <span className="text-xs text-slate-400 block mb-1">
                Sobrante calculado según tus registros
              </span>
              <span className="text-3xl font-black font-mono text-[#C6F827]">
                {symbol} {format(Math.max(0, leftoverCalculated))}
              </span>
            </div>

            <p className="text-sm text-slate-300 text-center">
              ¿Este es el monto verdadero que te quedó en mano / cuenta bancaria para pasar al siguiente mes?
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-1/2 vout-btn-secondary text-xs py-2.5"
              >
                No, ajustar monto
              </button>
              <button
                type="button"
                onClick={handleConfirmTrue}
                className="w-1/2 vout-btn-primary text-xs py-2.5"
              >
                Sí, es correcto ✓
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmCustom} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                ¿Cuál es el monto real exacto que te quedó?
              </label>
              <input
                type="number"
                step="any"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="vout-input text-lg font-mono font-bold"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Se guardará como dinero extra / base inicial del siguiente ciclo.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="vout-btn-secondary text-xs py-2 px-3"
              >
                Volver
              </button>
              <button
                type="submit"
                className="vout-btn-primary text-xs py-2 px-4"
              >
                Confirmar y Traspasar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
