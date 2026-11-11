/**
 * =============================================================================
 * NASA SPACE APPS CHALLENGE - MISSION HEALTH ARCHITECTURE CONTRACT
 * =============================================================================
 * Este archivo actúa como la ÚNICA FUENTE DE LA VERDAD (Single Source of Truth)
 * entre el Desarrollador A (APIs y Repositorios) y el Desarrollador B (Core Logic).
 *
 * Cualquier modificación a estos contratos debe ser consensuada por ambos.
 */

// -----------------------------------------------------------------------------
// 1. ESCENARIOS Y ESTADOS DE MISIÓN
// -----------------------------------------------------------------------------

/**
 * Escenarios de contingencia que pueden ser inyectados durante la evaluación o demo ante el jurado de la NASA.
 */
export type SimulationScenario =
  | "NOMINAL"        // Parámetros fisiológicos y ambientales estables
  | "SOLAR_FLARE"    // Evento de partículas solares (SPE) - Radiación extrema
  | "SUIT_LEAK"      // Despresurización rápida en traje EVA (riesgo de hipoxia/ebullismo)
  | "CO2_TOXICITY";  // Falla de absorbente LiOH del ECLSS - Hipercapnia aguda

/**
 * Nivel de actividad física del astronauta (crítico para normalizar el ritmo cardíaco).
 */
export type ActivityState = "SLEEP" | "REST" | "EXERCISE" | "EVA_SPACEWALK";

/**
 * Nivel de severidad clínica o de supervivencia.
 */
export type TriageSeverity = "NOMINAL" | "CAUTION" | "WARNING" | "EMERGENCY";

/**
 * Estado de sincronización respecto a la estación de control terrestre (MCC Houston).
 */
export type SyncStatus = "LOCAL_AUTONOMOUS" | "SYNCED_EARTH";

// -----------------------------------------------------------------------------
// 2. ENTRADA DE DATOS: TELEMETRÍA CRUDA DE SENSORES Y ENTORNO
// -----------------------------------------------------------------------------

/**
 * @interface BiometricPayload
 * @description Estructura de datos generada por el traje espacial (EMU), sensores bio-adhesivos y subsistema ECLSS.
 * 
 * @example
 * ```json
 * {
 *   "astronautId": "astro-artemis-001",
 *   "timestamp": "2026-11-10T20:00:00.000Z",
 *   "vitals": {
 *     "heartRate": 158.0,
 *     "hrv": 18.5,
 *     "spo2": 88.0,
 *     "coreTemp": 38.6
 *   },
 *   "environment": {
 *     "suitPressure": 3.2,
 *     "cabinCo2": 4.5,
 *     "solarRadiationIndex": 125.0
 *   },
 *   "activityState": "EVA_SPACEWALK"
 * }
 * ```
 */
export interface BiometricPayload {
  astronautId: string;
  timestamp: string; // ISO 8601 UTC
  vitals: {
    heartRate: number; // BPM (60 - 200)
    hrv: number;       // Variabilidad de frecuencia cardíaca (SDNN en ms)
    spo2: number;      // Porcentaje de saturación de O2 (0 - 100%)
    coreTemp: number;  // Temperatura corporal central en grados Celsius
  };
  environment: {
    suitPressure: number;        // Presión en psi (Nominal traje: 4.3 psi / Cabina: 14.7 psi)
    cabinCo2: number;            // Presión parcial de CO2 en mmHg (Nominal < 3 mmHg)
    solarRadiationIndex: number; // Tasa de radiación cósmica actual en µSv/h
  };
  activityState: ActivityState;
}

// -----------------------------------------------------------------------------
// 3. SALIDA DE DATOS: DIAGNÓSTICO Y CONTRAMEDIDAS AUTÓNOMAS
// -----------------------------------------------------------------------------

/**
 * Protocolo de contramedida inmediata que el sistema despliega a bordo del módulo o traje.
 */
export interface CountermeasureProtocol {
  protocolCode: string;                 // Ej: "EVA-ABORT-04", "O2-FLUSH-01", "RADIATION-STORM-SHELTER"
  title: string;                        // Título para el Head-Up Display (HUD) del astronauta
  immediateActionRequired: string;      // Acción en lenguaje directo para el tripulante
  automatedSystemAction: string;        // Acción ejecutada por los actuadores del traje/nave
  recommendedMedication?: string;       // Fármaco autónomo si aplica (ej: Atropina, Dexametasona)
  timeToCriticalitySeconds: number;     // Tiempo antes de daño fisiológico irreversible
}

/**
 * Registro de una anomalía específica identificada por el motor de inferencia biomédica.
 */
export interface ClinicalAnomaly {
  code: string;                         // Código estandarizado (ej: "HYPOXIA_CRITICAL", "ACUTE_HEAT_STRESS")
  parameter: string;                    // Parámetro causante (ej: "spo2", "suitPressure", "cabinCo2")
  observedValue: number;
  expectedRange: { min: number; max: number };
  description: string;
}

/**
 * @interface DiagnosticReport
 * @description Informe clínico y operativo devuelto por el servicio `evaluateAstronautHealth`.
 * 
 * @example
 * ```json
 * {
 *   "astronautId": "astro-artemis-001",
 *   "evaluatedAt": "2026-11-10T20:00:01.000Z",
 *   "riskScore": 87,
 *   "status": "EMERGENCY",
 *   "detectedAnomalies": [
 *     {
 *       "code": "SUIT_RAPID_DECOMPRESSION",
 *       "parameter": "suitPressure",
 *       "observedValue": 3.2,
 *       "expectedRange": { "min": 4.1, "max": 4.5 },
 *       "description": "Presión del traje bajo el umbral seguro para EVA. Riesgo inminente de ebullismo e hipoxia."
 *     }
 *   ],
 *   "recommendedProtocol": {
 *     "protocolCode": "EVA-ABORT-04",
 *     "title": "ABANDONO INMEDIATO DE ACTIVIDAD EXTRAVEHICULAR",
 *     "immediateActionRequired": "Regresar de inmediato a la esclusa de descompresión (Airlock).",
 *     "automatedSystemAction": "Inyección de emergencia de O2 al 100% en circuito de traje.",
 *     "timeToCriticalitySeconds": 45
 *   },
 *   "autonomousActionTaken": "Activación de válvula de sobrepresión de respaldo e inyección de O2 puro.",
 *   "earthSyncRecommended": true
 * }
 * ```
 */
export interface DiagnosticReport {
  astronautId: string;
  evaluatedAt: string;
  riskScore: number; // Puntuación calculada de riesgo de 0 (Completamente Seguro) a 100 (Crítico Mortal)
  status: TriageSeverity;
  detectedAnomalies: ClinicalAnomaly[];
  recommendedProtocol: CountermeasureProtocol;
  autonomousActionTaken: string;
  earthSyncRecommended: boolean;
}

// -----------------------------------------------------------------------------
// 4. ESTRUCTURAS DE VISUALIZACIÓN EN DASHBOARD (API RESPONSE)
// -----------------------------------------------------------------------------

/**
 * Resumen consolidado del estado de un astronauta para el panel de mando.
 */
export interface AstronautMissionStatus {
  astronautId: string;
  name: string;
  missionRole: string;
  currentRiskScore: number;
  status: TriageSeverity;
  latestVitals: BiometricPayload["vitals"];
  latestEnvironment: BiometricPayload["environment"];
  currentActivity: ActivityState;
  activeContingency?: string;
  lastTelemetryTimestamp: string;
}

/**
 * Payload devuelto por la ruta `/dashboard/status` para el HUD y la cabina de mando.
 */
export interface DashboardMissionOverview {
  missionName: string;
  missionTimeElapsed: string;
  overallMissionStatus: TriageSeverity;
  activeCrewCount: number;
  crewStatuses: AstronautMissionStatus[];
  criticalIncidentsLast24h: number;
}
