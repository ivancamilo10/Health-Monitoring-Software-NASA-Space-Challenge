"use client";

import { useMissionTelemetry } from "@/hooks/use-mission-telemetry";
import { CrewTelemetryCard } from "@/components/mission-control/crew-telemetry-card";
import { EclssEnvironmentalPanel } from "@/components/mission-control/eclss-environmental-panel";
import { AutonomousAlertBanner } from "@/components/mission-control/autonomous-alert-banner";
import { CrisisInjectionConsole } from "@/components/mission-control/crisis-injection-console";

export default function MissionControlDashboard() {
  const { dashboardData, isLoading, isInjectingCrisis, triggerSimulation } =
    useMissionTelemetry(2500);

  const primaryAstronaut = dashboardData.crewStatuses[0];
  const primaryEnvironment = primaryAstronaut?.latestEnvironment ?? {
    suitPressure: 14.7,
    cabinCo2: 1.9,
    solarRadiationIndex: 12.0,
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Estilo NASA Mission Control HUD */}
      <header className="border-b border-cyan-900/40 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              NASA Space Apps Challenge 2026 // Deep Space Operations
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
            Autonomous Bio-Telemetry & Triage Platform
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Misión: <span className="text-cyan-300 font-bold">{dashboardData.missionName}</span> | Tiempo de Vuelo:{" "}
            <span className="text-slate-200">{dashboardData.missionTimeElapsed}</span> | Modo:{" "}
            <span className="text-amber-300 font-bold">AUTONOMOUS DEEP SPACE (LATENCIA CRÍTICA MARTE/LUNA)</span>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-lg font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">CREW ALIVE & TRACKED</span>
            <span className="text-cyan-400 font-bold text-sm">
              {dashboardData.activeCrewCount} ASTRONAUTAS
            </span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="text-slate-500 block text-[10px]">GLOBAL MISSION HEALTH</span>
            <span
              className={`font-bold text-sm ${
                dashboardData.overallMissionStatus === "EMERGENCY"
                  ? "text-red-400 animate-pulse"
                  : dashboardData.overallMissionStatus === "WARNING"
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {dashboardData.overallMissionStatus}
            </span>
          </div>
        </div>
      </header>

      {/* Banner de Triage Autónomo de Emergencia */}
      <AutonomousAlertBanner
        severity={dashboardData.overallMissionStatus}
        activeContingency={primaryAstronaut?.activeContingency}
        autonomousActionTaken={
          dashboardData.overallMissionStatus === "EMERGENCY"
            ? "Presurización auxiliar de traje a 4.2 psi e inyección prioritaria de O2 al 100%."
            : dashboardData.overallMissionStatus === "WARNING"
            ? "Ventilación máxima forzada de scrubbers LiOH activada para absorción de CO2."
            : undefined
        }
      />

      {/* Consola de Demostración para los Jueces de la NASA */}
      <CrisisInjectionConsole
        onInject={(scenario) => triggerSimulation(scenario, primaryAstronaut?.astronautId)}
        isLoading={isInjectingCrisis}
      />

      {/* Grid Principal: Telemetría de la Tripulación */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase font-bold text-slate-300 tracking-wider">
            // BIOMETRÍA DE LA TRIPULACIÓN EN TIEMPO REAL
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            {isLoading ? "Sincronizando sensores..." : "Sensado a 1 Hz"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData.crewStatuses.map((astronaut) => (
            <CrewTelemetryCard key={astronaut.astronautId} astronaut={astronaut} />
          ))}
        </div>
      </section>

      {/* Panel de Soporte Vital y Entorno (ECLSS) */}
      <EclssEnvironmentalPanel
        environment={primaryEnvironment}
        isEvaActive={primaryAstronaut?.currentActivity === "EVA_SPACEWALK"}
      />

      {/* Mapa de Responsabilidades del Equipo (3 Desarrolladores) */}
      <section className="border border-slate-800 bg-slate-950/60 rounded-xl p-5 font-mono text-xs">
        <h3 className="text-xs font-bold uppercase text-cyan-400 tracking-wider mb-3">
          // ARQUITECTURA PARALELA DE 3 DESARROLLADORES (ZERO-CONFLICT SPRINT)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-400">
          <div className="p-3 bg-slate-900/60 rounded border border-cyan-900/30">
            <span className="text-cyan-400 font-bold block mb-1">👨‍💻 DESARROLLADOR A (APIs & Datos)</span>
            <p className="text-[11px] mb-2 text-slate-300">
              Endpoints App Router, transacciones Prisma y persistencia en Supabase.
            </p>
            <span className="text-slate-500 block text-[10px]">
              Zona: /src/app/api/v1/*, /src/repositories/*, /prisma/*
            </span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded border border-purple-900/30">
            <span className="text-purple-400 font-bold block mb-1">👨‍🔬 DESARROLLADOR B (Lógica & Biomédica)</span>
            <p className="text-[11px] mb-2 text-slate-300">
              Algoritmos biofísicos espaciales, normalización por actividad y triage autónomo.
            </p>
            <span className="text-slate-500 block text-[10px]">
              Zona: /src/core-logic/*
            </span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded border border-emerald-900/30">
            <span className="text-emerald-400 font-bold block mb-1">🎨 DESARROLLADOR C (Frontend & UI/UX)</span>
            <p className="text-[11px] mb-2 text-slate-300">
              Mission Control HUD, consolas de alerta, gráficos biofísicos y herramientas de demo.
            </p>
            <span className="text-slate-500 block text-[10px]">
              Zona: /src/components/*, /src/hooks/*, /src/app/page.tsx
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 pt-4 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-slate-500">
        <div>Contrato de Equipo: <span className="text-cyan-400">/src/types/mission-health.types.ts</span></div>
        <div>NASA Space Apps Challenge 2026 &bull; Artemis & Mars Autonomous Medical Shield</div>
      </footer>
    </main>
  );
}
