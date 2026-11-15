/**
 * =============================================================================
 * MINS-HEALTH — MOTOR DE INTERACCIÓN DE PELIGROS HRP (HAZARD INTERACTION ENGINE)
 * by Mins Solutions TI — NASA Space Apps Challenge 2026
 * =============================================================================
 * Modela el grafo causal entre los 5 peligros del vuelo espacial humano (HRP):
 * 1. Radiación espacial
 * 2. Aislamiento y confinamiento
 * 3. Distancia a la Tierra
 * 4. Gravedad alterada (Microgravedad / Gravedad parcial)
 * 5. Entorno cerrado y hostil
 *
 * Cuando 2 o más indicadores se desvían simultáneamente, este motor detecta
 * la interacción sinérgica ("Por qué juntos importan más") y emite UNA sola
 * alerta de patrón sistémico, evitando alarmas aisladas redundantes.
 *
 * NOTA CIENTÍFICA: Relaciones de grafo marcadas como
 * "Propuesta, por verificar contra recursos HRP (NASA/CSA)".
 */

import { IndicatorId } from "../data/indicators";

export type HRPPrimaryHazard =
  | "RADIACION"
  | "AISLAMIENTO"
  | "DISTANCIA"
  | "GRAVEDAD"
  | "ENTORNO_CERRADO";

export interface HazardDefinition {
  id: HRPPrimaryHazard;
  name: string;
  shortName: string;
  description: string;
  nasaHrpRiskFocus: string;
  affectedIndicators: IndicatorId[];
  color: string;
}

export const NASA_HRP_HAZARDS: Record<HRPPrimaryHazard, HazardDefinition> = {
  RADIACION: {
    id: "RADIACION",
    name: "Radiación Espacial (GCR & SPE)",
    shortName: "Radiación",
    description: "Neutrones secundarios, iones pesados y eventos de partículas solares sin magnetosfera protectora.",
    nasaHrpRiskFocus: "Cánceres inducidos, daño vascular agudo, disfunción inmune y fatiga por radiación.",
    affectedIndicators: ["radiation_dose", "sleep_hours", "heart_rate"],
    color: "#EF4444",
  },
  AISLAMIENTO: {
    id: "AISLAMIENTO",
    name: "Aislamiento y Confinamiento",
    shortName: "Aislamiento",
    description: "Vivir en espacios reducidos durante meses o años con el mismo grupo humano sin privacidad.",
    nasaHrpRiskFocus: "Trastornos del estado de ánimo, fatiga circadiana, conflicto interpersonal y apatía.",
    affectedIndicators: ["mood", "sleep_hours"],
    color: "#F59E0B",
  },
  DISTANCIA: {
    id: "DISTANCIA",
    name: "Distancia a la Tierra",
    shortName: "Distancia",
    description: "Hasta 400 millones de km en viaje a Marte; retraso de radio de hasta 24 min por sentido.",
    nasaHrpRiskFocus: "Efecto 'Earth-out-of-view', imposibilidad de evacuación médica y necesidad de autonomía radical.",
    affectedIndicators: ["mood", "sleep_hours"],
    color: "#8B5CF6",
  },
  GRAVEDAD: {
    id: "GRAVEDAD",
    name: "Gravedad Alterada (0g / 1/6g / 3/8g)",
    shortName: "Gravedad",
    description: "Transición de microgravedad a gravedad lunar o marciana sin peso hidrostático continuo.",
    nasaHrpRiskFocus: "Desplazamiento cefálico de fluidos (SANS), atrofia miocárdica e intolerancia ortostática.",
    affectedIndicators: ["blood_pressure", "heart_rate"],
    color: "#00E5FF",
  },
  ENTORNO_CERRADO: {
    id: "ENTORNO_CERRADO",
    name: "Entorno Cerrado y Hostil",
    shortName: "Entorno",
    description: "Atmósfera artificial del ECLSS, falta de convección de aire natural, polvo tóxico y ruido continuo.",
    nasaHrpRiskFocus: "Fiebre espacial ('Space Fever' +1°C), cefalea por acumulación de CO2 y resistencia a la insulina.",
    affectedIndicators: ["core_temp", "glucose"],
    color: "#10B981",
  },
};

export interface HazardCausalEdge {
  fromHazard: HRPPrimaryHazard;
  toIndicator: IndicatorId;
  mechanism: string;
  sourceCitation: string;
}

export const HAZARD_CAUSAL_GRAPH: HazardCausalEdge[] = [
  {
    fromHazard: "RADIACION",
    toIndicator: "radiation_dose",
    mechanism: "Dosis acumulada ionizante directa en dosímetros CANS.",
    sourceCitation: "CSA CANS Instrument / NASA Space Radiation Laboratory",
  },
  {
    fromHazard: "RADIACION",
    toIndicator: "sleep_hours",
    mechanism: "Estrés oxidativo celular y protocolos de refugio que interrumpen el descanso profundo.",
    sourceCitation: "NASA HRP Ongoing Research / Artemis ARCHeR",
  },
  {
    fromHazard: "AISLAMIENTO",
    toIndicator: "mood",
    mechanism: "Monotonía sensorial y privación social prolongada.",
    sourceCitation: "NASA Standard Measures HRP Psychological Battery",
  },
  {
    fromHazard: "AISLAMIENTO",
    toIndicator: "sleep_hours",
    mechanism: "Pérdida de zeitgebers (sincronizadores solares) y desincronización de melatonina.",
    sourceCitation: "Artemis II ARCHeR Actigraphy Protocol",
  },
  {
    fromHazard: "GRAVEDAD",
    toIndicator: "blood_pressure",
    mechanism: "Redistribución masiva de fluidos hacia el polo cefálico aumentando presión intracraneal y riesgo SANS.",
    sourceCitation: "NASA-STD-3001 Vol 1 / HRP Cardio Risk",
  },
  {
    fromHazard: "GRAVEDAD",
    toIndicator: "heart_rate",
    mechanism: "Pérdida de volumen plasmático efectivo (~12%) y taquicardia compensatoria.",
    sourceCitation: "Bio-Monitor CSA / Tempus Pro In-Flight Measures",
  },
  {
    fromHazard: "ENTORNO_CERRADO",
    toIndicator: "core_temp",
    mechanism: "Ausencia de convección natural del aire; retención térmica metabólica ('Space Fever').",
    sourceCitation: "Stahn et al., Scientific Reports (ESA/NASA)",
  },
  {
    fromHazard: "ENTORNO_CERRADO",
    toIndicator: "glucose",
    mechanism: "Dieta hipercalórica preservada de larga duración y resistencia temporal a la insulina.",
    sourceCitation: "NASA Nutritional Biochemistry Laboratory",
  },
];

export interface HazardSynergyPattern {
  id: string;
  title: string;
  involvedHazards: HRPPrimaryHazard[];
  involvedIndicators: IndicatorId[];
  whyTogetherTheyMatterMore: string;
  systemicClinicalAction: string;
  verificationBadge: "Propuesta, por verificar contra recursos HRP";
}

/**
 * Evalúa las desviaciones concurrentes para detectar patrones de sinergia entre peligros
 */
export function evaluateHazardSynergy(
  deviatedIndicators: IndicatorId[]
): HazardSynergyPattern | null {
  if (deviatedIndicators.length < 2) {
    return null;
  }

  const hasRadiation = deviatedIndicators.includes("radiation_dose");
  const hasSleep = deviatedIndicators.includes("sleep_hours");
  const hasMood = deviatedIndicators.includes("mood");
  const hasCardio = deviatedIndicators.includes("heart_rate") || deviatedIndicators.includes("blood_pressure");
  const hasMetabolic = deviatedIndicators.includes("glucose") || deviatedIndicators.includes("core_temp");

  // PATRÓN 1: RADIACIÓN AGUDA + FATIGA SISTÉMICA (SPE)
  if (hasRadiation && (hasSleep || hasCardio)) {
    return {
      id: "SPE_SYSTEMIC_CASCADE",
      title: "Patrón Sinergia: Radiación Espacial Aguda y Respuesta Cardiorrespiratoria",
      involvedHazards: ["RADIACION", "ENTORNO_CERRADO", "GRAVEDAD"],
      involvedIndicators: ["radiation_dose", "sleep_hours", "heart_rate"],
      whyTogetherTheyMatterMore:
        "La radiación ionizante elevada de una tormenta solar (SPE) combinada con el déficit de sueño deteriora la capacidad de reparación del ADN celular y dispara taquicardia refleja por sobrecarga autonómica. El riesgo conjunto es 3 veces mayor que la suma de riesgos individuales.",
      systemicClinicalAction:
        "Alerta de radiación: consulta con el cirujano de vuelo y revisa el protocolo de refugio blindado de la misión. Restringe actividades operacionales exigentes y verifica blindaje de cabina.",
      verificationBadge: "Propuesta, por verificar contra recursos HRP",
    };
  }

  // PATRÓN 2: AISLAMIENTO PROLONGADO & COLAPSO CIRCADIANO
  if (hasSleep && hasMood) {
    return {
      id: "ISOLATION_CIRCADIAN_DECLINE",
      title: "Patrón Sinergia: Desincronización Circadiana y Fatiga por Confinamiento",
      involvedHazards: ["AISLAMIENTO", "DISTANCIA"],
      involvedIndicators: ["mood", "sleep_hours"],
      whyTogetherTheyMatterMore:
        "La caída simultánea del estado anímico y el sueño genera un ciclo de retroalimentación negativa: el déficit de sueño amplifica la irritabilidad y el aislamiento socio-operacional, aumentando la probabilidad de lapsos cognitivos críticos en tareas de atraque o control de soporte vital.",
      systemicClinicalAction:
        "Coordina con la tripulación para redistribuir la carga de tareas técnicas. Implementa el protocolo de espectro lumínico cálido circadiano ARCHeR y programa una sesión de descarga con el oficial médico de a bordo.",
      verificationBadge: "Propuesta, por verificar contra recursos HRP",
    };
  }

  // PATRÓN 3: DESACOPLAMIENTO CARDIOVASCULAR & HIPERTERMIA
  if (hasCardio && hasMetabolic) {
    return {
      id: "CARDIO_METABOLIC_FLUID_SHIFT",
      title: "Patrón Sinergia: Redistribución de Fluidos Cefálica y Carga Térmica",
      involvedHazards: ["GRAVEDAD", "ENTORNO_CERRADO"],
      involvedIndicators: ["blood_pressure", "heart_rate", "core_temp"],
      whyTogetherTheyMatterMore:
        "En microgravedad, la pérdida de convección de aire eleva la temperatura corporal ('Space Fever'), lo que exige mayor vasodilatación periférica en un sistema vascular ya depletado por la redistribución cefálica. Esto incrementa el riesgo de síncope o hipertensión ocular (SANS).",
      systemicClinicalAction:
        "Activa ventilación forzada personal de cabina, aplica manguitos en muslos (Thigh Cuffs) y aumenta la hidratación programada con sales isotónicas.",
      verificationBadge: "Propuesta, por verificar contra recursos HRP",
    };
  }

  // PATRÓN GENÉRICO MULTI-SISTÉMICO
  return {
    id: "MULTISYSTEM_STRESS_PATTERN",
    title: "Patrón Sinergia: Sobrecarga Fisiológica Multi-factorial",
    involvedHazards: ["GRAVEDAD", "ENTORNO_CERRADO", "AISLAMIENTO"],
    involvedIndicators: deviatedIndicators,
    whyTogetherTheyMatterMore:
      "Múltiples subsistemas fisiológicos presentan variaciones simultáneas. En misiones de espacio profundo, las alteraciones metabólicas y hemodinámicas combinadas reducen la resiliencia homeostática general del tripulante.",
    systemicClinicalAction:
      "Pausa programada de tareas operacionales de alta exigencia, evaluación conjunta con la tripulación y consulta planificada con el cirujano de vuelo en tierra.",
    verificationBadge: "Propuesta, por verificar contra recursos HRP",
  };
}
