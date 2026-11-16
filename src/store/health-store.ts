import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IndicatorId } from "../data/indicators";
import { Language } from "../data/i18n";
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
import {
  playEmergencyAlarm,
  playCautionTone,
  playNominalChime,
  playTelemetryClick,
} from "../lib/space-audio";

export interface CrewMemberProfile {
  id: string;
  name: string;
  role: string;
  callsign: string;
  avatarInitials: string;
  careerRadiationMilliSv: number;
  readings: Record<IndicatorId, number | null>;
}

export const ARTEMIS_CREW_ROSTER: CrewMemberProfile[] = [
  {
    id: "alex-vance",
    name: "Cmdr. Alex Vance",
    role: "Mission Commander & EVA Lead",
    callsign: "VANCE-01",
    avatarInitials: "AV",
    careerRadiationMilliSv: 142.5,
    readings: {
      blood_pressure: 118,
      heart_rate: 66,
      glucose: 90,
      core_temp: 36.8,
      sleep_hours: 6.4,
      mood: 4,
      radiation_dose: 520,
    },
  },
  {
    id: "jessica-watkins",
    name: "Dr. Jessica Watkins",
    role: "Crew Medical Officer & Geologist",
    callsign: "WATKINS-02",
    avatarInitials: "JW",
    careerRadiationMilliSv: 88.0,
    readings: {
      blood_pressure: 112,
      heart_rate: 60,
      glucose: 88,
      core_temp: 36.6,
      sleep_hours: 7.2,
      mood: 5,
      radiation_dose: 490,
    },
  },
  {
    id: "reid-wiseman",
    name: "Pilot Reid Wiseman",
    role: "Flight Systems & Propulsion Pilot",
    callsign: "WISEMAN-03",
    avatarInitials: "RW",
    careerRadiationMilliSv: 165.2,
    readings: {
      blood_pressure: 124,
      heart_rate: 74,
      glucose: 95,
      core_temp: 36.9,
      sleep_hours: 5.9,
      mood: 4,
      radiation_dose: 540,
    },
  },
  {
    id: "jeremy-hansen",
    name: "Specialist Jeremy Hansen",
    role: "Robotics & Life Support Specialist",
    callsign: "HANSEN-04",
    avatarInitials: "JH",
    careerRadiationMilliSv: 110.0,
    readings: {
      blood_pressure: 116,
      heart_rate: 68,
      glucose: 91,
      core_temp: 36.7,
      sleep_hours: 6.8,
      mood: 4,
      radiation_dose: 510,
    },
  },
];

export type DemoScenarioId =
  | "RUTINA_NORMAL"
  | "TORMENTA_SOLAR"
  | "FUGA_DE_TRAJE"
  | "AISLAMIENTO_PROLONGADO"
  | "SIN_DATOS";

export const SCENARIO_NAMES: Record<DemoScenarioId, { es: string; en: string }> = {
  RUTINA_NORMAL: {
    es: "Rutina Normal de Vuelo (Tranquilo)",
    en: "Nominal Flight Routine (Stable)",
  },
  TORMENTA_SOLAR: {
    es: "Tormenta Solar Crítica (SPE) - Multiórgano en Alerta",
    en: "Critical Solar Particle Event (SPE) - Multi-Organ Alert",
  },
  FUGA_DE_TRAJE: {
    es: "Fuga de Traje EVA - Despresurización & Choque Hipóxico",
    en: "EVA Suit Leak - Rapid Depressurization & Hypoxic Shock",
  },
  AISLAMIENTO_PROLONGADO: {
    es: "Aislamiento Prolongado - Desincronización Circadiana",
    en: "Prolonged Confinement - Circadian Desynchrony",
  },
  SIN_DATOS: {
    es: "Integridad de Telemetría (Campos Sin Datos en Gris)",
    en: "Telemetry Integrity (Missing Fields in Gray)",
  },
};

export interface HealthState {
  mission: MissionDestination;
  selectedCrewId: string;
  astronautName: string;
  astronautRole: string;
  language: Language;
  isOnline: boolean;
  isAudioMuted: boolean;
  isDsnModalOpen: boolean;
  
  // Dosis acumulada total de carrera del astronauta (NASA Career Limit: 600 mSv)
  careerRadiationAccumulatedMilliSv: number;
  careerRadiationLimitMilliSv: number;
  
  currentReadings: Record<IndicatorId, number | null>;
  baselines: Record<IndicatorId, BaselineStats>;
  
  decisionReport: MissionDecisionReport;
  
  sentPackets: FlightSurgeonReportPacket[];
  commsCountdownSeconds: number | null;
  activeScenarioId: DemoScenarioId;
  activeScenarioName: string;

  // Acciones
  setLanguage: (language: Language) => void;
  setMission: (mission: MissionDestination) => void;
  selectCrewMember: (crewId: string) => void;
  toggleAudio: () => void;
  openDsnModal: () => void;
  closeDsnModal: () => void;
  setReading: (id: IndicatorId, value: number | null) => void;
  setAllReadings: (readings: Partial<Record<IndicatorId, number | null>>) => void;
  evaluateHealth: () => void;
  loadDemoScenario: (scenario: DemoScenarioId) => void;
  sendReportToEarth: () => FlightSurgeonReportPacket;
  decrementCountdown: () => void;
  resetToNominalCalm: () => void;
  resetToBaselines: () => void;
}

const INITIAL_CALM_READINGS = ARTEMIS_CREW_ROSTER[0].readings;

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      mission: "ISS",
      selectedCrewId: "alex-vance",
      astronautName: "Cmdr. Alex Vance",
      astronautRole: "Mission Commander & EVA Lead",
      language: "es",
      isOnline: true,
      isAudioMuted: false,
      isDsnModalOpen: false,
      
      careerRadiationAccumulatedMilliSv: 142.5,
      careerRadiationLimitMilliSv: 600.0,
      
      currentReadings: INITIAL_CALM_READINGS,
      baselines: DEFAULT_ASTRONAUT_BASELINES,
      decisionReport: generateMissionDecisionReport(INITIAL_CALM_READINGS, DEFAULT_ASTRONAUT_BASELINES, "ISS", "es"),
      sentPackets: [],
      commsCountdownSeconds: null,
      activeScenarioId: "RUTINA_NORMAL",
      activeScenarioName: SCENARIO_NAMES.RUTINA_NORMAL.es,

      setLanguage: (language: Language) => {
        set({ language });
        get().evaluateHealth();
        if (!get().isAudioMuted) playTelemetryClick();
      },

      setMission: (mission) => {
        set({ mission });
        if (!get().isAudioMuted) playTelemetryClick();
        get().evaluateHealth();
      },

      selectCrewMember: (crewId: string) => {
        const member = ARTEMIS_CREW_ROSTER.find((c) => c.id === crewId) || ARTEMIS_CREW_ROSTER[0];
        set({
          selectedCrewId: member.id,
          astronautName: member.name,
          astronautRole: member.role,
          careerRadiationAccumulatedMilliSv: member.careerRadiationMilliSv,
          currentReadings: member.readings,
        });
        if (!get().isAudioMuted) playNominalChime();
        get().evaluateHealth();
      },

      toggleAudio: () => {
        const next = !get().isAudioMuted;
        set({ isAudioMuted: next });
        if (!next) playNominalChime();
      },

      openDsnModal: () => {
        set({ isDsnModalOpen: true });
        if (!get().isAudioMuted) playTelemetryClick();
      },

      closeDsnModal: () => {
        set({ isDsnModalOpen: false });
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
        const { currentReadings, baselines, mission, language, activeScenarioId } = get();
        const lang = language || "es";
        const scenId = activeScenarioId || "RUTINA_NORMAL";
        const report = generateMissionDecisionReport(currentReadings, baselines, mission, lang);
        set({
          decisionReport: report,
          activeScenarioName: SCENARIO_NAMES[scenId]?.[lang] || SCENARIO_NAMES.RUTINA_NORMAL[lang],
        });
      },

      loadDemoScenario: (scenario: DemoScenarioId) => {
        const lang = get().language || "es";
        if (scenario === "TORMENTA_SOLAR") {
          // Evento de partículas solares (SPE) agudo con síndrome agudo de radiación y fiebre espacial
          const speReadings: Record<IndicatorId, number | null> = {
            blood_pressure: 168,  // Crisis hipertensiva por descarga adrenérgica / PIC
            heart_rate: 126,       // Taquicardia crítica por choque hipovolémico/radiación
            glucose: 182,         // Hiperglucemia reactiva aguda de estrés
            core_temp: 39.1,      // Hipertermia extrema "Space Fever" por radiación ionizante
            sleep_hours: 2.8,     // Colapso de descanso por alerta de refugio
            mood: 2,              // Estrés severo
            radiation_dose: 3400, // Tormenta solar crítica letal (> 2000 µSv/día)
          };
          set({
            mission: "MARTE",
            currentReadings: speReadings,
            careerRadiationAccumulatedMilliSv: 195.4,
            activeScenarioId: "TORMENTA_SOLAR",
            activeScenarioName: SCENARIO_NAMES.TORMENTA_SOLAR[lang],
          });
          if (!get().isAudioMuted) playEmergencyAlarm();
        } else if (scenario === "FUGA_DE_TRAJE") {
          // Emergencia EVA: Micrometeoroide perfora el traje espacial con despresurización rápida
          const suitLeakReadings: Record<IndicatorId, number | null> = {
            blood_pressure: 76,   // Hipotensión severa por despresurización barométrica
            heart_rate: 152,      // Taquicardia hipóxica crítica de emergencia
            glucose: 68,
            core_temp: 34.6,      // Hipotermia por fuga del sublimador térmico de vacío
            sleep_hours: 4.0,
            mood: 1,              // Pánico / Alerta vital máxima
            radiation_dose: 2400, // Exposición directa sin blindaje de módulo
          };
          set({
            mission: "LUNA",
            currentReadings: suitLeakReadings,
            careerRadiationAccumulatedMilliSv: 154.0,
            activeScenarioId: "FUGA_DE_TRAJE",
            activeScenarioName: SCENARIO_NAMES.FUGA_DE_TRAJE[lang],
          });
          if (!get().isAudioMuted) playEmergencyAlarm();
        } else if (scenario === "AISLAMIENTO_PROLONGADO") {
          const isolationReadings: Record<IndicatorId, number | null> = {
            blood_pressure: 138,
            heart_rate: 88,
            glucose: 105,
            core_temp: 37.6,
            sleep_hours: 3.2,     // Privación circadiana severa (< 4h)
            mood: 1,              // Apatía severa / depresión de confinamiento
            radiation_dose: 1850, // Nivel típico en Marte (1500-2000 µSv/día)
          };
          set({
            mission: "MARTE",
            currentReadings: isolationReadings,
            activeScenarioId: "AISLAMIENTO_PROLONGADO",
            activeScenarioName: SCENARIO_NAMES.AISLAMIENTO_PROLONGADO[lang],
          });
          if (!get().isAudioMuted) playCautionTone();
        } else if (scenario === "SIN_DATOS") {
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
            activeScenarioId: "SIN_DATOS",
            activeScenarioName: SCENARIO_NAMES.SIN_DATOS[lang],
          });
          if (!get().isAudioMuted) playTelemetryClick();
        } else {
          set({
            mission: "ISS",
            currentReadings: INITIAL_CALM_READINGS,
            careerRadiationAccumulatedMilliSv: 142.5,
            activeScenarioId: "RUTINA_NORMAL",
            activeScenarioName: SCENARIO_NAMES.RUTINA_NORMAL[lang],
          });
          if (!get().isAudioMuted) playNominalChime();
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

        if (!get().isAudioMuted) playNominalChime();
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
        const alex = ARTEMIS_CREW_ROSTER[0];
        const lang = get().language || "es";
        set({
          mission: "ISS",
          selectedCrewId: alex.id,
          astronautName: alex.name,
          astronautRole: alex.role,
          careerRadiationAccumulatedMilliSv: alex.careerRadiationMilliSv,
          currentReadings: alex.readings,
          activeScenarioId: "RUTINA_NORMAL",
          activeScenarioName: SCENARIO_NAMES.RUTINA_NORMAL[lang],
        });
        if (!get().isAudioMuted) playNominalChime();
        get().evaluateHealth();
      },

      resetToBaselines: () => {
        get().resetToNominalCalm();
      },
    }),
    {
      name: "mins-health-telemetry-v3",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.evaluateHealth();
        }
      },
    }
  )
);
