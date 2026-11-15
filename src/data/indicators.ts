/**
 * =============================================================================
 * NASA SPACE APPS 2026 - BASE DE DATOS DE INDICADORES DE SALUD HRP
 * =============================================================================
 * Challenge: Create Health Monitoring Software for Astronauts on Space Missions
 * 
 * Cumple con los 6 indicadores requeridos del reto oficial + radiación continua:
 * 1. Presión arterial (Sistólica / Diastólica)
 * 2. Frecuencia cardíaca en reposo
 * 3. Glucosa capilar
 * 4. Temperatura corporal central
 * 5. Horas de sueño
 * 6. Estado de ánimo (1 a 5)
 * + Dosis de radiación continua (vs. entorno y límite de carrera)
 *
 * Criterio de rigor científico:
 * - Separación estricta entre desviación estadística (Línea Base) y umbral clínico absoluto.
 * - Lenguaje consultivo y asistencial (sin órdenes operativas imperativas).
 */

export type IndicatorId =
  | "blood_pressure"
  | "heart_rate"
  | "glucose"
  | "core_temp"
  | "sleep_hours"
  | "mood"
  | "radiation_dose";

export interface IndicatorDefinition {
  id: IndicatorId;
  name: string;
  shortName: string;
  unit: string;
  anatomicalZone: "cardiovascular" | "brain" | "metabolism" | "systemic" | "eyes" | "musculoskeletal";
  inputRange: { min: number; max: number }; // Solo para filtrar tipeo físicamente imposible
  
  // Umbrales clínicos absolutos (ÚNICOS que pueden dar "Escalar a Tierra")
  clinicalAbsoluteLimits: {
    criticalHigh?: number;
    criticalLow?: number;
    clinicalSource: string;
  };
  
  hrpRiskCategory: "Fisiología" | "Conducta y Factores Humanos" | "Radiación";
  hrpRiskFamily: string;
  fondoHazard: "Gravedad" | "Aislamiento y Confinamiento" | "Entorno Cerrado/Hostil" | "Radiación" | "Distancia a la Tierra";
  
  // 4 CAMPOS OBLIGATORIOS DEL BRIEF NASA
  como_medir: string;
  por_que_importa: string;
  peligro_asociado: string;
  cuando_escalar: string;
  acciones: string[]; // Consultivas, sin fármacos ni dosis
  
  fuenteReferencia: string;
  isProvisional: boolean;
  statusVerificacion: string;
}

export const HEALTH_INDICATORS: Record<IndicatorId, IndicatorDefinition> = {
  blood_pressure: {
    id: "blood_pressure",
    name: "Presión Arterial (Sistólica)",
    shortName: "Presión Art.",
    unit: "mmHg",
    anatomicalZone: "cardiovascular",
    inputRange: { min: 50, max: 260 },
    clinicalAbsoluteLimits: {
      criticalHigh: 160,
      criticalLow: 85,
      clinicalSource: "NASA-STD-3001 Vol 1 / NASA HRP Cardiovascular Clinical Standards",
    },
    hrpRiskCategory: "Fisiología",
    hrpRiskFamily: "Adaptaciones cardiovasculares y redistribución de fluidos",
    fondoHazard: "Gravedad",
    como_medir:
      "Kit de presión arterial/ECG de la ISS o camiseta Bio-Monitor (CSA) con manguito automático braquial.",
    por_que_importa:
      "En microgravedad la sangre migra hacia el tórax y la cabeza (desplazamiento cefálico), alterando los barorreceptores y la autorregulación cerebral.",
    peligro_asociado:
      "Gravedad alterada. Produce pérdida de tono vascular e hipotensión ortostática al retornar a gravedad parcial (Luna/Marte).",
    cuando_escalar:
      "Avisa a la tripulación si la sistólica cae bajo 85 mmHg con mareos. Consulta al cirujano de vuelo si supera 160 mmHg sostenida o se acompaña de cefalea visual.",
    acciones: [
      "Verifica la colocación de manguitos de redistribución en muslos (Thigh Cuffs).",
      "Monitorea el plan de hidratación con electrolitos.",
      "Evita cambios posturales abruptos durante centrifugación o gravedad parcial.",
      "Anota los síntomas en la bitácora médica autónoma.",
    ],
    fuenteReferencia: "NASA-STD-3001 Vol 1 / Bio-Monitor CSA",
    isProvisional: false,
    statusVerificacion: "Validado con protocolo NASA-STD-3001",
  },

  heart_rate: {
    id: "heart_rate",
    name: "Frecuencia Cardíaca en Reposo",
    shortName: "FC Reposo",
    unit: "BPM",
    anatomicalZone: "cardiovascular",
    inputRange: { min: 30, max: 220 },
    clinicalAbsoluteLimits: {
      criticalHigh: 110,
      criticalLow: 45,
      clinicalSource: "NASA HRP Cardiovascular / Tempus Pro In-Flight Telemedicine",
    },
    hrpRiskCategory: "Fisiología",
    hrpRiskFamily: "Adaptaciones cardiovasculares y arritmias",
    fondoHazard: "Gravedad",
    como_medir:
      "Sensor pectoral continuo Bio-Monitor (CSA) o electrodos del kit Tempus Pro de telemedicina.",
    por_que_importa:
      "Permite vigilar el desacondicionamiento miocárdico, taquicardias compensatorias por hipovolemia y estrés autonómico.",
    peligro_asociado:
      "Microgravedad (remodelado miocárdico) y estrés de confinamiento prolongado.",
    cuando_escalar:
      "Informa a la tripulación si la FC en reposo excede 100 BPM de forma persistente. Consulta a tierra si supera 110 BPM o se perciben palpitaciones irregulares.",
    acciones: [
      "Realiza la sesión prescrita de ejercicio aeróbico en el cicloergómetro o Zero T2.",
      "Revisa la ingesta de líquidos de las últimas 12 horas.",
      "Practica un protocolo de respiración guiada para regular el tono vagal.",
    ],
    fuenteReferencia: "NASA HRP Cardiovascular Adaptation / Tempus Pro",
    isProvisional: false,
    statusVerificacion: "Validado con protocolo NASA/CSA",
  },

  glucose: {
    id: "glucose",
    name: "Glucosa Capilar",
    shortName: "Glucemia",
    unit: "mg/dL",
    anatomicalZone: "metabolism",
    inputRange: { min: 30, max: 400 },
    clinicalAbsoluteLimits: {
      criticalHigh: 180,
      criticalLow: 60,
      clinicalSource: "NASA Nutritional Biochemistry Laboratory Clinical Thresholds",
    },
    hrpRiskCategory: "Fisiología",
    hrpRiskFamily: "Nutrición y metabolismo energético",
    fondoHazard: "Entorno Cerrado/Hostil",
    como_medir:
      "Glucómetro de vuelo espacial adaptado a microgravedad con tiras reactivas y lanceta de contención de fluido.",
    por_que_importa:
      "El estrés por radiación y el confinamiento pueden modular la sensibilidad a la insulina y el rendimiento cognitivo.",
    peligro_asociado:
      "Entorno cerrado y dieta preservada de larga duración (ausencia de alimentos frescos continuos).",
    cuando_escalar:
      "Avisa a la tripulación si la glucosa es inferior a 60 mg/dL para prevenir fatiga o mareos. Consulta a tierra si supera 180 mg/dL en ayunas.",
    acciones: [
      "Consume una ración de carbohidratos complejos si se registra hipoglucemia.",
      "Ajusta el menú de vuelo integrando vegetales frescos del Space Garden si están disponibles.",
      "Verifica el balance hídrico del día.",
    ],
    fuenteReferencia: "NASA Nutritional Biochemistry Lab / HRP Nutrition Risk",
    isProvisional: false,
    statusVerificacion: "Validado con protocolo NASA/CSA",
  },

  core_temp: {
    id: "core_temp",
    name: "Temperatura Corporal Central",
    shortName: "Temp. Central",
    unit: "°C",
    anatomicalZone: "systemic",
    inputRange: { min: 32.0, max: 43.0 },
    clinicalAbsoluteLimits: {
      criticalHigh: 38.5,
      criticalLow: 35.0,
      clinicalSource: "ESA/NASA Space Fever Research (Stahn et al.) / NASA HRP Immune",
    },
    hrpRiskCategory: "Fisiología",
    hrpRiskFamily: "Termorregulación espacial y función inmune",
    fondoHazard: "Entorno Cerrado/Hostil",
    como_medir:
      "Sensor de doble flujo térmico en frente (Thermo-Mini/Bio-Monitor) o cápsula telemétrica ingerible para temperatura profunda.",
    por_que_importa:
      "En microgravedad la ausencia de convección de aire produce 'Space Fever' (elevación basal de ~1°C en reposo respecto a la Tierra).",
    peligro_asociado:
      "Entorno cerrado, microgravedad y reactivación microbiana por estrés inmune.",
    cuando_escalar:
      "Comenta con la tripulación si la temperatura supera 38.0°C. Consulta al cirujano de vuelo si supera 38.5°C o se acompaña de malestar agudo.",
    acciones: [
      "Activa el ventilador personal de cabina para favorecer la convección forzada.",
      "Disminuye las capas térmicas de la vestimenta de trabajo.",
      "Aumenta la hidratación a temperatura ambiente.",
      "Programa un intervalo de descanso en tu cabina privada.",
    ],
    fuenteReferencia: "Stahn et al., Scientific Reports / ESA-NASA HRP",
    isProvisional: false,
    statusVerificacion: "Validado con protocolo ESA-NASA HRP",
  },

  sleep_hours: {
    id: "sleep_hours",
    name: "Horas de Sueño y Eficiencia",
    shortName: "Sueño",
    unit: "horas",
    anatomicalZone: "brain",
    inputRange: { min: 0, max: 16 },
    clinicalAbsoluteLimits: {
      criticalLow: 3.5,
      clinicalSource: "Artemis II ARCHeR Investigation / NASA Behavioral Health & Performance",
    },
    hrpRiskCategory: "Conducta y Factores Humanos",
    hrpRiskFamily: "Sueño insuficiente y ritmos circadianos",
    fondoHazard: "Aislamiento y Confinamiento",
    como_medir:
      "Actígrafo de muñeca continuo (estudio ARCHeR de Artemis II) con registro de aceleración y fotometría circadiana.",
    por_que_importa:
      "La falta de amaneceres y atardeceres naturales altera la secreción de melatonina y degrada la toma de decisiones crítica.",
    peligro_asociado:
      "Aislamiento, confinamiento y ausencia de sincronizadores solares terrestres.",
    cuando_escalar:
      "Notifica al comandante si acumulas menos de 4 horas antes de una actividad extravehicular (EVA) o maniobra robótica. Consulta a tierra ante privación sostenida.",
    acciones: [
      "Regula la iluminación del módulo a tono cálido circadiano (espectro azul atenuado).",
      "Utiliza antifaz y tapones auditivos de protección acústica.",
      "Coordina con la tripulación para redistribuir tareas operacionales de alta exigencia.",
    ],
    fuenteReferencia: "NASA ARCHeR (Artemis II) / HRP Behavioral Health",
    isProvisional: false,
    statusVerificacion: "Validado con protocolo Artemis II ARCHeR",
  },

  mood: {
    id: "mood",
    name: "Estado de Ánimo y Resiliencia",
    shortName: "Ánimo (1-5)",
    unit: "escala (1-5)",
    anatomicalZone: "brain",
    inputRange: { min: 1, max: 5 },
    clinicalAbsoluteLimits: {
      criticalLow: 1,
      clinicalSource: "NASA Standard Measures HRP Psychological Battery",
    },
    hrpRiskCategory: "Conducta y Factores Humanos",
    hrpRiskFamily: "Adaptación psico-conductual y dinámica de grupo",
    fondoHazard: "Distancia a la Tierra",
    como_medir:
      "Cuestionario psicométrico digital validado Standard Measures HRP completado al final de la jornada de vuelo.",
    por_que_importa:
      "El alejamiento visual de la Tierra ('Earth-out-of-view') y el confinamiento generan sobrecarga emocional y fatiga comunicativa.",
    peligro_asociado:
      "Distancia planetaria extrema y aislamiento prolongado.",
    cuando_escalar:
      "Comenta con tu compañero de módulo si registras 2 días en nivel 2. Consulta al equipo de soporte psicológico terrestre si el índice persiste en 1.",
    acciones: [
      "Dedica un bloque de tiempo personal a la recreación o al cultivo del Space Garden.",
      "Programa una conversación de apoyo con el médico de a bordo.",
      "Revisa la biblioteca de mensajes familiares asíncronos.",
    ],
    fuenteReferencia: "NASA Standard Measures / Earth-Out-Of-View Studies",
    isProvisional: false,
    statusVerificacion: "Validado con protocolo Standard Measures",
  },

  radiation_dose: {
    id: "radiation_dose",
    name: "Tasa Diaria de Radiación",
    shortName: "Radiación",
    unit: "µSv/día",
    anatomicalZone: "systemic",
    inputRange: { min: 0, max: 100000 },
    clinicalAbsoluteLimits: {
      criticalHigh: 2000, // Tormenta solar aguda (SPE) >2 mSv/día
      clinicalSource: "CSA CANS / NASA Space Radiation Laboratory Clinical Guidelines",
    },
    hrpRiskCategory: "Radiación",
    hrpRiskFamily: "Efectos tisulares agudos y riesgo de carcinogénesis",
    fondoHazard: "Radiación",
    como_medir:
      "Espectrómetro activo de neutrones CANS (CSA) y dosímetros de silicio integrados en el traje y la cabina.",
    por_que_importa:
      "Los neutrones aportan ~30% de la radiación biológicamente dañina en órbita. Un evento de partículas solares (SPE) puede inducir síndrome agudo por radiación.",
    peligro_asociado:
      "Radiación cósmica galáctica (GCR) y eventos de partículas solares (SPE).",
    cuando_escalar:
      "Informa inmediatamente a la tripulación si la tasa diaria supera los 1500 µSv/día. Consulta al cirujano de vuelo y evalúa el protocolo de refugio.",
    acciones: [
      "Alerta de radiación: consulta con el cirujano de vuelo y revisa el protocolo de refugio de la misión.",
      "Verifica las lecturas secundarias del espectrómetro de neutrones CANS.",
      "Monitorea el blindaje del módulo habitacional contra partículas solares.",
    ],
    fuenteReferencia: "CSA CANS Instrument / NASA Space Radiation Laboratory",
    isProvisional: false,
    statusVerificacion: "Validado con protocolo CSA CANS / SRL",
  },
};
