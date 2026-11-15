/**
 * =============================================================================
 * NASA SPACE APPS 2026 - LÍNEA BASE PERSONAL (PERSONAL BASELINE ENGINE)
 * =============================================================================
 * PRINCIPIO CIENTÍFICO OBLIGATORIO:
 * "No inventes umbrales clínicos terrestres fijos. La referencia primordial es
 * la propia variabilidad fisiológica del astronauta (línea base individualizada)."
 * 
 * REGLA DE INTEGRIDAD:
 * Un dato faltante NUNCA se muestra como 'bien' o 'nominal'.
 * Se cataloga como estado 'SIN_DATOS', se visualiza en gris y se cuantifica aparte.
 */

import { IndicatorId } from "../data/indicators";

export interface BaselineStats {
  indicatorId: IndicatorId;
  count: number;
  mean: number;
  standardDeviation: number;
  min: number;
  max: number;
  isCalibrated: boolean; // Requiere mínimo 3 lecturas para considerarse línea base confiable
}

export interface ReadingHistoryItem {
  timestamp: string;
  value: number | null; // null si no se midió
}

/**
 * Calcula las estadísticas de la línea base personal para un indicador
 */
export function calculatePersonalBaseline(
  indicatorId: IndicatorId,
  readings: (number | null | undefined)[]
): BaselineStats {
  const validValues = readings.filter(
    (v): v is number => typeof v === "number" && !isNaN(v)
  );

  if (validValues.length === 0) {
    return {
      indicatorId,
      count: 0,
      mean: 0,
      standardDeviation: 0,
      min: 0,
      max: 0,
      isCalibrated: false,
    };
  }

  const count = validValues.length;
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;

  // Varianza y Desviación estándar
  const variance =
    count > 1
      ? validValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
        (count - 1)
      : 0;
  const standardDeviation = Math.sqrt(variance);

  return {
    indicatorId,
    count,
    mean: Number(mean.toFixed(2)),
    standardDeviation: Number(standardDeviation.toFixed(2)),
    min: Math.min(...validValues),
    max: Math.max(...validValues),
    isCalibrated: count >= 3,
  };
}

/**
 * Líneas base iniciales pre-vuelo por defecto para la tripulación (simuladas de entrenamiento en Tierra/L-30)
 */
export const DEFAULT_ASTRONAUT_BASELINES: Record<IndicatorId, BaselineStats> = {
  blood_pressure: {
    indicatorId: "blood_pressure",
    count: 14,
    mean: 116.0,
    standardDeviation: 6.2,
    min: 108,
    max: 126,
    isCalibrated: true,
  },
  heart_rate: {
    indicatorId: "heart_rate",
    count: 14,
    mean: 64.0,
    standardDeviation: 4.5,
    min: 58,
    max: 72,
    isCalibrated: true,
  },
  glucose: {
    indicatorId: "glucose",
    count: 14,
    mean: 88.0,
    standardDeviation: 7.0,
    min: 78,
    max: 98,
    isCalibrated: true,
  },
  core_temp: {
    indicatorId: "core_temp",
    count: 14,
    mean: 36.7,
    standardDeviation: 0.25,
    min: 36.4,
    max: 37.1,
    isCalibrated: true,
  },
  sleep_hours: {
    indicatorId: "sleep_hours",
    count: 14,
    mean: 7.6,
    standardDeviation: 0.7,
    min: 6.5,
    max: 8.5,
    isCalibrated: true,
  },
  mood: {
    indicatorId: "mood",
    count: 14,
    mean: 4.4,
    standardDeviation: 0.5,
    min: 3,
    max: 5,
    isCalibrated: true,
  },
  radiation_dose: {
    indicatorId: "radiation_dose",
    count: 14,
    mean: 12.0, // Nivel terrestre de fondo
    standardDeviation: 2.0,
    min: 8,
    max: 16,
    isCalibrated: true,
  },
};
