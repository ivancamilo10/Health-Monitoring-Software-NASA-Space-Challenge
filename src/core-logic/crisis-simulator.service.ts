import {
  BiometricPayload,
  SimulationScenario,
} from "../types/mission-health.types";

/**
 * =============================================================================
 * CORE LOGIC - CRISIS & TELEMETRY SIMULATOR SERVICE
 * =============================================================================
 * @responsible DESARROLLADOR B (Lógica Aeroespacial y Biomédica)
 * @description
 * Generador de telemetría de alta fidelidad para demostración en vivo ante el jurado de la NASA.
 * Permite simular fallas catastróficas del sistema de soporte vital (ECLSS), trajes EVA
 * o fenómenos del clima espacial profundo con datos biofísicamente verosímiles.
 */

/**
 * Genera un payload biomédico y ambiental realista correspondiente al escenario solicitado.
 *
 * @param scenario Tipo de crisis a inyectar ('NOMINAL' | 'SOLAR_FLARE' | 'SUIT_LEAK' | 'CO2_TOXICITY')
 * @param astronautId ID del astronauta objetivo (por defecto "astro-artemis-001")
 * @returns {BiometricPayload} Paquete de telemetría listo para ser procesado por la API o el analizador
 * 
 * @developer DESARROLLADOR B (Lógica Biomédica y Aeroespacial)
 * 
 * @example
 * // Invocación:
 * // generateCrisisPayload("SUIT_LEAK", "astro-artemis-001")
 * 
 * // Salida generada:
 * // {
 * //   "astronautId": "astro-artemis-001",
 * //   "timestamp": "2026-11-10T20:00:00.000Z",
 * //   "vitals": { "heartRate": 162.0, "hrv": 15.0, "spo2": 84.0, "coreTemp": 36.1 },
 * //   "environment": { "suitPressure": 3.1, "cabinCo2": 2.1, "solarRadiationIndex": 18.0 },
 * //   "activityState": "EVA_SPACEWALK"
 * // }
 */
export function generateCrisisPayload(
  scenario: SimulationScenario,
  astronautId: string = "astro-artemis-001"
): BiometricPayload {
  const now = new Date().toISOString();

  // ---------------------------------------------------------------------------
  // TODO [DEV-LOGICA]: DINAMISMO Y FLUCTUACIONES EN LA SIMULACIÓN
  // 1. Agregar ruido estocástico o gaussiano a las lecturas para simular sensores reales:
  //    ej: heartRate = base + (Math.random() * 4 - 2)
  // 2. Permitir curvas de degradación progresiva (ej: caída gradual de presión de 4.3 -> 3.2 -> 2.5 psi).
  // 3. Simular efectos cruzados: Si cae SpO2, taquicardia compensatoria refleja (HR sube a 150+).
  // ---------------------------------------------------------------------------

  switch (scenario) {
    case "SUIT_LEAK":
      // Escenario: Micrometeoroide o falla de sello en el guante durante EVA
      return {
        astronautId,
        timestamp: now,
        vitals: {
          heartRate: 154.0, // Taquicardia severa por pánico e hipoxia incipiente
          hrv: 14.2,        // Estrés simpático máximo
          spo2: 86.0,       // Caída rápida de saturación
          coreTemp: 35.8,   // Ligera hipotermia por fuga de gas
        },
        environment: {
          suitPressure: 3.2, // Caída por debajo del límite seguro (4.1 psi)
          cabinCo2: 1.8,
          solarRadiationIndex: 22.0,
        },
        activityState: "EVA_SPACEWALK",
      };

    case "CO2_TOXICITY":
      // Escenario: Saturación o falla mecánica del absorbedor de dióxido de carbono
      return {
        astronautId,
        timestamp: now,
        vitals: {
          heartRate: 118.0, // Pulso acelerado, disnea
          hrv: 24.0,
          spo2: 91.0,
          coreTemp: 37.4,
        },
        environment: {
          suitPressure: 14.6, // Presión de cabina estándar
          cabinCo2: 7.8,      // Nivel letal de hipercapnia (> 7 mmHg)
          solarRadiationIndex: 15.0,
        },
        activityState: "REST",
      };

    case "SOLAR_FLARE":
      // Escenario: Evento de Partículas Solares de clase X detectado fuera del cinturón de Van Allen
      return {
        astronautId,
        timestamp: now,
        vitals: {
          heartRate: 98.0,
          hrv: 38.0,
          spo2: 98.0,
          coreTemp: 37.1,
        },
        environment: {
          suitPressure: 14.7,
          cabinCo2: 2.2,
          solarRadiationIndex: 145.0, // Radiación gamma/protónica en niveles peligrosos (>100 µSv/h)
        },
        activityState: "REST",
      };

    case "NOMINAL":
    default:
      // Escenario: Todos los sistemas y signos vitales en rango óptimo
      return {
        astronautId,
        timestamp: now,
        vitals: {
          heartRate: 68.0,
          hrv: 62.0,
          spo2: 98.5,
          coreTemp: 36.8,
        },
        environment: {
          suitPressure: 14.7,
          cabinCo2: 1.9,
          solarRadiationIndex: 14.0,
        },
        activityState: "REST",
      };
  }
}
