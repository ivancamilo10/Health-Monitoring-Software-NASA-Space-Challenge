"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardMissionOverview, SimulationScenario } from "@/types/mission-health.types";

/**
 * =============================================================================
 * HOOK: USE MISSION TELEMETRY (MISSION CONTROL DATA POLLING)
 * =============================================================================
 * @responsible DESARROLLADOR C (Frontend & Mission Control UI/UX)
 * @description
 * Maneja la obtención continua de datos de telemetría y el disparo de escenarios
 * de crisis. Cuenta con respaldo de datos simulados en memoria para que el
 * Desarrollador C pueda diseñar toda la interfaz visual sin depender de que
 * la base de datos de Supabase esté activa.
 * 
 * @developer DESARROLLADOR C (Frontend & UI/UX)
 */

const FALLBACK_DASHBOARD: DashboardMissionOverview = {
  missionName: "ARTEMIS-ORION-ALPHA",
  missionTimeElapsed: "MET 14d 06h 32m",
  overallMissionStatus: "NOMINAL",
  activeCrewCount: 2,
  crewStatuses: [
    {
      astronautId: "astro-artemis-001",
      name: "Cmdr. Alex Vance",
      missionRole: "Commander / EVA Lead",
      currentRiskScore: 12,
      status: "NOMINAL",
      latestVitals: { heartRate: 72, hrv: 58, spo2: 99, coreTemp: 36.7 },
      latestEnvironment: { suitPressure: 14.7, cabinCo2: 1.9, solarRadiationIndex: 12.0 },
      currentActivity: "REST",
      lastTelemetryTimestamp: new Date().toISOString(),
    },
    {
      astronautId: "astro-artemis-002",
      name: "Dr. Elena Rostova",
      missionRole: "Medical Officer / Flight Engineer",
      currentRiskScore: 16,
      status: "NOMINAL",
      latestVitals: { heartRate: 68, hrv: 62, spo2: 98, coreTemp: 36.6 },
      latestEnvironment: { suitPressure: 14.7, cabinCo2: 1.9, solarRadiationIndex: 12.0 },
      currentActivity: "REST",
      lastTelemetryTimestamp: new Date().toISOString(),
    },
  ],
  criticalIncidentsLast24h: 0,
};

export function useMissionTelemetry(pollingIntervalMs: number = 3000) {
  const [data, setData] = useState<DashboardMissionOverview>(FALLBACK_DASHBOARD);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInjectingCrisis, setIsInjectingCrisis] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/dashboard/status");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json: DashboardMissionOverview = await res.json();
      setData(json);
      setLastError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error de red con la telemetría";
      setLastError(message);
      // Mantiene el fallback para no quebrar la UI durante la presentación
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [fetchStatus, pollingIntervalMs]);

  /**
   * Inyecta una contingencia durante la demo ante el jurado de la NASA
   */
  const triggerSimulation = async (scenario: SimulationScenario, astronautId?: string) => {
    setIsInjectingCrisis(true);
    try {
      const res = await fetch("/api/v1/simulation/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, astronautId, persist: true }),
      });
      if (!res.ok) throw new Error("Fallo al inyectar crisis");
      await fetchStatus();
    } catch (err: unknown) {
      console.error("Error al inyectar escenario:", err);
    } finally {
      setIsInjectingCrisis(false);
    }
  };

  return {
    dashboardData: data,
    isLoading,
    isInjectingCrisis,
    lastError,
    triggerSimulation,
    refreshNow: fetchStatus,
  };
}
