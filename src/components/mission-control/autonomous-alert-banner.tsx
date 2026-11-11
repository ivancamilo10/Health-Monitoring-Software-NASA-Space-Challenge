import React from "react";
import { TriageSeverity } from "@/types/mission-health.types";

/**
 * =============================================================================
 * COMPONENT: AUTONOMOUS TRIAGE ALERT BANNER
 * =============================================================================
 * @responsible DESARROLLADOR C (Frontend & UI/UX Espacial)
 * @description
 * Notificación crítica en el Head-Up Display (HUD) cuando el sistema autónomo
 * detecta una emergencia y activa protocolos de soporte vital automáticos
 * debido a la imposibilidad de esperar respuesta terrestre.
 * 
 * @developer DESARROLLADOR C
 */

interface AutonomousAlertBannerProps {
  severity: TriageSeverity;
  activeContingency?: string;
  autonomousActionTaken?: string;
}

export function AutonomousAlertBanner({
  severity,
  activeContingency,
  autonomousActionTaken,
}: AutonomousAlertBannerProps) {
  if (severity === "NOMINAL") {
    return (
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-300 font-semibold tracking-wide">
            ESTADO OPERACIONAL NOMINAL: Todos los subsistemas fisiológicos y ECLSS en equilibrio.
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">LATENCIA TIERRA: 18m 42s (MODO AUTÓNOMO VIGILANTE)</span>
      </div>
    );
  }

  const isEmergency = severity === "EMERGENCY";

  return (
    <div
      className={`border rounded-xl p-5 font-mono ${
        isEmergency
          ? "bg-red-950/50 border-red-500 text-red-200 shadow-xl shadow-red-500/20 animate-pulse"
          : "bg-amber-950/40 border-amber-500 text-amber-200"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-black bg-red-600 text-white">
            {severity} // TRIAGE AUTÓNOMO ACTIVADO
          </span>
          <span className="text-sm font-bold text-white">
            ANOMALÍA: {activeContingency ?? "ALTERACIÓN MULTISISTÉMICA"}
          </span>
        </div>
        <span className="text-xs text-white/80">
          RESPUESTA DE VUELO: <strong className="text-cyan-300">SIN INTERVENCIÓN TERRESTRE</strong>
        </span>
      </div>

      <div className="mt-3 text-xs space-y-1">
        <p>
          <strong className="text-white">Acción Autónoma Ejecutada a Bordo:</strong>{" "}
          <span className="text-cyan-200">
            {autonomousActionTaken ??
              "Aislamiento de circuito de O2 y balance de presión compensatoria de emergencia."}
          </span>
        </p>
        <p className="text-[11px] text-slate-300">
          * Protocolo médico de emergencia ejecutado inmediatamente por actuadores para preservar la vida del tripulante.
        </p>
      </div>
    </div>
  );
}
