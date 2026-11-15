/**
 * =============================================================================
 * NASA SPACE APPS 2026 - SELECTOR DE MISIÓN Y LATENCIA DE COMUNICACIONES
 * =============================================================================
 * Simula las condiciones físicas de las 3 misiones de exploración humana:
 * - ISS (Órbita Baja Terrestre - LEO)
 * - LUNA (Artemis Gateway & Surface Camp)
 * - MARTE (Deep Space Transit & Jezero Base)
 *
 * Incluye el retardo de radio unidireccional y bidireccional (One-way / Round-trip)
 * que justifica la necesidad absoluta de toma de decisiones autónomas a bordo.
 */

export type MissionDestination = "ISS" | "LUNA" | "MARTE";

export interface MissionEnvironmentConfig {
  id: MissionDestination;
  name: string;
  tagline: string;
  distanceFromEarthKm: string;
  oneWayLightDelaySeconds: number; // En segundos
  oneWayDelayDisplay: string;
  gravityRatio: number; // 1 = Tierra, 0 = microgravedad
  gravityLabel: string;
  radiationBaselineDailyMicroSv: number;
  missionDurationEstimate: string;
  groundSupportAvailability: "TIEMPO_REAL" | "LATENCIA_BAJA" | "AUTONOMO_ESTRICTO";
}

export const MISSIONS_CONFIG: Record<MissionDestination, MissionEnvironmentConfig> = {
  ISS: {
    id: "ISS",
    name: "Estación Espacial Internacional (ISS)",
    tagline: "Órbita Baja Terrestre (LEO) - 400 km de altitud",
    distanceFromEarthKm: "408 km",
    oneWayLightDelaySeconds: 2,
    oneWayDelayDisplay: "2 segundos",
    gravityRatio: 0,
    gravityLabel: "Microgravedad (0 g)",
    radiationBaselineDailyMicroSv: 350, // Protegida parcialmente por la magnetosfera
    missionDurationEstimate: "6 meses",
    groundSupportAvailability: "TIEMPO_REAL",
  },
  LUNA: {
    id: "LUNA",
    name: "Programa Artemis (Gateway & Superficie Lunar)",
    tagline: "Espacio Cis-lunar - 384,400 km de la Tierra",
    distanceFromEarthKm: "384,400 km",
    oneWayLightDelaySeconds: 1.3,
    oneWayDelayDisplay: "1.3 segundos",
    gravityRatio: 0.166,
    gravityLabel: "Gravedad Lunar (1/6 g)",
    radiationBaselineDailyMicroSv: 700, // Sin atmósfera ni campo magnético global
    missionDurationEstimate: "30 a 60 días",
    groundSupportAvailability: "LATENCIA_BAJA",
  },
  MARTE: {
    id: "MARTE",
    name: "Misión Tripulada a Marte (Tránsito & Superficie)",
    tagline: "Espacio Profundo - ~225,000,000 km promedio",
    distanceFromEarthKm: "~225,000,000 km",
    oneWayLightDelaySeconds: 1200, // 20 minutos (rango real 4 a 24 min)
    oneWayDelayDisplay: "20 minutos (40 min ida y vuelta)",
    gravityRatio: 0.375,
    gravityLabel: "Gravedad Marciana (3/8 g)",
    radiationBaselineDailyMicroSv: 1500, // Exposición acumulativa severa
    missionDurationEstimate: "3 años (1000 días)",
    groundSupportAvailability: "AUTONOMO_ESTRICTO",
  },
};
