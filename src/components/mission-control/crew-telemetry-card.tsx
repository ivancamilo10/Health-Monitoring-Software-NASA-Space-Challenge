import React from "react";
import { AstronautMissionStatus } from "@/types/mission-health.types";

/**
 * =============================================================================
 * COMPONENT: CREW TELEMETRY CARD
 * =============================================================================
 * @responsible DESARROLLADOR C (Frontend & UI/UX Espacial)
 * @description
 * Tarjeta individual de signos vitales para cada astronauta con codificación
 * visual de alerta y normalización según el estado de actividad (SLEEP, EVA, REST).
 * 
 * @developer DESARROLLADOR C
 * 
 * @example
 * <CrewTelemetryCard astronaut={crewMember} />
 */

interface CrewTelemetryCardProps {
  astronaut: AstronautMissionStatus;
}

export function CrewTelemetryCard({ astronaut }: CrewTelemetryCardProps) {
  const isEmergency = astronaut.status === "EMERGENCY";
  const isWarning = astronaut.status === "WARNING";
  const isCaution = astronaut.status === "CAUTION";

  const borderColor = isEmergency
    ? "border-red-500 shadow-red-500/20 shadow-lg"
    : isWarning
    ? "border-amber-500 shadow-amber-500/10 shadow-md"
    : isCaution
    ? "border-yellow-400"
    : "border-slate-800";

  const statusBadge = isEmergency
    ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
    : isWarning
    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
    : isCaution
    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";

  return (
    <div className={`bg-slate-900/80 border ${borderColor} rounded-xl p-5 transition-all duration-300 relative`}>
      {/* Encabezado del Tripulante */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            {astronaut.missionRole}
          </span>
          <h3 className="text-lg font-bold text-white tracking-wide">{astronaut.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${statusBadge}`}>
            {astronaut.status}
          </span>
          <span className="text-[11px] font-mono text-cyan-300">
            {astronaut.currentActivity}
          </span>
        </div>
      </div>

      {/* Barra de Risk Score (0 a 100) */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-mono mb-1">
          <span className="text-slate-400">BIO-RISK INDEX:</span>
          <span className={`font-bold ${isEmergency ? "text-red-400" : isWarning ? "text-amber-400" : "text-emerald-400"}`}>
            {astronaut.currentRiskScore} / 100
          </span>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 ${
              isEmergency ? "bg-red-500" : isWarning ? "bg-amber-500" : isCaution ? "bg-yellow-400" : "bg-emerald-400"
            }`}
            style={{ width: `${astronaut.currentRiskScore}%` }}
          />
        </div>
      </div>

      {/* Grid de Signos Vitales */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">HEART RATE</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-base font-bold ${astronaut.latestVitals.heartRate > 120 ? "text-red-400" : "text-white"}`}>
              {astronaut.latestVitals.heartRate}
            </span>
            <span className="text-slate-500 text-[10px]">BPM</span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">BLOOD O2 (SpO2)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-base font-bold ${astronaut.latestVitals.spo2 < 92 ? "text-red-400" : "text-cyan-400"}`}>
              {astronaut.latestVitals.spo2}%
            </span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">HRV (SDNN)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-bold text-white">{astronaut.latestVitals.hrv}</span>
            <span className="text-slate-500 text-[10px]">ms</span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">CORE TEMP</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-bold text-white">{astronaut.latestVitals.coreTemp}</span>
            <span className="text-slate-500 text-[10px]">°C</span>
          </div>
        </div>
      </div>

      {/* Alerta de contingencia activa si existe */}
      {astronaut.activeContingency && (
        <div className="mt-3 p-2 bg-red-950/40 border border-red-500/30 rounded text-[11px] font-mono text-red-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span>ALERTA ACTIVA: {astronaut.activeContingency}</span>
        </div>
      )}
    </div>
  );
}
