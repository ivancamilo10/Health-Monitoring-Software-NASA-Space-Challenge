import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IndicatorId } from "../data/indicators";
import { BaselineStats, DEFAULT_ASTRONAUT_BASELINES } from "../core/baseline";
import {
  generateMissionDecisionReport,
  MissionDecisionReport,
} from "../core/rules";
import { MissionDestination, MISSIONS_CONFIG } from "../core/missions";
import {
  FlightSurgeonReportPacket,
  packageFlightSurgeonReport,
} from "../core/escalation";

export interface HealthState {
  mission: MissionDestination;
  astronautName: string;
  astronautRole: string;
  isOnline: boolean;
  
  // Dosis acumulada total de carrera del astronauta (NASA Career Limit: 600 mSv)
  careerRadiationAccumulatedMilliSv: number;
  careerRadiationLimitMilliSv: number;
  
  currentReadings: Record<IndicatorId, number | null>;
  baselines: Record<IndicatorId, BaselineStats>;
  
  decisionReport: MissionDecisionReport;
  
  sentPackets: FlightSurgeonReportPacket[];
  commsCountdownSeconds: number | null;
  activeScenarioName: string;

  // Acciones
  setMission: (mission: MissionDestination) => void;
  setReading: (id: IndicatorId, value: number | null) => void;
  setAllReadings: (readings: Partial<Record<IndicatorId, number | null>>) => void;
  evaluateHealth: () => void;
  loadDemoScenario: (scenario: "RUTINA_NORMAL" | "TORMENTA_SOLAR" | "AISLAMIENTO_PROLONGADO" | "SIN_DATOS") => void;
  sendReportToEarth: () => FlightSurgeonReportPacket;
  decrementCountdown: () => void;
  resetToNominalCalm: () => void;
  resetToBaselines: () => void;
}

// -----------------------------------------------------------------------------
// ESTADO INICIAL TRANQUILO (CALMA):
// Casi todos "Habitual", y un indicador en "Vigilar" (Sueño a 6.4h, leve variación)
// Radiación a 520 µSv/día (normal en ISS, jamás emergencia).
// -----------------------------------------------------------------------------
const INITIAL_CALM_READINGS: Record<IndicatorId, number | null> = {
  blood_pressure: 118, // Habitual (Base 116)
  heart_rate: 66,      // Habitual (Base 64)
  glucose: 90,         // Habitual (Base 88)
  core_temp: 36.8,     // Habitual (Base 36.7)
  sleep_hours: 6.4,    // VIGILAR: Leve variación por ciclo de trabajo (Base 7.6h)
  mood: 4,             // Habitual (Base 4.4)
  radiation_dose: 520, // Habitual: Tasa típica nominal ISS (< 730 µSv/día)
};

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      mission: "ISS",
      astronautName: "Cmdr. Alex Vance",
      astronautRole: "Flight Engineer / EVA Specialist",
      isOnline: true,
      
      careerRadiationAccumulatedMilliSv: 142.5, // 142.5 mSv acumulados en misiones previas
      careerRadiationLimitMilliSv: 600.0,       // Límite de carrera NASA (600 mSv)
      
      currentReadings: INITIAL_CALM_READINGS,
      baselines: DEFAULT_ASTRONAUT_BASELINES,
      decisionReport: generateMissionDecisionReport(INITIAL_CALM_READINGS, DEFAULT_ASTRONAUT_BASELINES, "ISS"),
      sentPackets: [],
      commsCountdownSeconds: null,
      activeScenarioName: "Rutina Normal de Vuelo (Tranquilo)",

      setMission: (mission) => {
        set({ mission });
        get().evaluateHealth();
      },

      setReading: (id, value) => {
        const updated = { ...get().currentReadings, [id]: value };
        set({ currentReadings: updated });
        get().evaluateHealth();
      },

      setAllReadings: (newReadings) => {
        const updated = { ...get().currentReadings, ...newReadings };
        set({ currentReadings: updated });
        get().evaluateHealth();
      },

      evaluateHealth: () => {
        const { currentReadings, baselines, mission } = get();
        const report = generateMissionDecisionReport(currentReadings, baselines, mission);
        set({ decisionReport: report });
      },

      // -----------------------------------------------------------------------
      // ESCENARIOS DEMO ACTUALIZADOS:
      // (a) Rutina normal (tranquilo)
      // (b) Tormenta solar (radiación sube, alertas agrupadas de patrón)
      // (c) Aislamiento prolongado (sueño y ánimo bajan)
      // -----------------------------------------------------------------------
      loadDemoScenario: (scenario) => {
        if (scenario === "TORMENTA_SOLAR") {
          // Escenario: Evento de partículas solares (SPE) agudo en espacio profundo
          const speReadings: Record<IndicatorId, number | null> = {
            blood_pressure: 138,  // Leve hipertensión reactiva por estrés
            heart_rate: 98,       // Taquicardia compensatoria
            glucose: 96,
            core_temp: 37.3,
            sleep_hours: 4.8,     // Sueño fragmentado por alarma de radiación
            mood: 3,
            radiation_dose: 2800, // Tormenta solar crítica (> 2000 µSv/día)
          };
          set({
            mission: "MARTE",
            currentReadings: speReadings,
            careerRadiationAccumulatedMilliSv: 185.3,
            activeScenarioName: "Tormenta Solar Aguda (SPE) - Alertas Agrupadas",
          });
        } else if (scenario === "AISLAMIENTO_PROLONGADO") {
          // Escenario: Confinamiento y distancia a la Tierra de 2 años
          const isolationReadings: Record<IndicatorId, number | null> = {
            blood_pressure: 122,
            heart_rate: 74,
            glucose: 94,
            core_temp: 36.9,
            sleep_hours: 3.8,     // Privación circadiana severa (< 4h)
            mood: 2,              // Ánimo bajo persistente
            radiation_dose: 1650, // Nivel típico en Marte (1500-2000 µSv/día)
          };
          set({
            mission: "MARTE",
            currentReadings: isolationReadings,
            activeScenarioName: "Aislamiento Prolongado - Sueño y Ánimo Reducidos",
          });
        } else if (scenario === "SIN_DATOS") {
          // Demostración de Integridad: Dato faltante = Gris
          const missingReadings: Record<IndicatorId, number | null> = {
            blood_pressure: null,
            heart_rate: 66,
            glucose: null,
            core_temp: 36.8,
            sleep_hours: null,
            mood: 4,
            radiation_dose: 520,
          };
          set({
            currentReadings: missingReadings,
            activeScenarioName: "Integridad de Telemetría (Campos Sin Datos en Gris)",
          });
        } else {
          // RUTINA NORMAL (Tranquilo)
          set({
            mission: "ISS",
            currentReadings: INITIAL_CALM_READINGS,
            careerRadiationAccumulatedMilliSv: 142.5,
            activeScenarioName: "Rutina Normal de Vuelo (Tranquilo)",
          });
        }
        get().evaluateHealth();
      },

      sendReportToEarth: () => {
        const { decisionReport, mission, astronautName } = get();
        const packet = packageFlightSurgeonReport(decisionReport, mission, "astro-artemis-001", astronautName);
        const delaySec = MISSIONS_CONFIG[mission].oneWayLightDelaySeconds;
        
        set((state) => ({
          sentPackets: [packet, ...state.sentPackets],
          commsCountdownSeconds: Math.floor(delaySec),
        }));

        return packet;
      },

      decrementCountdown: () => {
        const current = get().commsCountdownSeconds;
        if (current !== null && current > 0) {
          set({ commsCountdownSeconds: current - 1 });
        } else if (current === 0) {
          set({ commsCountdownSeconds: null });
        }
      },

      resetToNominalCalm: () => {
        set({
          mission: "ISS",
          currentReadings: INITIAL_CALM_READINGS,
          activeScenarioName: "Rutina Normal de Vuelo (Tranquilo)",
        });
        get().evaluateHealth();
      },

      resetToBaselines: () => {
        get().resetToNominalCalm();
      },
    }),
    {
      name: "aegis-space-health-2026",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
