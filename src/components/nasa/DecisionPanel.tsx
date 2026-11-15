"use client";

import React from "react";
import { useHealthStore } from "@/store/health-store";
import { MISSIONS_CONFIG, MissionDestination } from "@/core/missions";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  Radio,
  Satellite,
  Clock,
  Sparkles,
} from "lucide-react";

export function DecisionPanel() {
  const {
    mission,
    setMission,
    decisionReport,
    astronautName,
    astronautRole,
    commsCountdownSeconds,
    activeScenarioName,
    sendReportToEarth,
  } = useHealthStore();

  const missionConfig = MISSIONS_CONFIG[mission];

  // Renderizador de iconos accesibles por forma según el Brief
  const renderStatusIcon = (state: string) => {
    switch (state) {
      case "HABITUAL":
        return <CheckCircle2 className="w-8 h-8 text-emerald-400" />;
      case "VIGILAR":
        return <AlertTriangle className="w-8 h-8 text-amber-400" />;
      case "ATENCION":
        return <ShieldAlert className="w-8 h-8 text-orange-400" />;
      case "ESCALAR_TIERRA":
        return <AlertOctagon className="w-8 h-8 text-red-500 animate-pulse" />;
      case "SIN_DATOS":
      default:
        return <HelpCircle className="w-8 h-8 text-slate-400" />;
    }
  };

  const getBorderColor = (state: string) => {
    switch (state) {
      case "ESCALAR_TIERRA":
        return "border-red-500 bg-red-950/30 shadow-red-500/20";
      case "ATENCION":
        return "border-orange-500 bg-orange-950/20 shadow-orange-500/10";
      case "VIGILAR":
        return "border-amber-500 bg-amber-950/20";
      case "HABITUAL":
      default:
        return "border-emerald-500/40 bg-emerald-950/10";
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Advertencia Científica Obligatoria (NASA HRP) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-4 py-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-slate-300">NASA SPACE APPS CHALLENGE 2026 // THE NEXT FRONTIER</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-semibold">[PROTOTIPO DE INVESTIGACIÓN - NO ES DISPOSITIVO MÉDICO]</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>DATOS SIMULADOS BASADOS EN LÍNEA BASE L-30</span>
        </div>
      </div>

      {/* Selector de Misión & Retardo de Comunicaciones */}
      <div className="bg-space-surface border border-space-border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
            DESTINO DE LA MISIÓN ESPACIAL
          </span>
          <div className="flex items-center gap-2 mt-1">
            {(["ISS", "LUNA", "MARTE"] as MissionDestination[]).map((dest) => (
              <button
                key={dest}
                onClick={() => setMission(dest)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  mission === dest
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {dest === "ISS" ? "🛰️ ISS (LEO)" : dest === "LUNA" ? "🌕 LUNA (ARTEMIS)" : "🔴 MARTE (PROFUNDO)"}
              </button>
            ))}
          </div>
        </div>

        {/* Indicador de Latencia a Tierra */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-lg text-xs font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-slate-500 text-[10px] block">RETRASO DE COMUNICACIÓN CON LA TIERRA</span>
              <span className="font-bold text-white">{missionConfig.oneWayDelayDisplay}</span>
            </div>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="text-slate-500 text-[10px] block">GRAVEDAD AMBIENTAL</span>
            <span className="text-amber-300 font-bold">{missionConfig.gravityLabel}</span>
          </div>
        </div>
      </div>

      {/* PANTALLA PRINCIPAL DE DECISIÓN: "¿CÓMO ESTOY Y QUÉ HAGO AHORA?" */}
      <div className={`border-2 rounded-2xl p-6 transition-all duration-300 shadow-xl ${getBorderColor(decisionReport.overallState)}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            {renderStatusIcon(decisionReport.overallState)}
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
                EVALUACIÓN CLÍNICA Y OPERACIONAL DE A BORDO
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {decisionReport.overallStateLabel}
              </h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-end md:items-center gap-3 font-mono text-xs">
            {decisionReport.missingIndicatorsCount > 0 && (
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                ⚠️ {decisionReport.missingIndicatorsCount} Sin Datos (Gris)
              </span>
            )}
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300">
              Tripulante: <strong>{astronautName}</strong> ({astronautRole})
            </span>
          </div>
        </div>

        {/* ACCIÓN PRIORITARIA INMEDIATA */}
        <div className="mt-5 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            ¿QUÉ DEBO HACER AHORA MISMO? (ACCIÓN RECOMENDADA)
          </span>
          <div className="p-4 bg-slate-950/80 border border-white/10 rounded-xl text-slate-100 font-mono text-sm leading-relaxed">
            {decisionReport.primaryAction}
          </div>
        </div>

        {/* Botón de Escalado hacia Cirujanos de Vuelo (Flight Surgeon) */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="text-xs font-mono text-slate-400">
            Escenario Activo: <span className="text-slate-200 font-bold">{activeScenarioName}</span>
          </div>

          <div className="flex items-center gap-3">
            {commsCountdownSeconds !== null ? (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-mono">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>En tránsito hacia Houston ({commsCountdownSeconds}s restantes)</span>
              </div>
            ) : (
              <button
                onClick={sendReportToEarth}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-cyan-600/30"
              >
                <Satellite className="w-4 h-4" />
                EMPAQUETAR Y TRANSMITIR A TIERRA (DSN)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
