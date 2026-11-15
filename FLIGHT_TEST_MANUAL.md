# 🧪 NASA SPACE CHALLENGE: FLIGHT TEST MANUAL & PITCH SCRIPT
**Role:** Flight Test Officer & Presentation Lead (QA Lead & Pitch Speaker)  
**Mission:** Ensure software flight readiness, validate user acceptance criteria, and execute a flawless live demonstration for NASA judges.

---

## 🚀 1. HOW TO TEST THE PLATFORM (ZERO CODING REQUIRED)

### Step 1: Launch the Cockpit
Run in your terminal:
```bash
npm run dev
```

### Step 2: Open Mission Control
Open your web browser (Chrome, Edge, Firefox, Safari) and navigate to:
👉 `http://localhost:3000`

You will see the **"Autonomous Bio-Telemetry & Triage Platform"** running live with Artemis mission data.

---

## 📋 2. FLIGHT ACCEPTANCE TESTING MATRIX (UAT)

Test each of the 4 contingency buttons located in the **"NASA JUDGES DEMO SUITE: CONTINGENCY INJECTION"** modal and verify that the screen responds as specified:

| Button Pressed | Contingency Simulated | Expected Cockpit Behavior | Status |
|---|---|---|:---:|
| **🟢 RESTORE NOMINAL** | Crew in homeostatic equilibrium. | • Top banner turns **GREEN** ("NOMINAL OPERATIONAL STATUS").<br>• Risk Score low (10 - 25%).<br>• Heart rate nominal (~66 BPM), SpO2 > 98%.<br>• Cabin pressure at 14.7 psi. | [ ] |
| **⚠️ SUIT LEAK (EVA)** | Micrometeoroid punctures spacesuit during spacewalk. | • Top banner flashes **RED** ("EMERGENCY // AUTONOMOUS TRIAGE ACTIVATED").<br>• Commander card pulses red with Risk Score > 85%.<br>• Suit pressure drops to 3.2 psi, heart rate spikes to 154 BPM.<br>• Autonomous advisory: *"Emergency auxiliary repressurization to 4.2 psi activated"*. | [ ] |
| **☣️ CO2 TOXICITY** | ECLSS chemical scrubber failure. | • Banner turns **AMBER** ("WARNING // ENVIRONMENTAL ALERT").<br>• ECLSS panel flags ppCO2 at 7.8 mmHg in alert color.<br>• Protocol triggered: *"Forced ventilation and redundant LiOH scrubbers activated"*. | [ ] |
| **☢️ SOLAR STORM (SPE)** | Cosmic particle surge in deep space. | • Radiation rate surges to 2800 µSv/day in emergency red/magenta.<br>• Protocol directs immediate crew relocation to the water-shielded *Storm Shelter*. | [ ] |

---

## 🐞 3. BUG REPORT TEMPLATE FOR DEVELOPERS

If any test case fails, copy and paste this standard template into the team channel:

```markdown
🚨 FLIGHT DEFECT REPORT:
1. Action Triggered: (e.g., Clicked "SUIT LEAK")
2. Observed Behavior: (e.g., Button locked and screen stayed green)
3. Expected Behavior: (e.g., Immediate red flash and EVA-ABORT emergency card)
4. Browser & OS: (Chrome on Windows 11)
```

---

## 🎤 4. MASTER 3-MINUTE PITCH SCRIPT (WINNING THE HACKATHON)

Use this precise delivery structure to captivate NASA evaluators:

### ⏱️ Minute 0:00 - 0:45: THE PROBLEM (The "Latency Trap")
> *"Good morning, esteemed NASA judges. Aboard the International Space Station in Low Earth Orbit, if an astronaut experiences an arrhythmia or a spacesuit pressure drop, a flight surgeon in Houston assists in less than two seconds.*  
> *However, during a transit mission to Mars or a deep sortie to the lunar South Pole, radio signals take between **4 and 24 minutes** to reach Earth, and another 24 minutes to return.*  
> *In acute decompression, hypoxia, or cardiac arrest, **48 minutes is fatal**. Conventional terrestrial telemedicine is useless in deep space."*

### ⏱️ Minute 0:45 - 1:45: THE LIVE DEMO (The "WOW" Factor)
*(Show live cockpit on projector in nominal GREEN state).*
> *"We present Mins-Health: our Autonomous Onboard Bio-Telemetry and Clinical Triage Cockpit.*  
> *Observe the screen: Commander Alex Vance is on a nominal spacewalk... but imagine a micrometeoroid punctures his suit glove."*  
> *(TRIGGER LIVE BUTTON: **"⚠️ SUIT LEAK (EVA)"**).*  
> *(The screen instantly flashes red).*  
> *"In less than **200 milliseconds**, with zero connection to Houston, our onboard decision engine detected hypobaric decompression at 3.2 psi, recognized autonomic hypoxia, initiated emergency auxiliary O2 pressurization, and routed the astronaut back to the airlock well before the 45-second hypoxia threshold."*

### ⏱️ Minute 1:45 - 2:30: FLIGHT ARCHITECTURE & SCIENTIFIC RIGOR
> *"Behind this cockpit lies an aerospace-grade architecture:*  
> *1. **Personalized L-30 Baseline:** We don't use generic terrestrial normal ranges; each astronaut is their own statistical control.*  
> *2. **HRP Multi-Hazard Synergy Engine:** Rather than panicking the crew with six alarm bells, we unify anomalies into ONE root-cause diagnostic pattern.*  
> *3. **Cryptographic SBAR Handover:** Generates loss-free medical handover packets with CRC32 checksums for delayed deep space transmission."*

### ⏱️ Minute 2:30 - 3:00: IMPACT & CLOSING
> *"With Mins-Health, the Artemis crew and the first human voyagers to Mars will never travel alone: they carry an autonomous flight surgeon and life-support engineer on duty every millisecond of their journey. Thank you."*
