import React from "react";
import { BiometricPayload } from "@/types/mission-health.types";

/**
 * =============================================================================
 * COMPONENT: ECLSS & ENVIRONMENTAL MONITORING PANEL
 * =============================================================================
 * @responsible DESARROLLADOR C (Frontend & UI/UX Espacial)
 * @description
 * Muestra las constantes vitales de cabina y traje espacial (ECLSS).
 * Monitorea presión atmosférica, nivel de dióxido de carbono y radiación cósmica.
 * 
 * @developer DESARROLLADOR C
 */

interface EclssEnvironmentalPanelProps {
  environment: BiometricPayload["environment"];
  isEvaActive?: boolean;
}

export function EclssEnvironmentalPanel({
  environment,
  isEvaActive = false,
}: EclssEnvironmentalPanelProps) {
  const isSuitPressureCritical = isEvaActive
    ? environment.suitPressure < 3.8
    : environment.suitPressure < 12.0;

  const isCo2Dangerous = environment.cabinCo2 > 6.0;
  const isRadiationCritical = environment.solarRadiationIndex > 100;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-cyan-400">
          // ECLSS & ENVIRONMENT STATUS
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {isEvaActive ? "EVA SUIT MODE" : "CABIN HABITAT"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        {/* Presión del Traje / Cabina */}
        <div
          className={`p-3 rounded-lg border ${
            isSuitPressureCritical
              ? "bg-red-950/30 border-red-500/50"
              : "bg-slate-950/70 border-slate-800"
          }`}
        >
          <span className="text-slate-400 text-[10px] block">SUIT / CABIN PRESSURE</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-xl font-bold ${
                isSuitPressureCritical ? "text-red-400" : "text-white"
              }`}
            >
              {environment.suitPressure.toFixed(1)}
            </span>
            <span className="text-slate-500 text-xs">psi</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Nominal: {isEvaActive ? "4.1 - 4.5 psi" : "14.2 - 14.7 psi"}
          </span>
        </div>

        {/* Dióxido de Carbono (CO2) */}
        <div
          className={`p-3 rounded-lg border ${
            isCo2Dangerous
              ? "bg-amber-950/30 border-amber-500/50"
              : "bg-slate-950/70 border-slate-800"
          }`}
        >
          <span className="text-slate-400 text-[10px] block">PARTIAL CO2 PRESSURE</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-xl font-bold ${
                isCo2Dangerous ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {environment.cabinCo2.toFixed(1)}
            </span>
            <span className="text-slate-500 text-xs">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Límite Tóxico: &gt; 5.0 mmHg
          </span>
        </div>

        {/* Radiación Solar Cósmica */}
        <div
          className={`p-3 rounded-lg border ${
            isRadiationCritical
              ? "bg-red-950/30 border-red-500/50"
              : "bg-slate-950/70 border-slate-800"
          }`}
        >
          <span className="text-slate-400 text-[10px] block">SOLAR RADIATION DOSERATE</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-xl font-bold ${
                isRadiationCritical ? "text-red-400" : "text-cyan-400"
              }`}
            >
              {environment.solarRadiationIndex.toFixed(0)}
            </span>
            <span className="text-slate-500 text-xs">µSv/h</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Tormenta Solar: &gt; 100 µSv/h
          </span>
        </div>
      </div>
    </div>
  );
}
