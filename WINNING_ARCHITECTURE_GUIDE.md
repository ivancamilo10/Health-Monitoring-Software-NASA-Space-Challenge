# 🚀 NASA SPACE APPS CHALLENGE: WINNING ARCHITECTURE & FLIGHT CREW GUIDE
**Project:** Mins-Health: Autonomous Deep Space Clinical Monitoring & Triage Platform  
**Challenge:** *Create Health Monitoring Software for Astronauts on Space Missions*  
**Global Theme:** *The Next Frontier*  
**Team:** Mins Solutions TI (Colombia 🇨🇴)  

---

## 👨‍🚀 1. FLIGHT CREW ORGANIZATIONAL STRUCTURE (5 CREW MEMBERS)

To excel in the NASA Space Apps Challenge, team synchronization is structured as an aerospace flight crew:

```
                                    ┌────────────────────────────────────────────────────────┐
                                    │         UNIVERSAL CONTRACT (Single Source of Truth)    │
                                    │           /src/types/mission-health.types.ts           │
                                    └────────────────────────────────────────────────────────┘
                                            ▲                   ▲                   ▲
                   ┌────────────────────────┴──┐     ┌──────────┴──────────────┐    └──────────────────────────────────┐
                   │    LEAD ARCHITECT (DEV A) │     │   BIOMEDICAL ENG (DEV B)│     │      FULL-STACK / HUD (DEV C)    │
                   │    Ivan Mejia Triana      │     │  Giordi Gutiérrez       │     │          Camilo Canedo           │
                   │ (Data Models, Architecture)│     │(Clinical Logic & HRP Engine)│    │   (Mission Control HUD & Store)  │
                   └────────────────────────────┘     └─────────────────────────┘     └──────────────────────────────────┘
                                  ▲                                                                     ▲
                                  │                                                                     │
               ┌──────────────────┴─────────────────────────────────────────────────────────────────────┴──────────────────┐
               │                                                                                                           │
    ┌────────────────────────────────────────┐                                                 ┌────────────────────────────────────────┐
    │      3D & INTERACTION SPECIALIST       │                                                 │         MISSION QA & PITCH LEAD        │
    │              Samuel Buzón              │                                                 │               Ali Riascos              │
    │         (UI/UX & WebGL Shaders)        │                                                 │     (Non-Technical QA & Presentation)  │
    ├────────────────────────────────────────┤                                                 ├────────────────────────────────────────┤
    │ • 3D Spacesuit (.glb) Three.js shaders │                                                 │ • Flight Acceptance UAT testing        │
    │ • MIL-STD-1472 color palette & tokens  │                                                 │ • Structured Defect reporting          │
    │ • Mission badges & anatomical hotspots │                                                 │ • 3-minute Master Pitch for NASA judges│
    │ • Reference: DESIGN_SYSTEM_GUIDE.md    │                                                 │ • Reference: FLIGHT_TEST_MANUAL.md     │
    └────────────────────────────────────────┘                                                 └────────────────────────────────────────┘
```

---

## 🗺️ 2. RESPONSIBILITY MATRIX BY CREW MEMBER

| Member | Mission Role | Primary File Scope | Concrete Responsibilities | Reference Guide |
|---|---|---|---|---|
| **Ivan Mejia Triana** | 📡 Team Owner & Lead Architect | `/src/core/*`<br>`/src/repositories/*`<br>`/prisma/*` | System architecture, SBAR cryptographic packets, and API integrity. | `TECHNICAL_CODE_DOCUMENTATION.md` |
| **Giordi Gutiérrez** | 🧬 Biomedical Systems & Clinical Logic | `/src/core/rules.ts`<br>`/src/core/baseline.ts`<br>`/src/core/hazard-interactions.ts` | Physiological algorithms, L-30 Z-score baselines, HRP multi-hazard synergy engine, and NASA-STD-3001 guardrails. | `TECHNICAL_CODE_DOCUMENTATION.md` |
| **Camilo Canedo** | 💻 Full-Stack & Telemetry Systems | `/src/components/*`<br>`/src/store/*`<br>`/src/app/page.tsx` | Interactive flight cockpit, offline-first Zustand persistence, and contingency injection modal. | `TECHNICAL_CODE_DOCUMENTATION.md` |
| **Samuel Buzón** | 🎨 3D Visualization & Interaction Design | `src/components/nasa/AstronautGLBViewer.tsx`<br>`tailwind.config.ts`<br>`src/app/globals.css` | 3D WebGL astronaut viewer, holographic X-ray shader, anatomical hotspots, and MIL-STD-1472 ergonomic safety palette. | `DESIGN_SYSTEM_GUIDE.md` |
| **Ali Riascos** | 🧪 Mission QA & Scientific Validation | Browser (`localhost:3000`) & Testing Suite | Contingency UAT validation (Suit Leak, SPE Storm, CO2 toxicity), defect tracking, and 3-minute pitch deck delivery. | `FLIGHT_TEST_MANUAL.md` |

---

## 🔬 3. SCIENTIFIC EVIDENCE GROUNDING
All physiological thresholding strictly complies with **NASA-STD-3001** and is validated against commercial spaceflight human multi-omics data from **NASA Open Science Data Repository (OSDR Dataset OSD-575)**.
