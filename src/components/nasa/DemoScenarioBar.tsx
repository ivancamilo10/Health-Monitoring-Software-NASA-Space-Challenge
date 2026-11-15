"use client";

import React from "react";
import { useHealthStore } from "@/store/health-store";
import { Flame, Eye, HelpCircle, CheckCircle2, Play } from "lucide-react";

export function DemoScenarioBar() {
  const { loadDemoScenario, activeScenarioName } = useHealthStore();

  return (
    <div className="bg-slate-900/90 border border-cyan-900/40 rounded-2xl p-4 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            CONSOLA DE INYECCIÓN DE ESCENARIOS (DEMO DE 3 MINUTOS JURADO NASA)
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Escenario Activo: <strong className="text-white">{activeScenarioName}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <button
          onClick={() => loadDemoScenario("RUTINA_NORMAL")}
          className="p-2.5 bg-slate-950/80 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            1. RUTINA NORMAL (CALMA)
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Signos vitales estables y sueño en Vigilar (6.4h).
          </p>
        </button>

        <button
          onClick={() => loadDemoScenario("TORMENTA_SOLAR")}
          className="p-2.5 bg-slate-950/80 hover:bg-red-950/30 border border-slate-800 hover:border-red-500/50 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-1">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            2. TORMENTA SOLAR (SPE)
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Tasa de radiación a 2800 µSv; activa patrón agrupado.
          </p>
        </button>

        <button
          onClick={() => loadDemoScenario("AISLAMIENTO_PROLONGADO")}
          className="p-2.5 bg-slate-950/80 hover:bg-orange-950/30 border border-slate-800 hover:border-orange-500/50 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 mb-1">
            <Eye className="w-3.5 h-3.5" />
            3. AISLAMIENTO PROLONGADO
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Sueño bajo (&lt;4h) y ánimo 2/5; patrón circadiano.
          </p>
        </button>

        <button
          onClick={() => loadDemoScenario("SIN_DATOS")}
          className="p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            4. INTEGRIDAD: 'SIN DATOS'
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Campos vacíos en gris; demuestra que dato faltante ≠ bien.
          </p>
        </button>
      </div>
    </div>
  );
}
