import {
  TriageSeverity,
  ClinicalAnomaly,
  CountermeasureProtocol,
} from "../types/mission-health.types";

/**
 * =============================================================================
 * CORE LOGIC - AUTONOMOUS MEDICAL TRIAGE SERVICE
 * =============================================================================
 * @responsible DESARROLLADOR B (Lógica Aeroespacial y Biomédica)
 * @description
 * En misiones interplanetarias hacia la Luna (Artemis) o Marte (latencia de 4 a 24 min
 * en cada sentido de la señal de radio), el sistema debe actuar como el "Médico
 * de Vuelo de Emergencia A Bordo" sin depender de Houston.
 * 
 * Este módulo determina la severidad de la alerta y emite el protocolo de contramedida
 * instantánea ejecutado por actuadores del traje o la cabina.
 */

/**
 * Determina el protocolo de intervención y la acción automática a tomar.
 *
 * @param severity Nivel de severidad clínica calculado ("NOMINAL", "CAUTION", "WARNING", "EMERGENCY")
 * @param anomalies Lista de anomalías detectadas en signos vitales o ambiente
 * @returns {CountermeasureProtocol} Protocolo con orden de ejecución para el astronauta y actuadores
 * 
 * @developer DESARROLLADOR B (Lógica Biomédica y Aeroespacial)
 * 
 * @example
 * // Entrada:
 * // severity: "EMERGENCY"
 * // anomalies: [{ code: "SUIT_RAPID_DECOMPRESSION", parameter: "suitPressure", observedValue: 3.2, expectedRange: { min: 4.1, max: 4.5 }, description: "Caída de presión" }]
 * 
 * // Salida esperada:
 * // {
 * //   protocolCode: "EVA-ABORT-04",
 * //   title: "ABORTAR ACTIVIDAD EXTRAVEHICULAR INMEDIATAMENTE",
 * //   immediateActionRequired: "Retornar a la esclusa en menos de 45 segundos.",
 * //   automatedSystemAction: "Presurización auxiliar de emergencia con tanque secundario.",
 * //   timeToCriticalitySeconds: 45
 * // }
 */
export function determineAutonomousResponse(
  severity: TriageSeverity,
  anomalies: ClinicalAnomaly[]
): {
  protocol: CountermeasureProtocol;
  autonomousActionTaken: string;
} {
  // ---------------------------------------------------------------------------
  // TODO [DEV-LOGICA]: IMPLEMENTAR REGLAS DE TRIAGE AEROESPACIAL:
  // 1. Evaluar si existe una anomalía de traje crítico ('SUIT_RAPID_DECOMPRESSION' o 'HYPOXIA_CRITICAL').
  //    -> Si es así, priorizar sobre cualquier otra condición (Tiempo crítico < 60s).
  // 2. Evaluar hipercapnia ('CO2_TOXICITY'):
  //    -> Si cabinCo2 > 7 mmHg: Ordenar purga forzada de scrubbers LiOH y mascarilla de O2.
  // 3. Evaluar radiación aguda ('ACUTE_RADIATION_EVENT'):
  //    -> Si solarRadiationIndex > 100 µSv/h: Ordenar refugio inmediato en el compartimento blindado (Storm Shelter).
  // 4. Mapear 'CAUTION' a contramedidas operativas leves (ej: hidratación forzada, reducción de ritmo de trabajo).
  // 5. Retornar el protocolo más severo y la cadena descriptiva de la acción tomada en el traje/nave.
  // ---------------------------------------------------------------------------

  // --- MOCK TEMPORAL VÁLIDO PARA PERMITIR PRUEBAS DEL DESARROLLADOR A ---
  if (severity === "EMERGENCY") {
    return {
      protocol: {
        protocolCode: "EVA-ABORT-04",
        title: "ABORTAR ACTIVIDAD EXTRAVEHICULAR INMEDIATAMENTE",
        immediateActionRequired: "Retorno de emergencia inmediato al Airlock de la estación.",
        automatedSystemAction: "Apertura de válvula de O2 secundario y sellado hermético perimetral.",
        recommendedMedication: "Dexametasona profiláctica si persiste sospecha de descompresión",
        timeToCriticalitySeconds: 45,
      },
      autonomousActionTaken: "Presurización auxiliar activada a 4.2 psi. Notificación prioritaria de alerta transmitida a la red local.",
    };
  }

  if (severity === "WARNING") {
    return {
      protocol: {
        protocolCode: "ECLSS-VENT-02",
        title: "ALERTA AMBIENTAL DE CABINA",
        immediateActionRequired: "Colocarse máscara portátil de O2 y verificar cartuchos absorbedores LiOH.",
        automatedSystemAction: "Aumento al 100% de la recirculación de aire del módulo.",
        timeToCriticalitySeconds: 300,
      },
      autonomousActionTaken: "Ventilación de cabina forzada a nivel máximo. Reducción de carga energética no esencial.",
    };
  }

  if (severity === "CAUTION") {
    return {
      protocol: {
        protocolCode: "BIO-REST-01",
        title: "ESTRÉS FISIOLÓGICO ELEVADO",
        immediateActionRequired: "Disminuir ritmo cardíaco. Pausar actividad física por 10 minutos e hidratarse.",
        automatedSystemAction: "Incremento de flujo de enfriamiento de agua en el interior del traje LCVG.",
        timeToCriticalitySeconds: 1200,
      },
      autonomousActionTaken: "Ciclo térmico del traje enfriado a 18°C.",
    };
  }

  // Estado NOMINAL
  return {
    protocol: {
      protocolCode: "MISSION-NORMAL-00",
      title: "OPERACIÓN NOMINAL ESTABLE",
      immediateActionRequired: "Continuar con las tareas de la bitácora de vuelo estándar.",
      automatedSystemAction: "Monitoreo pasivo continuo a 1 Hz.",
      timeToCriticalitySeconds: 86400,
    },
    autonomousActionTaken: "Sin acciones correctivas requeridas. Telemetría dentro de límites seguros de vuelo.",
  };
}
