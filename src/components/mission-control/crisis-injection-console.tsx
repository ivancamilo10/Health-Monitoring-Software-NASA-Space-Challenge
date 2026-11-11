import React from "react";
import { SimulationScenario } from "@/types/mission-health.types";

/**
 * =============================================================================
 * COMPONENT: CRISIS INJECTION CONSOLE (PITCH DEMO TOOL)
 * =============================================================================
 * @responsible DESARROLLADOR C (Frontend & UI/UX Espacial)
 * @description
 * Consola interactiva para el equipo durante el pitch del Hackathon de la NASA.
 * Permite a los presentadores inyectar eventos catastróficos en 1 click para
 * demostrar en vivo la capacidad de respuesta autónoma del software.
 * 
 * @developer DESARROLLADOR C
 */

interface CrisisInjectionConsoleProps {
  onInject: (scenario: SimulationScenario) => void;
  isLoading: boolean;
}

export function CrisisInjectionConsole({ onInject, isLoading }: CrisisInjectionConsoleProps) {
  const scenarios: {
    id: SimulationScenario;
    label: string;
    description: string;
    color: string;
  }[] = [
    {
      id: "NOMINAL",
      label: "🟢 RESTAURAR NOMINAL",
      description: "Signos vitales estables y soporte vital 100% calibrado.",
      color: "hover:border-emerald-500 hover:bg-emerald-950/40 text-emerald-400 border-slate-800",
    },
    {
      id: "SUIT_LEAK",
      label: "⚠️ FUGA DE TRAJE (EVA)",
      description: "Caída de presión a 3.2 psi + taquicardia hipóxica.",
      color: "hover:border-red-500 hover:bg-red-950/40 text-red-400 border-slate-800",
    },
    {
      id: "CO2_TOXICITY",
      label: "☣️ TOXICIDAD POR CO2",
      description: "Falla de LiOH ECLSS con CO2 en 7.8 mmHg.",
      color: "hover:border-amber-500 hover:bg-amber-950/40 text-amber-400 border-slate-800",
    },
    {
      id: "SOLAR_FLARE",
      label: "☢️ TORMENTA SOLAR (SPE)",
      description: "Pico de radiación cósmica a 145 µSv/h.",
      color: "hover:border-purple-500 hover:bg-purple-950/40 text-purple-400 border-slate-800",
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-cyan-900/40 rounded-xl p-5 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">
            // HERRAMIENTA DEMO JURADO NASA: INYECCIÓN DE CONTINGENCIAS
          </h3>
          <p className="text-[11px] text-slate-400">
            Dispara escenarios de emergencia para verificar la toma de decisiones autónoma en tiempo real.
          </p>
        </div>
        {isLoading && (
          <span className="text-xs text-amber-400 font-bold animate-pulse">
            TRANSMITIENDO SIMULACIÓN...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => onInject(sc.id)}
            disabled={isLoading}
            className={`p-3 rounded-lg border bg-slate-950/80 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sc.color}`}
          >
            <div className="font-bold text-xs">{sc.label}</div>
            <div className="text-[10px] text-slate-400 mt-1 leading-tight">{sc.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
