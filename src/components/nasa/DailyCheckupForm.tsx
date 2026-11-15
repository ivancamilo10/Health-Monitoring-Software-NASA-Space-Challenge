"use client";

import React, { useState } from "react";
import { useHealthStore } from "@/store/health-store";
import { HEALTH_INDICATORS, IndicatorId } from "@/data/indicators";
import { Save, RefreshCw, AlertCircle, Check, X } from "lucide-react";

export function DailyCheckupForm() {
  const { currentReadings, baselines, setReading, evaluateHealth, resetToBaselines } =
    useHealthStore();

  const [notification, setNotification] = useState<string | null>(null);

  const indicatorKeys = Object.keys(HEALTH_INDICATORS) as IndicatorId[];

  const handleInputChange = (id: IndicatorId, valStr: string) => {
    if (valStr.trim() === "") {
      setReading(id, null);
      return;
    }
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      setReading(id, num);
    }
  };

  const handleSave = () => {
    evaluateHealth();
    setNotification("Chequeo biomédico registrado y comparado con línea base personal.");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="bg-space-surface border border-space-border rounded-2xl p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
            MÓDULO DE ENTRADA DE DATOS // RETO NASA SPACE APPS
          </span>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Chequeo Diario de los 6 Indicadores Clave + Radiación
          </h3>
          <p className="text-xs text-slate-400">
            Valores comparados automáticamente con la línea base individual (L-30). Los campos vacíos se registrarán como <strong>Sin Datos</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToBaselines}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-mono text-slate-400 hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restablecer Basales
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
          >
            <Save className="w-3.5 h-3.5" />
            Evaluar Chequeo
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Grid de Inputs de los Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {indicatorKeys.map((key) => {
          const def = HEALTH_INDICATORS[key];
          const val = currentReadings[key];
          const baseline = baselines[key];
          const isMissing = val === null || val === undefined;

          return (
            <div
              key={key}
              className={`p-4 rounded-xl border transition-all ${
                isMissing
                  ? "bg-slate-950/40 border-slate-800"
                  : "bg-slate-950/80 border-slate-700/80"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">{def.hrpRiskCategory}</span>
                  <label className="text-xs font-bold text-slate-200 block">{def.name}</label>
                </div>
                {isMissing ? (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    Sin Dato
                  </span>
                ) : (
                  <button
                    onClick={() => setReading(key, null)}
                    className="text-[10px] text-slate-500 hover:text-red-400"
                    title="Borrar para probar dato faltante"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Input con Unidad */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  step="any"
                  min={def.inputRange.min}
                  max={def.inputRange.max}
                  value={val ?? ""}
                  placeholder="Vacío = Sin datos"
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="text-xs text-slate-400 min-w-[50px]">{def.unit}</span>
              </div>

              {/* Comparativa con Línea Base Personal */}
              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-900 pt-2">
                <span>Línea Base: <strong>{baseline.mean}</strong> ± {baseline.standardDeviation}</span>
                {val !== null && (
                  <span
                    className={
                      Math.abs(val - baseline.mean) > baseline.standardDeviation * 2
                        ? "text-red-400 font-bold"
                        : "text-emerald-400"
                    }
                  >
                    Δ {val >= baseline.mean ? "+" : ""}{(val - baseline.mean).toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
