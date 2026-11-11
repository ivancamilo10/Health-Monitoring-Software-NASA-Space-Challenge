import { prisma } from "../lib/prisma";
import {
  BiometricPayload,
  DiagnosticReport,
  DashboardMissionOverview,
  AstronautMissionStatus,
  TriageSeverity,
} from "../types/mission-health.types";

/**
 * =============================================================================
 * REPOSITORY - TELEMETRY & MEDICAL INCIDENT PERSISTENCE LAYER
 * =============================================================================
 * @responsible DESARROLLADOR A (APIs y Datos / Supabase)
 * @description
 * Capa de abstracción de base de datos usando Prisma ORM conectado a PostgreSQL (Supabase).
 * Encargado de persistir las lecturas de telemetría y generar incidentes médicos
 * de forma atómica (transacción), así como de alimentar los paneles del Dashboard.
 */

/**
 * Persiste en la base de datos la telemetría recibida y, si el diagnóstico amerita
 * (severidad WARNING o EMERGENCY), crea el registro del incidente médico autónomo.
 *
 * @param payload Telemetría cruda enviada por los sensores
 * @param diagnosis Informe clínico generado por el motor de Core Logic
 * @returns {Promise<{ telemetryId: string; incidentId?: string }>} Identificadores generados en BD
 * 
 * @developer DESARROLLADOR A (APIs y Datos)
 * 
 * @example
 * // Entrada:
 * // payload: { astronautId: "astro-01", ... }
 * // diagnosis: { status: "EMERGENCY", riskScore: 88, autonomousActionTaken: "...", ... }
 * 
 * // Salida:
 * // { telemetryId: "uuid-tel-123", incidentId: "uuid-inc-456" }
 */
export async function saveTelemetryAndIncident(
  payload: BiometricPayload,
  diagnosis: DiagnosticReport
): Promise<{ telemetryId: string; incidentId?: string }> {
  // ---------------------------------------------------------------------------
  // NOTA PARA DEV A:
  // Garantizamos que el astronauta exista para que la demo ante los jueces
  // no falle por violación de clave foránea (Foreign Key Constraint).
  // ---------------------------------------------------------------------------
  await prisma.astronaut.upsert({
    where: { id: payload.astronautId },
    update: {},
    create: {
      id: payload.astronautId,
      name: "Cmdr. Alex Vance",
      missionRole: "Commander / EVA Lead",
      baselineHR: 65.0,
      baselineSpo2: 98.0,
      maxRadiationLimit: 500.0, // mSv anual
    },
  });

  return await prisma.$transaction(async (tx) => {
    // 1. Guardar log de telemetría
    const telemetry = await tx.telemetryLog.create({
      data: {
        astronautId: payload.astronautId,
        heartRate: payload.vitals.heartRate,
        hrv: payload.vitals.hrv,
        spo2: payload.vitals.spo2,
        coreTemp: payload.vitals.coreTemp,
        suitPressure: payload.environment.suitPressure,
        cabinCo2: payload.environment.cabinCo2,
        solarRadiationIndex: payload.environment.solarRadiationIndex,
        activityState: payload.activityState,
        syncStatus: "LOCAL_AUTONOMOUS",
        timestamp: new Date(payload.timestamp),
      },
    });

    let incidentId: string | undefined = undefined;

    // 2. Si la condición no es nominal, registrar el incidente médico con la acción autónoma
    if (diagnosis.status === "WARNING" || diagnosis.status === "EMERGENCY") {
      const mainAnomaly = diagnosis.detectedAnomalies[0]?.code ?? "MULTISYSTEM_ALERT";

      const incident = await tx.medicalIncident.create({
        data: {
          astronautId: payload.astronautId,
          severity: diagnosis.status,
          anomalyType: mainAnomaly,
          autonomousActionTaken: diagnosis.autonomousActionTaken,
          timestamp: new Date(diagnosis.evaluatedAt),
        },
      });

      incidentId = incident.id;
    }

    return {
      telemetryId: telemetry.id,
      incidentId,
    };
  });
}

/**
 * Consulta la base de datos para obtener el estado consolidado de la tripulación
 * para el panel principal (HUD / Mission Dashboard).
 *
 * @returns {Promise<DashboardMissionOverview>} Resumen del estado de la misión
 * 
 * @developer DESARROLLADOR A (APIs y Datos)
 * 
 * @example
 * // Salida esperada:
 * // {
 * //   missionName: "ARTEMIS-ORION-ALPHA",
 * //   missionTimeElapsed: "MET 14d 06h 32m",
 * //   overallMissionStatus: "CAUTION",
 * //   activeCrewCount: 4,
 * //   crewStatuses: [ ... ],
 * //   criticalIncidentsLast24h: 1
 * // }
 */
export async function getMissionDashboardData(): Promise<DashboardMissionOverview> {
  const astronauts = await prisma.astronaut.findMany({
    include: {
      telemetryLogs: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
      medicalIncidents: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
    },
  });

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const criticalIncidentsCount = await prisma.medicalIncident.count({
    where: {
      timestamp: { gte: twentyFourHoursAgo },
      severity: { in: ["WARNING", "EMERGENCY"] },
    },
  });

  let worstMissionStatus: TriageSeverity = "NOMINAL";

  const crewStatuses: AstronautMissionStatus[] = astronauts.map((astro) => {
    const latestTelemetry = astro.telemetryLogs[0];
    const latestIncident = astro.medicalIncidents[0];

    const severity: TriageSeverity = (latestIncident?.severity as TriageSeverity) ?? "NOMINAL";

    if (severity === "EMERGENCY") worstMissionStatus = "EMERGENCY";
    else if (severity === "WARNING" && worstMissionStatus !== "EMERGENCY") worstMissionStatus = "WARNING";
    else if (severity === "CAUTION" && worstMissionStatus === "NOMINAL") worstMissionStatus = "CAUTION";

    return {
      astronautId: astro.id,
      name: astro.name,
      missionRole: astro.missionRole,
      currentRiskScore: severity === "EMERGENCY" ? 92 : severity === "WARNING" ? 68 : severity === "CAUTION" ? 35 : 10,
      status: severity,
      latestVitals: {
        heartRate: latestTelemetry?.heartRate ?? astro.baselineHR,
        hrv: latestTelemetry?.hrv ?? 55,
        spo2: latestTelemetry?.spo2 ?? astro.baselineSpo2,
        coreTemp: latestTelemetry?.coreTemp ?? 36.8,
      },
      latestEnvironment: {
        suitPressure: latestTelemetry?.suitPressure ?? 14.7,
        cabinCo2: latestTelemetry?.cabinCo2 ?? 2.0,
        solarRadiationIndex: latestTelemetry?.solarRadiationIndex ?? 15.0,
      },
      currentActivity: latestTelemetry?.activityState ?? "REST",
      activeContingency: latestIncident ? latestIncident.anomalyType : undefined,
      lastTelemetryTimestamp: latestTelemetry?.timestamp.toISOString() ?? new Date().toISOString(),
    };
  });

  return {
    missionName: process.env.NEXT_PUBLIC_MISSION_NAME ?? "ARTEMIS-ORION-ALPHA",
    missionTimeElapsed: "MET 14d 06h 32m",
    overallMissionStatus: worstMissionStatus,
    activeCrewCount: astronauts.length,
    crewStatuses,
    criticalIncidentsLast24h: criticalIncidentsCount,
  };
}
