# 🎨 NASA SPACE CHALLENGE: GUÍA DE DISEÑO GRÁFICO & UI/UX ESPACIAL
**Rol:** Diseñador Gráfico / Lead UI-UX Espacial  
**Objetivo:** Crear una interfaz de usuario visualmente deslumbrante, hiperrealista y con rigor estético aeroespacial (estilo consolas de cabina Orion, SpaceX Crew Dragon y Mission Control Houston) que enamore al jurado de la NASA en los primeros 10 segundos.

---

## 🛰️ 1. TU ZONA DE TRABAJO (DÓNDE TOCAS EN EL PROYECTO)

| Elemento | Ubicación en el Proyecto | Qué debes hacer |
|---|---|---|
| **Tokens y Colores** | `tailwind.config.ts` | Puedes ajustar colores, sombras luminiscentes (`glow`), bordes y fuentes. |
| **Estilos Globales & Fondos** | `src/app/globals.css` | Efectos de cuadrícula espacial (grid lines), gradientes cósmicos y animaciones de radar. |
| **Imágenes, Logos e Insignias** | `public/assets/` | Guardar el logo del equipo, insignias de la misión (Artemis Mission Patch), avatares de los astronautas y esquemas del traje espacial EMU. |
| **Maquetas / Prototipos Figma** | `docs/design/` o enlaces Figma | Prototipar y compartir flujos visuales con el Desarrollador C. |

---

## 🎨 2. PALETA DE COLORES OFICIAL DE MISIÓN (ESTÁNDAR MIL-STD-1472 / NASA)

El sistema de colores no es decorativo: **representa estados fisiológicos y de supervivencia**:

```
 🟢 flight.nominal    #10B981   Signos vitales estables, trajes herméticos, ECLSS calibrado.
 🟡 flight.caution    #F59E0B   Fatiga elevada (HRV bajo), taquicardia leve, CO2 elevado (>3 mmHg).
 🟠 flight.warning    #F97316   Falla de absorbentes, riesgo de hipotermia o hipercapnia.
 🔴 flight.emergency  #EF4444   DESCOMPRESIÓN DE TRAJE (<3.8 psi), HIPOXIA (<90% SpO2), TORMENTA SOLAR (>100 µSv/h).
 🔵 telemetry.cyan    #00E5FF   Señales eléctricas activas, datos de pulso y telemetría de vuelo.
 🌌 space.void        #03070D   Fondo negro profundo de baja fatiga visual para cabina.
 🛸 space.surface     #0A111E   Fondo de tarjetas y módulos de control.
```

### Clases Tailwind que puedes usar directamente:
- Fondos: `bg-space-void`, `bg-space-surface`, `bg-space-panel`
- Bordes: `border-space-border`, `border-flight-nominal`, `border-flight-emergency`
- Textos: `text-telemetry-cyan`, `text-flight-emergency`, `text-flight-caution`

---

## 📐 3. REGLAS DE ORO DE UI/UX PARA ENAMORAR A LOS JUECES DE LA NASA

1. **Tipografía Técnica:** Los datos numéricos críticos (BPM, SpO2, Presión en psi) siempre deben usar fuentes monoespaciadas (`font-mono` o `font-flight`). En una cabina real, los números monoespaciados evitan que la interfaz "salte" visualmente cuando los dígitos cambian rápidamente.
2. **Jerarquía Visual Inmediata:** La vista principal debe responder en menos de 3 segundos a la pregunta del Comandante: *"¿Mi tripulación está a salvo o alguien se está asfixiando?"*.
3. **Animaciones de Emergencia (HUD Glow):**
   - Cuando el estado sea `EMERGENCY`, el panel del astronauta afectado debe tener un borde pulsante rojo (`animate-pulse shadow-lg shadow-red-500/20`).
   - Los valores anómalos deben destacarse en rojo vibrante.
4. **Modo Cabina Antirreflejos (Dark Mode Only):** La interfaz debe ser estrictamente oscura para simular el ambiente de poca luz del módulo espacial y ahorrar batería en pantallas OLED de trajes EVA.

---

## 📦 4. ENTREGABLES CLAVE DEL DISEÑADOR PARA EL HACKATHON

1. **Insignia Oficial de la Misión (Mission Patch):**
   - Un parche vectorial redondo con el nombre del equipo y el lema: *"Autonomous Deep Space Medical Triage"*.
   - Ubicación recomendada: Guardar en `public/assets/mission-patch.svg` para que el Desarrollador C lo incluya en el encabezado.
2. **Fotografías / Avatares de la Tripulación:**
   - 2 a 4 imágenes en estilo astronauta NASA (pueden ser generadas por IA) para `Cmdr. Alex Vance` y `Dr. Elena Rostova`.
   - Ubicación: Guardar en `public/assets/astronauts/`.
3. **Presentación del Pitch (Diapositivas / Canva / Figma):**
   - Crear una presentación de 4 a 5 láminas con la misma paleta oscura y estética HUD de la aplicación para que la demo fluya con total coherencia visual.
