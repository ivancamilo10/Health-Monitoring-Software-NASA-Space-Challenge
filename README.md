# Mins-Health — by Mins Solutions TI
### Autonomous Deep Space Clinical Monitoring & Triage Platform
**NASA Space Apps Challenge 2026** &bull; Global Theme: *The Next Frontier*  
**Challenge:** *"Create Health Monitoring Software for Astronauts on Space Missions"*  
**Team:** Mins Solutions TI (Colombia)  
- **Ivan Mejia Triana** (`@ivanmejia1082`) — *Team Owner & Lead Architect*
- **Giordi Gutiérrez Villegas** (`@giordigutierrez1`) — *Biomedical Systems & Clinical Logic*
- **Camilo Canedo** (`@camilote777`) — *Full-Stack Developer & Telemetry*
- **Samuel Buzón** (`@samuel.buzon`) — *3D Visualization & Interaction Design*
- **Ali Riascos** (`@aliii___`) — *Scientific Evidence & Mission QA*

---

## Quick Deliverables & Review Links

For NASA Space Apps Challenge evaluators and jury members:

1. **Standalone 3D Interactive Cockpit Demo:**  
   Open [`demo.html`](./demo.html) directly in any modern browser (Chrome, Edge, Safari, Firefox). It is 100% self-contained with the embedded 3D astronaut GLB model, anatomical systolic heart, live canvas waveforms, emergency simulation suite, and bilingual EN/ES toggle. No Node.js or web server required!
2. **Official Pitch Deck Slides:**  
   Open [`presentation.html`](./presentation.html) for the 10-slide aerospace presentation powered by Reveal.js (use arrow keys to navigate, `F` for fullscreen, `S` for speaker notes). Zero AI claims, strictly deterministic bio-astronautics framing.
3. **Full Next.js 15 Web Application:**  
   Run `npm install && npm run dev` and open `http://localhost:3000` for the complete reactive full-stack web application.

---

## 🎯 1. Executive Summary & The Problem

During deep space exploration missions (Artemis Gateway, Lunar Base, and Mars Transit), astronaut crews face the **5 Hazards of Human Spaceflight (HRP)**:
1. Space Radiation (Galactic Cosmic Rays [GCR] and Solar Particle Events [SPE]).
2. Isolation and Confinement.
3. Extreme Distance from Earth (up to 400 million km).
4. Altered Gravity Fields (microgravity 0g, Lunar 1/6g, Martian 3/8g).
5. Hostile Closed Environments with artificial life support (ECLSS).

### The "Latency Trap" on Mars:
Between Earth and Mars, radio signals take **4 to 24 minutes** each way (up to **48 minutes round-trip delay**). Conventional Earth-based telemedicine is physically incapable of responding to acute decompressions, arrhythmias, or toxic gas accumulation. Astronauts must have the capability to **self-assess, understand multi-hazard interactions, and act autonomously**.

**Mins-Health** solves this mission-critical challenge by combining:
- **Personalized L-30 Baseline:** Replaces rigid terrestrial normal ranges; each astronaut serves as their own longitudinal statistical control ($Z$-score tracking).
- **HRP Multi-Hazard Synergy Engine:** When multiple biomarkers shift simultaneously, the engine suppresses fragmented alarms and generates **ONE unified root-cause pattern alert** ("Why they matter together").
- **Cryptographic SBAR Handover Packet:** Automatic synthesis of clinical reports in the aerospace standard SBAR (Situation, Background, Assessment, Recommendation) format, sealed with an atomic CRC32 checksum for delayed Deep Space Network (DSN) downlink.
- **NASA Psychomotor Vigilance Task (PVT):** Integrated visual reaction time testing to detect micro-sleeps, lapses, and cognitive fatigue prior to critical EVAs or orbital burns.
- **100% Local-First Offline Operation:** The entire cockpit executes in-browser with persistent local storage, free from external server dependencies or opaque black-box models.

---

## 🧭 2. Modular Architecture & Project Structure

The project follows an aerospace-grade modular structure:

```
src/
├── app/
│   ├── layout.tsx                # Official NASA Space Apps metadata & styling
│   ├── page.tsx                  # 3-Zone fixed layout cockpit (zero-scroll primary view)
│   ├── globals.css               # Neutral dark aesthetic & accessible typography
│   └── api/v1/                   # REST telemetry & simulation endpoints
├── components/nasa/
│   ├── HeaderBar.tsx             # Mins-Health identity, mission selector, utility bar
│   ├── BentoTelemetryRail.tsx    # Left rail: Bento Grid with 6 indicators + CANS radiation
│   ├── AstronautGLBViewer.tsx    # Center Hero: 3D Spacesuit (.glb) with X-ray layer & hotspots
│   ├── IndicatorDetailDrawer.tsx # Side drawer: progressive disclosure, HRP questions & SBAR
│   ├── CheckupWizardModal.tsx    # Step-by-step daily telemetry checkup wizard
│   ├── DemoScenariosModal.tsx    # NASA judges' contingency injection suite (3-minute pitch)
│   ├── PsychomotorVigilanceModal.tsx # Cognitive fatigue test (NASA PVT visual reaction)
│   ├── NasaOsdrReferenceModal.tsx# NASA Open Science Data Repository reference (OSD-575)
│   ├── ScientificEvidenceModal.tsx# NASA-STD-3001 evidence matrix & clinical guardrails
│   └── GuidedPitchDemoModal.tsx  # Step-by-step interactive presentation player for judges
├── core/
│   ├── rules.ts                  # Inference engine (statistical deviation vs. clinical threshold)
│   ├── baseline.ts               # Personal L-30 baseline math (mean, sample variance, Z-scores)
│   ├── hazard-interactions.ts    # Causal graph modeling synergies across the 5 HRP hazards
│   ├── missions.ts               # Physical parameters for ISS (LEO), Lunar Surface, and Mars
│   └── sbar-handover.ts          # SBAR clinical report synthesizer with CRC32 checksum
├── data/
│   └── indicators.ts             # 7 core spaceflight biomarkers with NASA HRP metadata
└── store/
    └── health-store.ts           # Offline-first global state with Zustand & persistence
```

---

## 🔬 3. Scientific Validity & Methodological Rigor

### Statistical vs. Clinical Separation:
- **Personal Baseline Deviation ($|Z\text{-score}| \ge 1.4\text{ to }2.5$):** Emits at **MOST** a `"Watch"` or `"Caution"` state.
- **Absolute Clinical Threshold (NASA-STD-3001):** The **EXCLUSIVE** mechanism authorized to trigger `"Escalate to Ground"`. A benign glucose reading of $115\text{ mg/dL}$ will never falsely abort an EVA.

### Environmental Dosimetry Normalization:
Daily radiation rates are calibrated against the ambient baseline of each mission destination:
- **ISS (LEO):** $\sim 730\ \mu\text{Sv/day}$. Rates below this threshold are nominal and never trigger emergency alerts.
- **Lunar Surface:** $\sim 1200\ \mu\text{Sv/day}$.
- **Mars Transit:** $\sim 1800\ \mu\text{Sv/day}$.
- **NASA Career Radiation Limit:** Integrated tracking against NASA’s **600 mSv** lifetime exposure cap.

### Consultative Clinical Language:
All automated countermeasures follow non-pharmacological, supportive care recommendations (no unsupervised prescription drugs or unverified definitive diagnoses).

---

## ⚡ 4. Local Quickstart & Flight Setup

### Prerequisites:
- Node.js 18+ or 20+ (tested on Node v20/v24 LTS).
- Modern web browser (Chrome, Edge, Firefox, Safari).

### Steps:
```bash
# 1. Clone repository
git clone https://github.com/valen/Health-Monitoring-Software-NASA-Space-Challenge.git
cd Health-Monitoring-Software-NASA-Space-Challenge

# 2. Install dependencies
npm install

# 3. Launch flight dev server
npm run dev

# 4. Open cockpit in browser
# Visit: http://localhost:3000
```

### Production Build:
```bash
npm run build
npm run start
```

---


## 📜 6. Credits & NASA References
Refer to [CREDITS.md](CREDITS.md) and [TECHNICAL_CODE_DOCUMENTATION.md](TECHNICAL_CODE_DOCUMENTATION.md) for complete citations of NASA-STD-3001, NASA OSDR OSD-575, and CSA Bio-Monitor data.
