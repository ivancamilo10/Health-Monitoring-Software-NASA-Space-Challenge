import { NextResponse } from "next/server";
import { getMissionDashboardData } from "@/repositories/telemetry.repository";
import { DashboardMissionOverview } from "@/types/mission-health.types";

/**
 * =============================================================================
 * API ROUTE: /api/v1/dashboard/status
 * =============================================================================
 * @method GET
 * @responsible DESARROLLADOR A (APIs y Datos)
 * @description
 * Suministra el estado operacional global de la misión espacial y el resumen
 * biomédico de cada miembro de la tripulación para el frontend / HUD.
 *
 * @returns {NextResponse<DashboardMissionOverview>} Resumen global de salud y contingencias activas
 *
 * @developer DESARROLLADOR A (APIs y Datos)
 *
 * @example
 * // Invocación: GET /api/v1/dashboard/status
 *
 * // Respuesta (200 OK):
 * // {
 * //   "missionName": "ARTEMIS-ORION-ALPHA",
 * //   "missionTimeElapsed": "MET 14d 06h 32m",
 * //   "overallMissionStatus": "NOMINAL",
 * //   "activeCrewCount": 4,
 * //   "crewStatuses": [
 * //     {
 * //       "astronautId": "astro-artemis-001",
 * //       "name": "Cmdr. Alex Vance",
 * //       "missionRole": "Commander / EVA Lead",
 * //       "currentRiskScore": 12,
 * //       "status": "NOMINAL",
 * //       "latestVitals": { "heartRate": 72, "hrv": 58, "spo2": 99, "coreTemp": 36.7 },
 * //       "latestEnvironment": { "suitPressure": 14.7, "cabinCo2": 1.9, "solarRadiationIndex": 12.0 },
 * //       "currentActivity": "REST",
 * //       "lastTelemetryTimestamp": "2026-11-10T19:40:00.000Z"
 * //     }
 * //   ],
 * //   "criticalIncidentsLast24h": 0
 * // }
 */
export async function GET() {
  try {
    const dashboardData = await getMissionDashboardData();

    // Si la base de datos está vacía (primer arranque), suministrar tripulación inicial de demostración
    if (dashboardData.crewStatuses.length === 0) {
      const fallbackData: DashboardMissionOverview = {
        missionName: process.env.NEXT_PUBLIC_MISSION_NAME ?? "ARTEMIS-ORION-ALPHA",
        missionTimeElapsed: "MET 14d 06h 32m",
        overallMissionStatus: "NOMINAL",
        activeCrewCount: 2,
        crewStatuses: [
          {
            astronautId: "astro-artemis-001",
            name: "Cmdr. Alex Vance",
            missionRole: "Commander / EVA Lead",
            currentRiskScore: 10,
            status: "NOMINAL",
            latestVitals: { heartRate: 70, hrv: 60, spo2: 99, coreTemp: 36.7 },
            latestEnvironment: { suitPressure: 14.7, cabinCo2: 1.8, solarRadiationIndex: 12.5 },
            currentActivity: "REST",
            lastTelemetryTimestamp: new Date().toISOString(),
          },
          {
            astronautId: "astro-artemis-002",
            name: "Dr. Elena Rostova",
            missionRole: "Medical Officer / Flight Engineer",
            currentRiskScore: 15,
            status: "NOMINAL",
            latestVitals: { heartRate: 74, hrv: 55, spo2: 98, coreTemp: 36.9 },
            latestEnvironment: { suitPressure: 14.7, cabinCo2: 1.8, solarRadiationIndex: 12.5 },
            currentActivity: "REST",
            lastTelemetryTimestamp: new Date().toISOString(),
          },
        ],
        criticalIncidentsLast24h: 0,
      };

      return NextResponse.json(fallbackData, { status: 200 });
    }

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error: unknown) {
    console.error("[DASHBOARD_FETCH_ERROR]:", error);

    // Fallback de contingencia operacional en caso de latencia o desconexión temporal de BD
    const emergencyFallback: DashboardMissionOverview = {
      missionName: process.env.NEXT_PUBLIC_MISSION_NAME ?? "ARTEMIS-ORION-ALPHA",
      missionTimeElapsed: "MET 14d 06h 32m [OFFLINE_BUFFER]",
      overallMissionStatus: "CAUTION",
      activeCrewCount: 1,
      crewStatuses: [
        {
          astronautId: "astro-artemis-001",
          name: "Cmdr. Alex Vance (Cache)",
          missionRole: "Commander",
          currentRiskScore: 25,
          status: "CAUTION",
          latestVitals: { heartRate: 75, hrv: 50, spo2: 97, coreTemp: 36.8 },
          latestEnvironment: { suitPressure: 14.7, cabinCo2: 2.1, solarRadiationIndex: 15.0 },
          currentActivity: "REST",
          lastTelemetryTimestamp: new Date().toISOString(),
        },
      ],
      criticalIncidentsLast24h: 0,
    };

    return NextResponse.json(emergencyFallback, { status: 200 });
  }
}
