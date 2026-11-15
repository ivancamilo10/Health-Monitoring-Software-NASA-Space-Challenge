# 🚀 Mins-Health — by Mins Solutions TI
### Autonomous Deep Space Clinical Monitoring & Triage Platform
**NASA Space Apps Challenge 2026** &bull; Global Theme: *The Next Frontier*  
**Challenge:** *"Create Health Monitoring Software for Astronauts on Space Missions"*

---

## 🎯 1. Resumen Ejecutivo y Problema Abordado

En misiones de exploración hacia el espacio profundo (Artemis Gateway, Base Lunar y Tránsito a Marte), la tripulación se enfrenta a los **5 Peligros del Vuelo Espacial Humano (HRP)**:
1. Radiación espacial ionizante (GCR y eventos solares SPE).
2. Aislamiento y confinamiento prolongado.
3. Distancia extrema a la Tierra (hasta 400 millones de km).
4. Gravedad alterada (microgravedad 0g, 1/6g lunar, 3/8g marciana).
5. Entornos cerrados y hostiles con soporte vital artificial (ECLSS).

### La "Trampa de la Latencia" en Marte:
Entre la Tierra y Marte, las señales de radio tardan entre **4 y 24 minutos** en cada sentido de transmisión (hasta **48 minutos de retraso bidireccional**). La telemedicina convencional terrestre es físicamente inviable ante descompensaciones agudas. Los astronautas deben ser capaces de **evaluarse, entender sus riesgos y actuar con autonomía**.

**Mins-Health** resuelve este desafío combinando:
- **Línea Base Personalizada L-30:** No utilizamos rangos clínicos fijos terrestres; cada astronauta es su propio control estadístico.
- **Motor de Interacción de Peligros HRP:** Cuando múltiples biomarcadores se alteran, el sistema no emite seis alarmas caóticas, sino **UNA sola alerta de patrón sinérgico** ("Por qué juntos importan más").
- **Paquete de Traspaso SBAR con Checksum:** Generación automática de informes clínicos en formato estándar SBAR (Situation, Background, Assessment, Recommendation) sellados con checksum criptográfico, listos para exportar en JSON y PDF.
- **Test de Vigilancia Psicomotora (NASA PVT):** Medición de tiempo de reacción a estímulos visuales para detectar lapsos y fatiga cognitiva antes de maniobras críticas o caminatas extravehiculares (EVA).
- **Operación 100% Offline (Local First):** La cabina corre íntegramente en el navegador con persistencia en `localStorage`, sin depender de servidores terrestres ni de modelos opacos.

---

## 🧭 2. Estructura del Proyecto por Responsabilidades

El proyecto está diseñado de forma modular para mantenimiento enterprise:

```
src/
├── app/
│   ├── layout.tsx                # Metadata oficial y configuración Mins-Health
│   ├── page.tsx                  # Cabina de 3 zonas fijas (sin scroll en vista principal)
│   ├── globals.css               # Sistema visual neutro oscuro y tipografía accesible
│   └── api/v1/                   # Endpoints REST de telemetría y simulación
├── components/nasa/
│   ├── HeaderBar.tsx             # Marca Mins-Health, selector de misión y barra de utilidades
│   ├── BentoTelemetryRail.tsx    # Riel izquierdo: Bento Grid con 6 indicadores + radiación CANS
│   ├── AstronautGLBViewer.tsx    # Centro Héroe: Astronauta 3D (.glb) con capa Rayos X y hotspots
│   ├── IndicatorDetailDrawer.tsx # Panel lateral: divulgación progresiva, preguntas HRP y SBAR
│   ├── CheckupWizardModal.tsx    # Asistente modal de telemetría diaria paso a paso
│   ├── DemoScenariosModal.tsx    # Inyección de contingencias para el jurado (Pitch 3 min)
│   ├── PsychomotorVigilanceModal.tsx # Test de vigilancia psicomotora (NASA PVT)
│   ├── NasaOsdrReferenceModal.tsx# Datos reales abiertos de NASA OSDR (OSD-575 / Mayo 2024)
│   ├── ScientificEvidenceModal.tsx# Clasificación de umbrales clínicos y "Qué hace y qué no hace"
│   └── GuidedPitchDemoModal.tsx  # Reproductor guiado del guion de presentación para el jurado
├── core/
│   ├── rules.ts                  # Motor de inferencia (Separación estadística vs umbral clínico)
│   ├── baseline.ts               # Cálculo de línea base personal L-30 (media, desviación típica)
│   ├── hazard-interactions.ts    # Grafo causal de interacción entre los 5 peligros HRP
│   ├── missions.ts               # Configuración física de ISS, Luna y Marte
│   └── sbar-handover.ts          # Generador de reportes clínicos SBAR con firma CRC32
├── data/
│   └── indicators.ts             # Base de datos de los 7 biomarcadores con los 4 campos HRP
└── store/
    └── health-store.ts           # Estado global offline-first con Zustand y persistencia
```

---

## 🔬 3. Validez Científica y Rigor Metodológico

### Separación entre Estadística y Clínica:
- **Desviación de Línea Base Personal ($|Z\text{-score}| \ge 1.4\text{ a }2.5$):** Emite como **MÁXIMO** el estado `"Vigilar"` o `"Atención"`.
- **Umbral Clínico Absoluto (NASA-STD-3001 con fuente citada):** Es el **ÚNICO** mecanismo que puede emitir `"Escalar a Tierra"`. Una glucemia de $115\text{ mg/dL}$ jamás escalará erróneamente a tierra.

### Dosimetría de Radiación Normalizada:
- Se compara la tasa diaria contra la tasa típica del entorno:
  - **ISS (LEO):** $\sim 730\ \mu\text{Sv/día}$. Una tasa inferior a este límite es nominal y jamás se marca como emergencia.
  - **Luna:** $\sim 1200\ \mu\text{Sv/día}$.
  - **Marte:** $\sim 1800\ \mu\text{Sv/día}$.
- Seguimiento visual del **Límite de Carrera de Radiación de la NASA (600 mSv)**.

### Lenguaje Consultivo y Asistencial:
Sin órdenes militares ni imperativas. Todas las contramedidas son recomendaciones no farmacológicas (sin dosis de fármacos ni diagnósticos definitivos).

---

## ⚡ 4. Cómo Correr la Plataforma Localmente

### Requisitos:
- Node.js 18+ o 20+ (probado en Node v24 LTS).
- Navegador web moderno (Chrome, Edge, Firefox, Safari).

### Pasos:
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/Health-Monitoring-Software-NASA-Space-Challenge.git
cd Health-Monitoring-Software-NASA-Space-Challenge

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# Visita: http://localhost:3000
```

### Compilación para Producción (Verificación de Cero Errores):
```bash
npm run build
npm run start
```

---

## 🎤 5. Guion de Demostración en 3 Minutos para el Jurado de la NASA

Dentro de la aplicación, presiona el botón **"Guion Demo (3m)"** para abrir el asistente con subtítulos y avance automático:

1. **Minuto 0:00 - 0:35:** *Apertura:* Presentar a Mins-Health y el estado inicial tranquilo (casi todo en Habitual y sueño en 6.4h en Vigilar).
2. **Minuto 0:35 - 1:15:** *Aislamiento Prolongado:* Mostrar la sinergia de peligros cuando el sueño cae a 3.8h y el ánimo a 2/5 (alerta de patrón sistémico unificado).
3. **Minuto 1:15 - 2:00:** *Tormenta Solar (SPE):* Inyectar radiación a 2800 µSv/día, activar la **Capa Rayos X** en el astronauta 3D para ver órganos internos y la recomendación consultiva de refugio.
4. **Minuto 2:00 - 2:35:** *Autonomía & Traspaso SBAR:* Generar y descargar el paquete clínico SBAR con checksum criptográfico para Houston.
5. **Minuto 2:35 - 3:00:** *Demostración Offline & Cierre:* Desconectar la red o mostrar el funcionamiento continuo local-first sin depender de internet ni de LLMs.

---

## 📄 6. Créditos y Licencia
- **Desarrollado por:** Mins Solutions TI para el NASA Space Apps Challenge 2026.
- **Licencia:** Código abierto bajo [MIT License](./LICENSE).
- **Atribuciones y Fuentes Científicas:** Consultar [CREDITS.md](./CREDITS.md).
