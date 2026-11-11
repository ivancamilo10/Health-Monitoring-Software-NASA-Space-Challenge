import {
  BiometricPayload,
  DiagnosticReport,
  ClinicalAnomaly,
  TriageSeverity,
} from "../types/mission-health.types";
import { determineAutonomousResponse } from "./autonomous-triage.service";

/**
 * =============================================================================
 * CORE LOGIC - BIOMETRIC & ENVIRONMENTAL ANALYZER SERVICE
 * =============================================================================
 * @responsible DESARROLLADOR B (Lógica Aeroespacial y Biomédica)
 * @description
 * Motor de análisis fisiológico espacial. Evalúa simultáneamente signos vitales
 * relativizados según el estado de actividad (ej. 160 BPM es normal en ejercicio extremo,
 * pero es taquicardia severa durmiendo) y condiciones ambientales críticas de cabina/traje.
 */

/**
 * Evalúa el estado de salud integral del astronauta y genera el diagnóstico en tiempo real.
 *
 * @param payload Objeto completo con signos vitales, parámetros del entorno y actividad física
 * @returns {DiagnosticReport} Informe clínico con puntaje de riesgo (0-100), anomalías y contramedida
 * 
 * @developer DESARROLLADOR B (Lógica Biomédica y Aeroespacial)
 * 
 * @example
 * // Payload de Entrada:
 * // {
 * //   "astronautId": "astro-artemis-001",
 * //   "timestamp": "2026-11-10T20:00:00.000Z",
 * //   "vitals": { "heartRate": 158.0, "hrv": 18.5, "spo2": 88.0, "coreTemp": 38.6 },
 * //   "environment": { "suitPressure": 3.2, "cabinCo2": 4.5, "solarRadiationIndex": 125.0 },
 * //   "activityState": "EVA_SPACEWALK"
 * // }
 * 
 * // Reporte de Salida:
 * // {
 * //   "astronautId": "astro-artemis-001",
 * //   "evaluatedAt": "2026-11-10T20:00:00.100Z",
 * //   "riskScore": 87,
 * //   "status": "EMERGENCY",
 * //   "detectedAnomalies": [...],
 * //   "recommendedProtocol": { ... },
 * //   "autonomousActionTaken": "Presurización auxiliar activada a 4.2 psi.",
 * //   "earthSyncRecommended": true
 * // }
 */
export function evaluateAstronautHealth(data: BiometricPayload): DiagnosticReport {
  // ---------------------------------------------------------------------------
  // TODO [DEV-LOGICA]: IMPLEMENTAR MATRIZ DE RIESGO BIOMÉDICO Y AMBIENTAL
  //
  // Paso 1: Normalización de Frecuencia Cardíaca según ActivityState:
  //   - SLEEP: Umbral seguro 40 - 75 BPM. (>90 = Taquicardia nocturna sospechosa).
  //   - REST: Umbral seguro 55 - 95 BPM.
  //   - EXERCISE: Umbral seguro 100 - 175 BPM.
  //   - EVA_SPACEWALK: Umbral seguro 65 - 130 BPM (estrés metabólico continuo).
  //
  // Paso 2: Evaluación de HRV (Variabilidad Cardíaca - SDNN):
  //   - HRV < 20 ms con HR alta indica fatiga simpática severa o agotamiento físico inminente.
  //
  // Paso 3: Saturación de Oxígeno (SpO2):
  //   - > 95%: Normal.
  //   - 90% - 94%: Hipoxia leve / moderada (+15 puntos de riesgo).
  //   - < 90%: Hipoxia severa / cianosis (+40 puntos de riesgo, estatus EMERGENCY inmediato).
  //
  // Paso 4: Variables Ambientales y de Soporte Vital (ECLSS):
  //   - Traje EVA (suitPressure):
  //       * Nominal: ~ 4.3 psi (0.29 atm) con 100% O2.
  //       * < 3.8 psi: Despresurización peligrosa (Riesgo inminente de ebullismo).
  //   - Dióxido de Carbono (cabinCo2):
  //       * Nominal: < 3.0 mmHg.
  //       * 3.0 - 5.0 mmHg: Cefalea por hipercapnia (CAUTION).
  //       * > 7.0 mmHg: Narcosis por CO2 / fallo respiratorio (EMERGENCY).
  //   - Radiación Solar Cósmica (solarRadiationIndex):
  //       * Nominal: < 20 µSv/h.
  //       * > 100 µSv/h: Alerta de llamarada solar (Solar Particle Event).
  //
  // Paso 5: Cálculo del riskScore global (0 a 100):
  //   - riskScore = clamp(0, 100, sumaPonderada(vitalsRisk * 0.45 + envRisk * 0.55))
  //   - Mapear status:
  //       * 0 - 25: "NOMINAL"
  //       * 26 - 55: "CAUTION"
  //       * 56 - 79: "WARNING"
  //       * 80 - 100: "EMERGENCY"
  // ---------------------------------------------------------------------------

  const detectedAnomalies: ClinicalAnomaly[] = [];
  let simulatedRiskScore = 0;

  // Lógica de detección simulada base para permitir integración con Developer A
  if (data.environment.suitPressure < 3.8 && data.activityState === "EVA_SPACEWALK") {
    detectedAnomalies.push({
      code: "SUIT_RAPID_DECOMPRESSION",
      parameter: "suitPressure",
      observedValue: data.environment.suitPressure,
      expectedRange: { min: 4.1, max: 4.5 },
      description: "Presión del traje EVA bajo el límite de seguridad crítico de ebullismo.",
    });
    simulatedRiskScore += 50;
  }

  if (data.vitals.spo2 < 90) {
    detectedAnomalies.push({
      code: "HYPOXIA_CRITICAL",
      parameter: "spo2",
      observedValue: data.vitals.spo2,
      expectedRange: { min: 95, max: 100 },
      description: "Saturación periférica de oxígeno en niveles clínicamente críticos.",
    });
    simulatedRiskScore += 40;
  }

  if (data.environment.cabinCo2 > 6.0) {
    detectedAnomalies.push({
      code: "CO2_TOXICITY",
      parameter: "cabinCo2",
      observedValue: data.environment.cabinCo2,
      expectedRange: { min: 0.5, max: 3.0 },
      description: "Acumulación tóxica de dióxido de carbono por falla de absorbedor ECLSS.",
    });
    simulatedRiskScore += 35;
  }

  if (data.environment.solarRadiationIndex > 100) {
    detectedAnomalies.push({
      code: "ACUTE_RADIATION_EVENT",
      parameter: "solarRadiationIndex",
      observedValue: data.environment.solarRadiationIndex,
      expectedRange: { min: 5, max: 25 },
      description: "Pico de radiación cósmica por tormenta solar (SPE).",
    });
    simulatedRiskScore += 35;
  }

  // Normalización del puntaje de riesgo
  const finalRiskScore = Math.min(100, Math.max(0, simulatedRiskScore));

  // Asignación de nivel de severidad según el score
  let status: TriageSeverity = "NOMINAL";
  if (finalRiskScore >= 80) status = "EMERGENCY";
  else if (finalRiskScore >= 55) status = "WARNING";
  else if (finalRiskScore >= 25) status = "CAUTION";

  // Delegar la resolución de contramedidas al servicio de triage autónomo
  const triageResponse = determineAutonomousResponse(status, detectedAnomalies);

  return {
    astronautId: data.astronautId,
    evaluatedAt: new Date().toISOString(),
    riskScore: finalRiskScore,
    status,
    detectedAnomalies,
    recommendedProtocol: triageResponse.protocol,
    autonomousActionTaken: triageResponse.autonomousActionTaken,
    earthSyncRecommended: status === "WARNING" || status === "EMERGENCY",
  };
}
