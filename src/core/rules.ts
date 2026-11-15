/**
 * =============================================================================
 * NASA SPACE APPS 2026 - MOTOR DE REGLAS EXPLICABLES DE SALUD ESPACIAL
 * =============================================================================
 * REGLAS CIENTÍFICAS OBLIGATORIAS:
 * 1. Desviación estadística respecto a la línea base personal (|Z-score|) produce
 *    como MÁXIMO el estado "Vigilar" o "Atención".
 * 2. El umbral clínico absoluto con fuente citada es el ÚNICO que puede emitir
 *    el estado "Escalar a Tierra".
 * 3. Consistencia total: Nunca mostrar "Escalar" si no se ha superado el umbral clínico.
 * 4. Agrupación de alertas: Si 3 o más indicadores se desvían a la vez, se emite
 *    UNA alerta de patrón sistémico con una única acción consultiva.
 * 5. Tono consultivo y no imperativo (apoyo a la decisión médica de a bordo).
 */

import { HEALTH_INDICATORS, IndicatorId } from "../data/indicators";
import { BaselineStats } from "./baseline";
import { MissionDestination } from "./missions";

export type EvaluationState =
  | "HABITUAL"
  | "VIGILAR"
  | "ATENCION"
  | "ESCALAR_TIERRA"
  | "SIN_DATOS";

export type EscalationLevel =
  | "AUTOGESTION"
  | "AVISAR_TRIPULACION"
  | "AVISAR_TIERRA";

export interface IndicatorEvaluation {
  indicatorId: IndicatorId;
  name: string;
  state: EvaluationState;
  stateLabel: string;
  badgeColor: string;
  currentValue: number | null;
  unit: string;
  baselineMean: number;
  deltaFromBaseline: number | null;
  zScore: number | null;
  evaluationType: "LINEA_BASE_ESTADISTICA" | "UMBRAL_CLINICO_ABSOLUTO" | "SIN_DATOS";
  explanation: {
    queMidiendo: string;
    contraQueComparo: string;
    porQueImporta: string;
    fuenteCientifica: string;
  };
  escalation: {
    level: EscalationLevel;
    levelLabel: string;
    actionRequired: string;
  };
  recommendedActions: string[];
}

export interface MissionDecisionReport {
  overallState: EvaluationState;
  overallStateLabel: string;
  isSystemicPattern: boolean;
  patternTitle?: string;
  primaryAction: string;
  urgencyLevel: EscalationLevel;
  indicatorsEvaluated: number;
  missingIndicatorsCount: number;
  deviatedIndicatorsCount: number;
  evaluations: Record<IndicatorId, IndicatorEvaluation>;
  specialSpaceRulesApplied: string[];
  evaluatedAt: string;
}

/**
 * Tasas típicas de radiación esperada por entorno de misión (NASA HRP / CSA)
 */
export const TYPICAL_ENVIRONMENT_RADIATION: Record<MissionDestination, { typicalDailyMicroSv: number; desc: string }> = {
  ISS: {
    typicalDailyMicroSv: 730, // ~0.73 mSv/día (500 - 730 µSv/día es nominal en LEO)
    desc: "Típico en ISS (LEO): 500 - 730 µSv/día (protegido por magnetosfera terrestre)",
  },
  LUNA: {
    typicalDailyMicroSv: 1200, // ~1.2 mSv/día
    desc: "Típico en superficie lunar: 1000 - 1400 µSv/día",
  },
  MARTE: {
    typicalDailyMicroSv: 1800, // ~1.8 mSv/día
    desc: "Típico en espacio profundo / Marte: 1500 - 2000 µSv/día",
  },
};

/**
 * Evalúa un único indicador separando estrictamente línea base estadística de umbral clínico absoluto.
 */
export function evaluateSingleIndicator(
  indicatorId: IndicatorId,
  currentValue: number | null | undefined,
  baseline: BaselineStats,
  mission: MissionDestination = "ISS"
): IndicatorEvaluation {
  const def = HEALTH_INDICATORS[indicatorId];

  // 1. MANEJO ESTRICTO DE DATO FALTANTE (Gris, nunca "bien")
  if (currentValue === null || currentValue === undefined || isNaN(currentValue)) {
    return {
      indicatorId,
      name: def.name,
      state: "SIN_DATOS",
      stateLabel: "Sin Datos",
      badgeColor: "#64748B",
      currentValue: null,
      unit: def.unit,
      baselineMean: baseline.mean,
      deltaFromBaseline: null,
      zScore: null,
      evaluationType: "SIN_DATOS",
      explanation: {
        queMidiendo: `No se registra telemetría actual de ${def.name}.`,
        contraQueComparo: `Línea base previa del astronauta: ${baseline.mean} ${def.unit}.`,
        porQueImporta: def.por_que_importa,
        fuenteCientifica: "NASA HRP Standard Measures (Integridad de Datos)",
      },
      escalation: {
        level: "AUTOGESTION",
        levelLabel: "Auto-chequeo pendiente",
        actionRequired: `Realizar medición de ${def.shortName} cuando las operaciones lo permitan.`,
      },
      recommendedActions: [
        `Efectuar lectura con: ${def.como_medir}`,
        "Completar la entrada en el asistente de chequeo diario.",
      ],
    };
  }

  const delta = Number((currentValue - baseline.mean).toFixed(2));
  const sd = baseline.standardDeviation > 0 ? baseline.standardDeviation : 1.0;
  const zScore = Number(((currentValue - baseline.mean) / sd).toFixed(2));
  const absZ = Math.abs(zScore);

  let state: EvaluationState = "HABITUAL";
  let stateLabel = "Habitual";
  let badgeColor = "#10B981";
  let level: EscalationLevel = "AUTOGESTION";
  let levelLabel = "Autogestión por el astronauta";
  let actionRequired = "Mantener el régimen regular de actividades y bitácora.";
  let evaluationType: IndicatorEvaluation["evaluationType"] = "LINEA_BASE_ESTADISTICA";

  // ---------------------------------------------------------------------------
  // A) EVALUACIÓN DE DESVIACIÓN ESTADÍSTICA (LÍNEA BASE PERSONAL L-30)
  // REGLA: Máximo estado posible = "Vigilar" o "Atención". NUNCA "Escalar a Tierra".
  // ---------------------------------------------------------------------------
  if (absZ >= 2.5) {
    state = "ATENCION";
    stateLabel = "Atención Requerida";
    badgeColor = "#F97316";
    level = "AVISAR_TRIPULACION";
    levelLabel = "Notificar a la tripulación";
    actionRequired = `Variación significativa respecto a tu línea base (+${absZ} DE). Revalúa en la siguiente ventana de descanso.`;
  } else if (absZ >= 1.4) {
    state = "VIGILAR";
    stateLabel = "Vigilar Tendencia";
    badgeColor = "#F59E0B";
    level = "AUTOGESTION";
    levelLabel = "Autogestión preventiva";
    actionRequired = `Fluctuación leve en ${def.shortName}. Mantener hidratación y seguimiento.`;
  }

  // ---------------------------------------------------------------------------
  // B) EVALUACIÓN DE UMBRAL CLÍNICO ABSOLUTO (CON FUENTE CITADA)
  // REGLA: Es el ÚNICO mecanismo que puede emitir "Escalar a Tierra".
  // ---------------------------------------------------------------------------
  const limits = def.clinicalAbsoluteLimits;

  if (indicatorId === "radiation_dose") {
    // REGLA ESPECÍFICA DE RADIACIÓN:
    // La tasa de la ISS (~730 µSv/día) NO debe marcarse como emergencia.
    // Solo una tormenta solar aguda (SPE) con tasa >2000 µSv/día es crítica.
    const envTypical = TYPICAL_ENVIRONMENT_RADIATION[mission].typicalDailyMicroSv;

    if (currentValue >= (limits.criticalHigh ?? 2000)) {
      state = "ESCALAR_TIERRA";
      stateLabel = "Escalar a Tierra";
      badgeColor = "#EF4444";
      level = "AVISAR_TIERRA";
      levelLabel = "Alerta de radiación con soporte terrestre";
      actionRequired = "Alerta de radiación: consulta con el cirujano de vuelo y revisa el protocolo de refugio de la misión.";
      evaluationType = "UMBRAL_CLINICO_ABSOLUTO";
    } else if (currentValue > envTypical * 1.5) {
      state = "ATENCION";
      stateLabel = "Atención Requerida";
      badgeColor = "#F97316";
      level = "AVISAR_TRIPULACION";
      levelLabel = "Notificar a la tripulación";
      actionRequired = "Tasa de radiación sobre el promedio del entorno. Monitorear dosimetría CANS.";
      evaluationType = "UMBRAL_CLINICO_ABSOLUTO";
    } else if (currentValue > envTypical) {
      state = "VIGILAR";
      stateLabel = "Vigilar Tendencia";
      badgeColor = "#F59E0B";
      level = "AUTOGESTION";
      levelLabel = "Autogestión preventiva";
      actionRequired = "Tasa ligeramente por encima de la media de misión. Seguimiento pasivo.";
      evaluationType = "UMBRAL_CLINICO_ABSOLUTO";
    } else {
      state = "HABITUAL";
      stateLabel = "Habitual";
      badgeColor = "#10B981";
      level = "AUTOGESTION";
      actionRequired = "Tasa de radiación dentro de lo típico para el entorno de misión actual.";
    }
  } else {
    // Comprobación de límites clínicos absolutos para los demás indicadores
    const isHighBreached = limits.criticalHigh !== undefined && currentValue >= limits.criticalHigh;
    const isLowBreached = limits.criticalLow !== undefined && currentValue <= limits.criticalLow;

    if (isHighBreached || isLowBreached) {
      state = "ESCALAR_TIERRA";
      stateLabel = "Escalar a Tierra";
      badgeColor = "#EF4444";
      level = "AVISAR_TIERRA";
      levelLabel = "Consulta prioritaria con Cirujano de Vuelo";
      actionRequired = `Lectura clínica fuera de rango seguro (${currentValue} ${def.unit}). Consulta con el cirujano de vuelo.`;
      evaluationType = "UMBRAL_CLINICO_ABSOLUTO";
    }
  }

  return {
    indicatorId,
    name: def.name,
    state,
    stateLabel,
    badgeColor,
    currentValue,
    unit: def.unit,
    baselineMean: baseline.mean,
    deltaFromBaseline: delta,
    zScore,
    evaluationType,
    explanation: {
      queMidiendo: `Lectura actual de ${currentValue} ${def.unit}.`,
      contraQueComparo:
        evaluationType === "UMBRAL_CLINICO_ABSOLUTO"
          ? `Límite clínico de vuelo: ${limits.clinicalSource}`
          : `Línea base personal: ${baseline.mean} ± ${baseline.standardDeviation} ${def.unit}.`,
      porQueImporta: def.por_que_importa,
      fuenteCientifica: def.fuenteReferencia,
    },
    escalation: {
      level,
      levelLabel,
      actionRequired,
    },
    recommendedActions: def.acciones,
  };
}

/**
 * Genera el informe global integrando la Detección de Patrones Sistémicos
 */
export function generateMissionDecisionReport(
  values: Partial<Record<IndicatorId, number | null>>,
  baselines: Record<IndicatorId, BaselineStats>,
  mission: MissionDestination = "ISS"
): MissionDecisionReport {
  const evaluations = {} as Record<IndicatorId, IndicatorEvaluation>;
  let worstState: EvaluationState = "HABITUAL";
  let maxEscalation: EscalationLevel = "AUTOGESTION";
  let primaryAction = "Todos los indicadores fisiológicos en equilibrio nominal. Continuar cronograma de vuelo.";
  let missingCount = 0;
  let evaluatedCount = 0;
  let deviatedCount = 0;

  const indicatorKeys = Object.keys(HEALTH_INDICATORS) as IndicatorId[];

  for (const key of indicatorKeys) {
    const val = values[key];
    const baseline = baselines[key];
    const evaluation = evaluateSingleIndicator(key, val, baseline, mission);
    evaluations[key] = evaluation;

    if (evaluation.state === "SIN_DATOS") {
      missingCount++;
    } else {
      evaluatedCount++;
      if (evaluation.state !== "HABITUAL") {
        deviatedCount++;
      }
    }

    // Identificar peor estado individual
    if (evaluation.state === "ESCALAR_TIERRA") {
      worstState = "ESCALAR_TIERRA";
      maxEscalation = "AVISAR_TIERRA";
    } else if (evaluation.state === "ATENCION" && worstState !== "ESCALAR_TIERRA") {
      worstState = "ATENCION";
      if (maxEscalation !== "AVISAR_TIERRA") maxEscalation = "AVISAR_TRIPULACION";
    } else if (evaluation.state === "VIGILAR" && worstState === "HABITUAL") {
      worstState = "VIGILAR";
    }
  }

  // ---------------------------------------------------------------------------
  // 4. AGRUPACIÓN DE ALERTAS SIMULTÁNEAS (PATRÓN SISTÉMICO)
  // Si 3 o más indicadores se desvían a la vez, se muestra UNA sola alerta unificada
  // ---------------------------------------------------------------------------
  let isSystemicPattern = false;
  let patternTitle: string | undefined = undefined;

  const radVal = values.radiation_dose ?? 0;
  const sleepVal = values.sleep_hours ?? 8;
  const moodVal = values.mood ?? 4;
  const hrVal = values.heart_rate ?? 65;

  if (deviatedCount >= 3) {
    isSystemicPattern = true;

    if (radVal >= 1500) {
      patternTitle = "Patrón compatible con evento agudo de radiación solar (SPE) y respuesta sistémica";
      primaryAction = "Alerta de radiación: consulta con el cirujano de vuelo y revisa el protocolo de refugio de la misión.";
      worstState = "ESCALAR_TIERRA";
      maxEscalation = "AVISAR_TIERRA";
    } else if (sleepVal <= 4.5 && moodVal <= 2) {
      patternTitle = "Patrón de fatiga operacional y estrés de confinamiento prolongado";
      primaryAction = "Ajusta la carga de trabajo en coordinación con la tripulación e implementa el protocolo de descanso circadiano.";
      worstState = "ATENCION";
      maxEscalation = "AVISAR_TRIPULACION";
    } else {
      patternTitle = "Patrón de sobrecarga fisiológica multifactorial";
      primaryAction = "Pausa temporal de actividades de alta demanda, hidratación guiada y revisión conjunta con el oficial médico de a bordo.";
      if (worstState === "HABITUAL") worstState = "ATENCION";
    }
  } else if (worstState === "ESCALAR_TIERRA") {
    // Una sola alerta clínica crítica
    const criticalEval = Object.values(evaluations).find((e) => e.state === "ESCALAR_TIERRA");
    primaryAction = criticalEval?.escalation.actionRequired ?? "Revisión clínica prioritaria con cirujano de vuelo.";
  } else if (worstState === "ATENCION") {
    const attentionEval = Object.values(evaluations).find((e) => e.state === "ATENCION");
    primaryAction = attentionEval?.escalation.actionRequired ?? "Notificar a la tripulación para seguimiento.";
  } else if (worstState === "VIGILAR") {
    const vigilarEval = Object.values(evaluations).find((e) => e.state === "VIGILAR");
    primaryAction = `Vigilancia preventiva: variación leve en ${vigilarEval?.name}. Mantener hidratación y registro regular.`;
  }

  const stateLabels: Record<EvaluationState, string> = {
    HABITUAL: "Habitual (Óptimo de Vuelo)",
    VIGILAR: "Vigilar (Desviación Leve)",
    ATENCION: "Atención (Intervención de Tripulación)",
    ESCALAR_TIERRA: "Escalar a Tierra (Consulta Terrestre)",
    SIN_DATOS: "Sin Datos Completos",
  };

  return {
    overallState: worstState,
    overallStateLabel: stateLabels[worstState],
    isSystemicPattern,
    patternTitle,
    primaryAction,
    urgencyLevel: maxEscalation,
    indicatorsEvaluated: evaluatedCount,
    missingIndicatorsCount: missingCount,
    deviatedIndicatorsCount: deviatedCount,
    evaluations,
    specialSpaceRulesApplied: [
      "Separación estricta: Desviación estadística (máx. Vigilar/Atención) vs. Umbral clínico (Escalar a Tierra).",
      "Agrupación de alertas sistémicas ante desvíos múltiples simultáneos.",
      "Tasa de radiación normalizada según el entorno de misión.",
    ],
    evaluatedAt: new Date().toISOString(),
  };
}
