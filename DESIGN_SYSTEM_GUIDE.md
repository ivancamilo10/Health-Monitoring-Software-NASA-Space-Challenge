# 🎨 NASA DESIGN SYSTEM GUIDE: ERGONOMICS & INTERACTION
**Standard Compliance:** NASA-STD-3001 (Human-System Integration) & MIL-STD-1472 (Human Engineering)  
**Target:** High-stress, cognitive fatigue operational environments in deep space.

---

## 🌌 1. CHROMATIC PALETTE & VISUAL CODING

In high-stress spaceflight conditions, color choices must never be decorative; they must carry unambiguous operational meaning:

| State | Hex Code | Visual Meaning | Operational Usage |
|---|---|---|---|
| **Nominal Green** | `#10B981` | Normal / Baseline Homeostasis | Vital signs within personal L-30 range. Normal flight operations. |
| **Caution Amber** | `#F59E0B` | Watch / Statistical Variation ($Z \ge 1.4$) | Mild atypical shift. Crew self-management; re-test in next cycle. |
| **Emergency Red** | `#EF4444` | Critical Breach (NASA-STD-3001) | Direct clinical breach (e.g., suit decompression $< 4.2\text{ psi}$, $SpO2 < 88\%$). |
| **No Telemetry Gray**| `#6B7280` | Sensor Dropout (`SIN_DATOS`) | Unmonitored or disconnected channel. Never shown as green. |
| **Deep Space Black**| `#0B0C10` | Cockpit Canvas Background | Minimizes ocular fatigue and glare in darkened spacecraft cabin. |
| **Holographic Cyan** | `#38BDF8` | 3D Wireframe & Anatomy Hotspots | Secondary non-alarming contextual guidance and X-ray layer. |

---

## 🧊 2. THREE-ZONE COCKPIT ERGONOMICS

The main flight viewport enforces a **zero-scroll layout** to prevent critical telemetry occlusion:
1. **Left Bento Rail (320px fixed width):** Continuous bio-telemetry feeds and CANS neutron radiation rate.
2. **Center Hero (Dynamic flex space):** 3D WebGL Spacesuit with rotatable camera controls and anatomical hotspots.
3. **Right Contextual Drawer (Slide-out):** Progressive disclosure of clinical reasoning, HRP hazard impact, and SBAR report generation.

---

## 🔤 3. TYPOGRAPHY & LEGIBILITY STANDARDS
- **Header Font:** `Geist Sans` or `Inter`, high-contrast tracking (`tracking-tight`), uppercase mission badges.
- **Data & Telemetry Font:** Tabular numerals (`font-mono`) to prevent visual jitter when numbers change dynamically.
