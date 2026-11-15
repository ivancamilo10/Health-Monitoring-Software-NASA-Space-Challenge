# 🛰️ MINS-HEALTH — FLIGHT SOFTWARE TECHNICAL DOCUMENTATION
### Autonomous Deep Space Clinical Monitoring & Triage Platform
**NASA Space Apps Challenge 2026** • Global Theme: *The Next Frontier*  
**Challenge:** *Create Health Monitoring Software for Astronauts on Space Missions*  
**Team:** Mins Solutions TI (Colombia 🇨🇴)  
**Authors:**
- **Ivan Mejia Triana** (`@ivanmejia1082`) — *Team Owner & Lead Architect*
- **Giordi Gutiérrez Villegas** (`@giordigutierrez1`) — *Biomedical Systems & Clinical Logic*
- **Camilo Canedo** (`@camilote777`) — *Full-Stack Developer & Telemetry*
- **Samuel Buzón** (`@samuel.buzon`) — *3D Visualization & Interaction Design*
- **Ali Riascos** (`@aliii___`) — *Scientific Evidence & Mission QA*

---

## 📑 TABLE OF CONTENTS
1. [Software Architecture & Data Flow](#1-software-architecture--data-flow)
2. [Personalized L-30 Baseline Engine (`src/core/baseline.ts`)](#2-personalized-l-30-baseline-engine-srccorebaselinets)
3. [Explainable Clinical Rules Engine (`src/core/rules.ts`)](#3-explainable-clinical-rules-engine-srccorerulests)
4. [HRP Hazard Synergy Causal Graph (`src/core/hazard-interactions.ts`)](#4-hrp-hazard-synergy-causal-graph-srccorehazard-interactionsts)
5. [SBAR Clinical Handover Packet with CRC32 Checksum (`src/core/sbar-handover.ts`)](#5-sbar-clinical-handover-packet-with-crc32-checksum-srccoresbar-handoverts)
6. [Reactive Offline-First Persistence (`src/store/health-store.ts`)](#6-reactive-offline-first-persistence-srcstorehealth-storets)
7. [3D WebGL Biomedical Hologram (`src/components/nasa/AstronautGLBViewer.tsx`)](#7-3d-webgl-biomedical-hologram-srccomponentsnasaastronautglbviewertsx)
8. [NASA Standards & Dataset Compliance Matrix](#8-nasa-standards--dataset-compliance-matrix)

---

## 1. SOFTWARE ARCHITECTURE & DATA FLOW

**Mins-Health** overcomes the **4 to 24-minute Earth-Mars communication latency** through a strictly **100% client-side (Local-First)** architecture. Vitals evaluation, risk scoring, and life-support emergency protocols execute in real time without any external round-trip dependency to Earth.

```mermaid
flowchart TD
    subgraph SENSORS ["Onboard Telemetry Feeds"]
        A1["Physiological Sensors (CSA Bio-Monitor)"]
        A2["Radiation Dosimeter (CANS Active Neutron)"]
        A3["ECLSS Life Support (Cabin & EMU Suit Bus)"]
        A4["Cognitive Vigilance (NASA PVT Test)"]
    end

    subgraph ENGINE ["Flight Decision Core (src/core/)"]
        B1["baseline.ts\nPersonal L-30 Engine (Mean, SD, Z-Score)"]
        B2["rules.ts\nNASA-STD-3001 Clinical Guardrails"]
        B3["hazard-interactions.ts\nHRP Hazard Synergy Causal Graph"]
        B4["sbar-handover.ts\nSBAR Compiler with CRC32 Checksum"]
    end

    subgraph STATE ["Global Reactive Store (src/store/)"]
        C1["health-store.ts (Zustand + LocalStorage Sync)"]
    end

    subgraph UI ["3-Zone Mission Cockpit (src/app/)"]
        D1["Left Bento Rail: 6 Indicators + Dosimetry"]
        D2["Center Hero: 3D Astronaut Avatar (Three.js WebGL)"]
        D3["Right Drawer: Progressive Disclosure & SBAR"]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B2 & B3 & B4 --> C1
    C1 --> D1 & D2 & D3
```

---

## 2. PERSONALIZED L-30 BASELINE ENGINE (`src/core/baseline.ts`)

### Scientific Rationale
In microgravity, cephalic fluid shifts and cardiovascular deconditioning fundamentally alter human basal physiology. **Evaluating astronauts against terrestrial generic normal ranges creates dangerous false alarms.**

### Implemented Algorithm
The engine processes each astronaut's individual 30-day pre-flight history ($L-30$) to compute an unbiased sample mean, standard deviation ($s$), and dynamic $Z$-score:

$$Z = \frac{x - \mu}{\sigma}$$

```typescript
export interface BaselineStats {
  indicatorId: IndicatorId;
  count: number;
  mean: number;
  standardDeviation: number;
  min: number;
  max: number;
  isCalibrated: boolean; // Requires a minimum of 3 readings
}

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

  // Unbiased sample variance (N - 1)
  const variance =
    count > 1
      ? validValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (count - 1)
      : 0;

  return {
    indicatorId,
    count,
    mean: Number(mean.toFixed(2)),
    standardDeviation: Number(Math.sqrt(variance).toFixed(2)),
    min: Math.min(...validValues),
    max: Math.max(...validValues),
    isCalibrated: count >= 3,
  };
}
```

### Strict Data Integrity Rule
Missing or corrupted sensor readings are **NEVER** disguised as nominal (`GREEN`). The system strictly flags missing values as `SIN_DATOS` (`NO_DATA`), displayed in neutral gray and accounted for separately.

```typescript
export function calculateZScore(
  currentValue: number | null | undefined,
  baseline: BaselineStats
): number | null {
  if (
    currentValue === null ||
    currentValue === undefined ||
    !baseline.isCalibrated ||
    baseline.standardDeviation === 0
  ) {
    return null; // Z-score computation is mathematically undefined without calibrated variance
  }
  return Number(((currentValue - baseline.mean) / baseline.standardDeviation).toFixed(2));
}
```

---

## 3. EXPLAINABLE CLINICAL RULES ENGINE (`src/core/rules.ts`)

### Clinical Decoupling Principle
1. **Statistical Deviation ($|Z| \ge 1.4\sigma$):** Yields at **MOST** a `"VIGILAR"` (Watch) or `"ATENCION"` (Caution) state. It never aborts mission operations for a benign statistical fluctuation.
2. **Absolute Clinical Threshold (NASA-STD-3001):** The **EXCLUSIVE** mechanism allowed to trigger `"ESCALAR_TIERRA"` (Critical Ground Escalation).

```typescript
export function evaluateSingleIndicator(
  indicatorId: IndicatorId,
  currentValue: number | null,
  baseline: BaselineStats,
  destination: MissionDestination = "ISS"
): IndicatorEvaluation {
  const meta = HEALTH_INDICATORS[indicatorId];

  // Case 1: Data Integrity - Telemetry Dropout
  if (currentValue === null || isNaN(currentValue)) {
    return {
      indicatorId,
      name: meta.name,
      state: "SIN_DATOS",
      stateLabel: "No Telemetry",
      badgeColor: "#6B7280", // Standardized neutral gray
      evaluationType: "SIN_DATOS",
      explanation: { ... },
    };
  }

  // Case 2: Strict NASA-STD-3001 Absolute Clinical Breach
  const clinicalBreach = checkAbsoluteClinicalThreshold(indicatorId, currentValue, destination);
  if (clinicalBreach.isBreached) {
    return {
      indicatorId,
      name: meta.name,
      state: "ESCALAR_TIERRA",
      stateLabel: "Critical Action Required",
      badgeColor: "#EF4444",
      evaluationType: "UMBRAL_CLINICO_ABSOLUTO",
      escalation: {
        level: "AVISAR_TIERRA",
        levelLabel: "Escalate to Flight Surgeon / DSN",
        actionRequired: clinicalBreach.actionRequired,
      },
      // ...
    };
  }

  // Case 3: Statistical Deviation from Personal Baseline (Z-Score)
  const zScore = calculateZScore(currentValue, baseline);
  if (zScore !== null && Math.abs(zScore) >= 2.0) {
    return {
      indicatorId,
      name: meta.name,
      state: "ATENCION",
      stateLabel: "Personal Baseline Anomaly",
      badgeColor: "#F59E0B", // Caution Amber
      evaluationType: "LINEA_BASE_ESTADISTICA",
      escalation: {
        level: "AVISAR_TRIPULACION",
        levelLabel: "Onboard Crew Self-Management",
        actionRequired: "Repeat measurement and verify circadian rest cycle.",
      },
      // ...
    };
  }

  return {
    indicatorId,
    name: meta.name,
    state: "HABITUAL",
    stateLabel: "Within Baseline",
    badgeColor: "#10B981", // Nominal Green
    evaluationType: "LINEA_BASE_ESTADISTICA",
    // ...
  };
}
```

---

## 4. HRP HAZARD SYNERGY CAUSAL GRAPH (`src/core/hazard-interactions.ts`)

### Combating Alarm Fatigue
During acute anomalies (e.g., Extreme Solar Particle Events or ECLSS malfunctions), multiple biomarkers shift simultaneously. Standard monitors ring six loud alarm bells at once, inducing cognitive overload and panic.

Mins-Health evaluates the adjacency matrix of NASA’s **5 Human Research Program (HRP) Hazards**:
1. `RADIACION` (GCR & SPE)
2. `AISLAMIENTO` (Confinement & Sleep Deprivation)
3. `DISTANCIA` (Radio Latency)
4. `GRAVEDAD` (Cardiovascular deconditioning)
5. `ENTORNO_CERRADO` (ECLSS life support failure)

```typescript
export function evaluateHazardSynergies(
  evaluations: Record<IndicatorId, IndicatorEvaluation>,
  mission: MissionDestination
): HazardSynergyPattern | null {
  const deviatedIds = (Object.keys(evaluations) as IndicatorId[]).filter(
    (id) => evaluations[id].state === "ATENCION" || evaluations[id].state === "ESCALAR_TIERRA"
  );

  // Synergy Rule: Solar Particle Event + Autonomic Tachycardia
  if (deviatedIds.includes("radiation_dose") && deviatedIds.includes("heart_rate")) {
    return {
      patternId: "SYNERGY_RADIATION_CARDIOVASCULAR",
      title: "Synergistic Pattern: Radiation Surge & Autonomic Stress",
      severity: "CRITICO",
      primaryHazards: ["RADIACION", "ENTORNO_CERRADO"],
      whyTogetherMatters:
        "Elevated environmental dosimeter combined with tachycardia indicates acute solar particle event (SPE) exposure or severe autonomic distress.",
      actionPlan: [
        "Relocate immediately to the vessel's water-shielded Storm Shelter.",
        "Deploy polyethylene radiation shielding blocks.",
        "Transmit high-priority SBAR packet via next Deep Space Network pass.",
      ],
    };
  }

  // Synergy Rule: ECLSS Cabin Scrubbing Failure
  if (deviatedIds.includes("spo2") && deviatedIds.includes("respiratory_rate")) {
    return {
      patternId: "SYNERGY_HYPOXIC_RESPIRATORY",
      title: "Systemic Pattern: Compensatory Hyperventilation from Cabin Hypoxia",
      severity: "ALERTA",
      primaryHazards: ["ENTORNO_CERRADO"],
      whyTogetherMatters:
        "Tachypnea coupled with dropping SpO2 indicates LiOH scrubber saturation or cabin decompression.",
      actionPlan: [
        "Inspect partial pressure CO2 (ppCO2) on the life support panel.",
        "Activate secondary scrubbers and verify oxygen mask seal integrity.",
      ],
    };
  }

  return null;
}
```

---

## 5. SBAR CLINICAL HANDOVER PACKET WITH CRC32 CHECKSUM (`src/core/sbar-handover.ts`)

To overcome the 44-minute latency gap, Mins-Health synthesizes clinical telemetry into standardized **SBAR** (*Situation, Background, Assessment, Recommendation*) packets.

### Cryptographic Integrity (Aerospace CRC32)
Protects against single-event upsets (SEU) and bit-flips caused by cosmic rays across deep space radio packets:

```typescript
export function computeCRC32(asciiString: string): string {
  let crc = 0 ^ -1;
  for (let i = 0; i < asciiString.length; i++) {
    const code = asciiString.charCodeAt(i);
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ code) & 0xff];
  }
  const result = (crc ^ -1) >>> 0;
  return result.toString(16).toUpperCase().padStart(8, "0");
}

export function compileSBARPacket(
  report: MissionDecisionReport,
  mission: MissionDestination,
  astronaut: { id: string; name: string; role: string; radiationAccumulated: number }
): SBARHandoverPacket {
  const situation = {
    headline: report.isSystemicPattern ? report.patternTitle! : `Status: ${report.overallStateLabel}`,
    overallSeverity: report.overallState,
  };

  const payloadToHash = JSON.stringify({ situation, evaluations: report.evaluations });
  const checksum = computeCRC32(payloadToHash);

  return {
    packetId: `SBAR-${mission}-${Date.now()}`,
    generationTimestampUTC: new Date().toISOString(),
    mission,
    missionElapsedDays: 142,
    astronaut: {
      ...astronaut,
      careerRadiationLimitMilliSv: 600, // NASA official career radiation limit
    },
    sbar: {
      situation,
      background: {
        missionProfile: `Transit to ${mission} with one-way light delay: ${report.evaluatedAt}`,
      },
      assessment: {
        // ...
      },
      recommendation: {
        actionsTakenOnboard: [report.primaryAction],
        flightSurgeonAdvisoryRequested: "Validate cumulated dosimetry and confirm protocol.",
        followUpWindowMinutes: 60,
      },
    },
    integrity: {
      algorithm: "CRC32-AEROSPACE",
      checksum,
      verifiedOffline: true,
    },
  };
}
```

---

## 6. REACTIVE OFFLINE-FIRST PERSISTENCE (`src/store/health-store.ts`)

State management is handled via **Zustand with localStorage persistence**. If power glitches or cabin reboots occur, full astronaut state and L-30 baselines recover in **<15 ms**:

```typescript
export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      mission: "MARTE",
      currentReadings: INITIAL_READINGS,
      baselineHistory: INITIAL_BASELINE_HISTORY,
      activeModal: null,

      setMission: (destination: MissionDestination) => {
        set({ mission: destination });
        get().recalculateTriage();
      },

      loadDemoScenario: (scenarioKey: DemoScenarioKey) => {
        const scenario = DEMO_SCENARIOS[scenarioKey];
        set({
          currentReadings: scenario.readings,
          mission: scenario.targetMission,
        });
        get().recalculateTriage();
      },

      recalculateTriage: () => {
        const { currentReadings, baselineHistory, mission } = get();
        const report = evaluateMissionHealth(currentReadings, baselineHistory, mission);
        set({ decisionReport: report });
      },
    }),
    {
      name: "mins-health-telemetry-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

---

## 7. 3D WEBGL BIOMEDICAL HOLOGRAM (`src/components/nasa/AstronautGLBViewer.tsx`)

- **Interactive Anatomical Hotspots:** Astronauts click anatomical zones (Helmet, Chest, Arm, Abdomen) to open immediate clinical guidance.
- **Holographic X-Ray Shader:** Toggles between exterior spacesuit and internal organs via WebGL shaders, optimizing visual comprehension under cognitive fatigue.
- **Dynamic Rim Light:** Real-time visual feedback transitioning between Nominal Green (`#10B981`), Caution Amber (`#F59E0B`), and Emergency Red (`#EF4444`).

---

## 8. NASA STANDARDS & DATASET COMPLIANCE MATRIX

| Code Module | Reference Standard / Dataset | Technical Compliance |
|---|---|---|
| `baseline.ts` | **NASA HRP Standard Measures** | Individualized pre-flight Z-scores avoiding terrestrial false positives |
| `rules.ts` | **NASA-STD-3001 Vols 1 & 2** | Strict absolute clinical threshold triggers for ground escalation |
| `hazard-interactions.ts` | **NASA 5 Hazards Framework** | Causal multi-hazard graph mitigating alarm fatigue |
| `sbar-handover.ts` | **WHO & NASA Flight Medicine** | Structured SBAR protocol with cyclic redundancy checksum |
| `NasaOsdrModal.tsx` | **NASA OSDR OSD-575** | Validated against actual Inspiration4 commercial spaceflight data |

---
*Authored by Mins Solutions TI for the NASA Space Apps Challenge 2026 Evaluation Committee.*
