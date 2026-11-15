# 🚀 NASA SPACE APPS CHALLENGE 2026 — OFFICIAL SUBMISSION PACKAGE
**Project:** Mins-Health: Autonomous Deep Space Clinical Monitoring & Triage Platform  
**Team:** Mins Solutions TI (Colombia 🇨🇴)  
**Team Members:**
- **Ivan Mejia Triana** (`@ivanmejia1082`) — *Team Owner / Project Lead*
- **Giordi Gutiérrez Villegas** (`@giordigutierrez1`) — *Biomedical Systems & Clinical Logic*
- **Camilo Canedo** (`@camilote777`) — *Full-Stack & Telemetry Systems*
- **Samuel Buzón** (`@samuel.buzon`) — *3D Visualization & UX Architecture*
- **Ali Riascos** (`@aliii___`) — *Scientific Research & Quality Assurance*
**Global Theme:** *The Next Frontier*  
**Challenge:** *Create Health Monitoring Software for Astronauts on Space Missions*  

---

## 📌 TABLE OF CONTENTS
1. [Official NASA Submission Form (English Texts)](#1-official-nasa-submission-form-english-texts)
2. [7-Slide Presentation Deck (100% English — Copy & Paste)](#2-7-slide-presentation-deck-100-english--copy--paste)
3. [30-Second Video Demo Script & Screen Direction](#3-30-second-video-demo-script--screen-direction)
4. [NASA Resources, Standards & Open Data Citations](#4-nasa-resources-standards--open-data-citations)
5. [Evaluation Criteria Self-Assessment Matrix](#5-evaluation-criteria-self-assessment-matrix)
6. [Pre-Submission Checklist (Avoiding Disqualification)](#6-pre-submission-checklist-avoiding-disqualification)

---

## 1. OFFICIAL NASA SUBMISSION FORM (ENGLISH TEXTS)

Use these exact fields to fill out your project page on the official NASA Space Apps Challenge portal:

### 1.1 Project Title
```text
Mins-Health: Autonomous Deep Space Clinical Monitoring & Triage Platform
```

### 1.2 High-Level Summary (Elevator Pitch - Max 500 characters)
```text
Mins-Health is an offline-first, autonomous clinical triage and bio-telemetry cockpit built for deep-space exploration (Artemis Gateway & Mars transit). By eliminating the lethal 44-minute Earth latency gap, it empowers crews to self-assess against personalized L-30 baselines, detect complex HRP hazard synergies, assess cognitive psychomotor vigilance (NASA PVT), and generate cryptographically verified SBAR medical handover packets for Earth ground control.
```

### 1.3 Detailed Project Description
```markdown
### 🎯 The Challenge: The Deep Space Latency Trap
In Low Earth Orbit (LEO) aboard the International Space Station, astronaut medical anomalies are managed in near-real-time by Houston flight surgeons (~2 second signal delay). However, during deep-space exploration—such as lunar South Pole sorties and 3-year round-trip Mars transit missions—communication latency ranges between 4 to 24 minutes each way (up to 48 minutes round-trip). In acute events like suit decompression, toxic atmospheric buildup, or acute solar particle events (SPE), a 44-minute delay is catastrophic. Crew members must operate with complete medical autonomy.

### 💡 The Solution: Mins-Health
Developed by Mins Solutions TI, Mins-Health is an autonomous, local-first medical biotelemetry and clinical decision-support platform designed specifically for long-duration spaceflight.

Key pillars of our platform include:
1. **Personalized L-30 Baseline:** Traditional terrestrial medical software relies on generic static ranges (e.g., standard resting heart rates). In microgravity, cephalad fluid shifts and cardiovascular deconditioning alter baseline physiology. Mins-Health computes individual pre-flight baseline standard deviations (Z-score tracking), making each astronaut their own control.
2. **HRP Hazard Synergy Engine:** Rather than triggering six chaotic, isolated alarms during a crisis, our causal inference engine maps the 5 Human Research Program (HRP) hazards into a unified root-cause pattern alert, drastically minimizing alarm fatigue in high-stress environments.
3. **NASA-STD-3001 Clinical Guardrails:** We enforce a strict separation between statistical variation and clinical emergencies. While Z-score shifts trigger non-invasive "Watch/Caution" states, only verified NASA-STD-3001 clinical thresholds can escalate to critical action.
4. **NASA Psychomotor Vigilance Task (PVT):** An integrated visual reaction test measuring cognitive vigilance and reaction latency, detecting micro-sleeps and cognitive fatigue before high-risk extravehicular activities (EVA).
5. **Standardized SBAR Handover with Checksum:** When Earth communication is re-established, the platform compiles clinical events into a standard SBAR (Situation, Background, Assessment, Recommendation) packet signed with an atomic CRC32/SHA-256 checksum for loss-free downlink transmission.
6. **Zero-Cloud, Local-First Architecture:** The entire platform operates in-browser without external server dependencies, guaranteeing instantaneous (<200 ms) response times even in deep space.
```

### 1.4 How We Addressed the Challenge
```markdown
We engineered a production-ready, interactive web cockpit featuring three fixed zones:
- An environmental and physiological Bento telemetry rail.
- An interactive 3D astronaut viewer with anatomical hazard hotspots and an internal X-ray layer.
- A progressive disclosure clinical drawer providing non-pharmacological, crew-safe countermeasures.

The solution was validated against real flight data from the NASA Open Science Data Repository (OSDR OSD-575) and subjected to automated visual regression and mission contingency injection tests (Suit Decompression, CO2 Scrubbing Failure, and SPE Solar Particle Events).
```

### 1.5 Space Agency Data & Resources Used
- **NASA Open Science Data Repository (OSDR):** Dataset OSD-575 (Inspiration4 human spaceflight chemistry and hematology datasets).
- **NASA Human Research Program (HRP):** The 5 Hazards of Human Spaceflight framework & HRP Standard Measures.
- **NASA Technical Standard:** NASA-STD-3001 (Space Flight Human-System Standard).
- **Canadian Space Agency (CSA):** Bio-Monitor continuous physiological monitoring system & Canadian Active Neutron Spectrometer (CANS).
- **NOAA Space Weather Prediction Center:** May 2024 Solar Particle Event proton flux baseline data.
- **NASA 3D Resources:** Public domain extravehicular activity suit 3D mesh.

---

## 2. 7-SLIDE PRESENTATION DECK (100% ENGLISH — COPY & PASTE)

> **Format Rules:** Exactly 7 slides (including cover and conclusion). Fully in English. Suitable for Canva, Google Slides, Keynote, or PowerPoint.

---

### 🖼️ SLIDE 1: Title & Team Identity (Cover)
* **Title:** **Mins-Health**
* **Subtitle:** *Autonomous Deep Space Clinical Monitoring & Triage Platform*
* **Competition:** NASA Space Apps Challenge 2026 • *The Next Frontier*
* **Challenge:** Create Health Monitoring Software for Astronauts on Space Missions
* **Team:** Mins Solutions TI (Colombia 🇨🇴)
* **Crew / Authors:**
  - **Ivan Mejia Triana** (`@ivanmejia1082`) — *Team Owner & Lead Architect*
  - **Giordi Gutiérrez Villegas** (`@giordigutierrez1`) — *Biomedical Systems & Clinical Logic*
  - **Camilo Canedo** (`@camilote777`) — *Full-Stack Developer & Telemetry*
  - **Samuel Buzón** (`@samuel.buzon`) — *3D Visualization & Interaction Design*
  - **Ali Riascos** (`@aliii___`) — *Scientific Evidence & Mission QA*
* **Key Visuals:** Mins-Health emblem, NASA Space Apps logo, and the 3D Astronaut Hero render (`public/assets/astronaut-hero.png`).
* **Footer:** *Open Source • MIT License • Production-Ready Flight Architecture*

---

### 🖼️ SLIDE 2: The Deep Space Latency Trap (Relevance)
* **Slide Header:** `MISSION REALITY // THE DEEP SPACE LATENCY TRAP`
* **Main Headline:** *Why Conventional Telemedicine Fails Beyond Low Earth Orbit*
* **Key Bullet Points:**
  - **The ISS Paradox:** In Low Earth Orbit, flight surgeons in Houston guide astronauts with an imperceptible 2-second delay.
  - **The Deep Space Barrier:** On Mars transit missions (up to 400M km), radio signals take **4 to 24 minutes one-way**—reaching a **48-minute round-trip delay**.
  - **The Cost of Waiting:** In hypobaric decompression, arrhythmias, or toxic CO2 accumulation, **44 minutes is fatal**.
  - **The Need:** Complete crew medical self-reliance and deterministic on-board decision intelligence.
* **Key Graphic / Callout:**
  - `[Earth Ground Station]` $\xrightarrow{\text{4 to 24 min latency}}$ `[Deep Space Vessel]`
  - Box: *"Autonomy is not a luxury; it is a life-support requirement."*
* **Speaker Notes:**
  *"Good morning judges. If an astronaut on the ISS has an arrhythmia, Houston intervenes immediately. But on the way to Mars, radio signals take up to 48 minutes round-trip. When pressure drops or hypoxia strikes, waiting for Earth is fatal. Mins-Health bridges this gap."*

---

### 🖼️ SLIDE 3: The Synergy Risk Engine (Creativity)
* **Slide Header:** `INNOVATION // MULTI-HAZARD SYNERGY ENGINE`
* **Main Headline:** *From Chaotic Alarms to Unified Root-Cause Intelligence*
* **Core Innovations:**
  1. **Personalized L-30 Baseline:** Replaces rigid terrestrial static normals with individual 30-day pre-flight baseline tracking ($|Z\text{-score}| \ge 1.4\sigma$). Astronauts serve as their own clinical reference.
  2. **HRP 5-Hazard Causal Graph:** Correlates Radiation, Isolation, Distance, Gravity, and Hostile Environment telemetry.
  3. **No Alarm Fatigue:** When multiple biomarkers shift during an anomaly, Mins-Health suppresses fragmented alerts and generates **ONE unified systemic pattern diagnosis** explaining *"Why they matter together"*.
  4. **Integrated NASA PVT:** In-cockpit Psychomotor Vigilance Task measuring visual reaction times to detect cognitive fatigue before critical EVAs.
* **Key Graphic:** Diagram showing 6 divergent biomarkers converging into a single actionable card: *"SPE Solar Particle Event // Synergistic Triage Activated"*.
* **Speaker Notes:**
  *"Traditional monitors trigger six alarm bells at once, inducing panic. Our synergy engine identifies how altered gravity and radiation combine, outputting a single, calm, context-aware operational recommendation."*

---

### 🖼️ SLIDE 4: Scientific Validity & Medical Rigor (Validity)
* **Slide Header:** `EVIDENCE-BASED // NASA CLINICAL STANDARDS`
* **Main Headline:** *Grounded in NASA Standards and Open Spaceflight Data*
* **Scientific Pillars:**
  - **Statistical vs. Clinical Decoupling:** Statistical anomalies ($Z \ge 1.4$) only elevate to *"Caution / Watch"*. Only verified **NASA-STD-3001** thresholds can escalate to *"Critical Action"*. No false emergencies.
  - **Environmental Dosimetry Normalization:**
    - ISS (LEO): Baseline $730\,\mu\text{Sv/day}$
    - Lunar Surface: Baseline $1200\,\mu\text{Sv/day}$
    - Mars Transit: Baseline $1800\,\mu\text{Sv/day}$
    - Real-time tracking against NASA’s **600 mSv career radiation limit**.
  - **Validated with NASA OSDR OSD-575:** Calibrated using real human spaceflight hematology and metabolic data from commercial missions.
  - **Cryptographic SBAR Handover:** Automatically synthesizes standard Situation-Background-Assessment-Recommendation clinical packets with atomic CRC32 checksums for delayed Earth downlink.
* **Key Graphic:** Dosimetry comparison table + screenshot of the Scientific Evidence Modal (`ScientificEvidenceModal.tsx`).
* **Speaker Notes:**
  *"Our platform is scientifically rigorous. We separate statistical noise from real medical danger using NASA-STD-3001 criteria, and normalize radiation dosimeters by mission environment."*

---

### 🖼️ SLIDE 5: Live Operational Cockpit (Demonstration)
* **Slide Header:** `FLIGHT INTERFACE // 3D TRIAGE & CONTINGENCY ENGINE`
* **Main Headline:** *Zero-Scroll, Ergonomic Cockpit Built for High-Stress Operations*
* **3-Zone Ergonomics:**
  - **Zone 1: Bento Telemetry Rail:** 6 core physiological vitals + CANS active radiation dosimetry.
  - **Zone 2: 3D Interactive Hero:** Real-time 3D astronaut avatar with X-ray internal organ toggle and anatomical hazard hotspots.
  - **Zone 3: Contextual Action Drawer:** Progressive medical disclosure with step-by-step non-pharmacological countermeasures.
* **Stress-Tested Contingency Scenarios:**
  - 🟢 *Nominal Cruise* (Stable baselines)
  - ⚠️ *Suit Decompression / EVA Micro-puncture* (Prompt hypoxia mitigation)
  - ☣️ *CO2 Scrubber Toxic Saturation* (ECLSS life support failover)
  - ☢️ *Extreme SPE Solar Storm* (Storm shelter shielding protocol)
* **Key Visuals:** 2 high-res cockpit screenshots (`tests/screenshots/cockpit_Desktop_HD__1920x1080_.png` and `tests/screenshots/checkup_wizard_Desktop_HD__1920x1080_.png`).
* **Speaker Notes:**
  *"Here is the live cockpit. It features an ergonomic 3-zone layout with an interactive 3D astronaut avatar. With one click, we can simulate an EVA suit puncture: in less than 200 milliseconds, the system calculates decompression rates and guides emergency repressurization."*

---

### 🖼️ SLIDE 6: Mission Impact & Human Survivability (Impact)
* **Slide Header:** `OPERATIONAL IMPACT // PROTECTING CREW HEALTH`
* **Main Headline:** *Enabling Deep Space Exploration & Earth Dual-Use Resilience*
* **Deep Space Benefits:**
  - **Zero-Latency Intervention:** Reduces emergency response from 48 minutes to **<200 milliseconds**.
  - **Psychological Peace of Mind:** Reduces cognitive exhaustion and medical anxiety in isolated crews.
  - **Downlink Bandwidth Optimization:** Compact SBAR packets consume $<5\text{ KB}$, ideal for constrained Deep Space Network (DSN) windows.
* **Earth Dual-Use Applications:**
  - Polar research stations (Antarctica).
  - Submarines and deep-sea exploration vessels.
  - Remote rural clinics and disaster emergency triage zones with zero internet connectivity.
* **Key Graphic:** Comparison chart: *48-Minute Earth Telemedicine Delay* vs. *Mins-Health 200 ms Autonomous Response*.
* **Speaker Notes:**
  *"Mins-Health turns deep space missions into survivable journeys. Furthermore, its 100% offline-first architecture allows immediate deployment in Antarctic stations, submarines, and disaster zones on Earth."*

---

### 🖼️ SLIDE 7: Flight Readiness, Stack & Conclusion (Summary)
* **Slide Header:** `ROADMAP // THE NEXT FRONTIER IN SPACE HEALTH`
* **Main Headline:** *Engineered for Flight, Ready for Deployment*
* **Technical Stack:** Next.js 15 App Router • React 19 • TypeScript • Three.js WebGL • Tailwind CSS • Zustand Local-First Store.
* **Future Milestones:**
  1. Direct hardware telemetry integration with CSA Bio-Monitor smart garments.
  2. ECLSS hardware bus direct binding for Gateway and Lunar Base modules.
  3. Automated machine learning adaptation for long-term multi-year missions.
* **Closing Vision:**
  > *"With Mins-Health, the Artemis generation and the first voyagers to Mars will never travel alone. They carry an autonomous flight surgeon at their fingertips."*
* **Access Links:**
  - GitHub: `github.com/valen/Health-Monitoring-Software-NASA-Space-Challenge`
  - Live Demo Cockpit: `[Your Deployment URL or Localhost]`
* **Speaker Notes:**
  *"Mins-Health is open-source, fully tested, and built with modern flight-grade technologies. Thank you, judges. We are now ready for questions."*

---

## 3. 30-SECOND VIDEO DEMO SCRIPT & SCREEN DIRECTION

> If choosing the **30-Second Video Format**, here is the exact second-by-second breakdown:

| Time | Visual / Screen Action | Voiceover (Spanish) | English On-Screen Subtitle |
|:---:|:---|:---|:---|
| **00:00 - 00:05** | Fade-in from black. 3D Earth slowly shrinking, Mars approaching. Displaying text: `EARTH LATENCY: 44 MIN`. Transition to Mins-Health nominal cockpit. | *"En el espacio profundo, un mensaje a la Tierra tarda 44 minutos. Ante una emergencia médica, esperar es fatal."* | *In deep space, communication with Earth takes 44 minutes. In a medical emergency, waiting is fatal.* |
| **00:05 - 00:12** | Click on **"⚠️ FUGA DE TRAJE (EVA)"** in demo modal. Screen flashes red, suit pressure drops to 3.2 psi, heart rate spikes to 154 BPM, 3D suit highlights torso. | *"Mins-Health responde en menos de 200 milisegundos con triaje clínico autónomo a bordo."* | *Mins-Health responds in under 200 milliseconds with onboard autonomous clinical triage.* |
| **00:12 - 00:19** | Quick pan through Bento Rail: L-30 Personal Baseline Z-scores, NASA PVT reaction test, and CANS radiation dosimetry. | *"Compara biomarcadores contra la línea base personal del astronauta y detecta fatiga cognitiva."* | *Evaluates vitals against personalized L-30 baselines and detects cognitive fatigue with NASA PVT.* |
| **00:19 - 00:25** | Right drawer opens: SBAR Handover packet generated with CRC32 checksum, export to PDF button highlighted. | *"Genera reportes clínicos estandarizados SBAR con verificación criptográfica para Houston."* | *Generates standardized SBAR clinical handover packets with cryptographic verification for Houston.* |
| **00:25 - 00:30** | Hero shot of 3D Astronaut rotating with glowing telemetry wireframe. Mins Solutions TI logo + GitHub link. | *"Mins-Health: medicina autónoma para la próxima frontera de la humanidad."* | *Mins-Health: Autonomous medicine for humanity's next frontier.* |

---

## 4. NASA RESOURCES, STANDARDS & OPEN DATA CITATIONS

Highlight these in your bibliography, repository credits, and submission forms:
1. **NASA Human Research Program (HRP):**
   - *5 Hazards of Human Spaceflight* (Space Radiation, Isolation/Confinement, Distance from Earth, Gravity Fields, Hostile Closed Environments).
   - *HRP Standard Measures Cross-Cutting Protocol*.
2. **NASA Technical Standard:**
   - *NASA-STD-3001 Volume 1 & Volume 2:* Space Flight Human-System Standard (Crew Health and Medical Care).
3. **NASA Open Science Data Repository (OSDR):**
   - *Dataset OSD-575:* Commercial Spaceflight Multi-Omics and Longitudinal Physiological Biomarkers (Inspiration4 Mission).
4. **Canadian Space Agency (CSA):**
   - *Bio-Monitor System:* Operational bio-telemetry garment on the ISS.
   - *Canadian Active Neutron Spectrometer (CANS):* Intravehicular neutron radiation dosimetry.
5. **NOAA Space Weather Prediction Center:**
   - Extreme Solar Proton Flux Event records (May 2024 Solar Cycle 25 records).

---

## 5. EVALUATION CRITERIA SELF-ASSESSMENT MATRIX

| Evaluation Criterion | Why Mins-Health Achieves Maximum Score |
|:---|:---|
| **🌍 Impact** | Solves the single most critical physical barrier in deep space human survival: medical latency. Reduces critical intervention response time from 48 minutes to $<200\text{ ms}$, ensuring astronaut survivability on Moon and Mars missions. |
| **💡 Creativity** | Pioneers the **HRP Synergy Hazard Engine** and **L-30 Individual Baseline**, eliminating false alarms caused by static terrestrial ranges and providing unified root-cause intelligence rather than alarm fatigue. |
| **✅ Validity** | Grounded in authentic **NASA-STD-3001** standards, validated with real human spaceflight data from **NASA OSDR OSD-575**, dosimetrically normalized, and tested through automated UI and visual regression suites. |
| **🪐 Relevance** | Directly targets the challenge prompt *"Create Health Monitoring Software for Astronauts on Space Missions"* within the global theme *"The Next Frontier"*, explicitly addressing the Artemis Gateway and Mars Transit architecture. |
| **🎤 Presentation** | Features an ergonomic, zero-scroll 3-zone cockpit, interactive 3D WebGL astronaut visualization, clear non-jargon medical guidance, and ready-to-run pitch scripts. |

---

## 6. PRE-SUBMISSION CHECKLIST (AVOIDING DISQUALIFICATION)

- [ ] **Public External Link:** The slide deck or video link (Google Drive, YouTube, OneDrive, or Dropbox) is configured to **"Public / Anyone with the link can view"**.
- [ ] **Strict Language Compliance:**
  - All 7 slides are **100% in English**.
  - All submission text fields are **in English**.
  - If a video is submitted in Spanish, **English subtitles are embedded or hardcoded**.
- [ ] **Strict Length Limits:**
  - Slide format: **Maximum 7 slides** (including cover and references).
  - Video format: **Maximum 30.0 seconds** (not 31 seconds).
- [ ] **Repository Accessible:** The GitHub repository is set to **Public** with clear installation and testing instructions in the `README.md`.
