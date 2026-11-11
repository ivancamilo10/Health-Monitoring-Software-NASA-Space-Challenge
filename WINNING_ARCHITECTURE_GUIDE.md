# 🚀 NASA SPACE APPS CHALLENGE: WINNING ARCHITECTURE & FLIGHT CREW GUIDE
**Proyecto:** Health-Monitoring-Software-NASA-Space-Challenge  
**Misión de Hackathon:** Ganar el desafío desplegando una plataforma de triaje biomédico y soporte vital autónomo para el espacio profundo (Artemis / Mars Transit), eliminando la vulnerabilidad de la latencia de radio Tierra-Nave (4 a 44 min).

---

## 👨‍🚀 1. ORGANIGRAMA DE LA TRIPULACIÓN COMPLETA (5 INTEGRANTES)

Para ganar un hackathon de la NASA se necesita sincronía militar. Cada integrante tiene un rol crítico, sin estorbarse ni pisarse archivos:

```
                                    ┌────────────────────────────────────────────────────────┐
                                    │       CONTRATO UNIVERSAL (Single Source of Truth)      │
                                    │           /src/types/mission-health.types.ts           │
                                    └────────────────────────────────────────────────────────┘
                                            ▲                   ▲                   ▲
                  ┌─────────────────────────┴──┐     ┌──────────┴──────────────┐    └──────────────────────────────────┐
                  │      DESARROLLADOR A       │     │       DESARROLLADOR B   │     │          DESARROLLADOR C         │
                  │   (APIs, Datos & Supabase) │     │  (Lógica Biomédica & Triage)  │ (Frontend & Mission Control HUD) │
                  └────────────────────────────┘     └─────────────────────────┘     └──────────────────────────────────┘
                                 ▲                                                                     ▲
                                 │                                                                     │
              ┌──────────────────┴─────────────────────────────────────────────────────────────────────┴──────────────────┐
              │                                                                                                           │
   ┌────────────────────────────────────────┐                                                 ┌────────────────────────────────────────┐
   │          DISEÑADOR GRÁFICO             │                                                 │     FLIGHT TEST OFFICER / QA TESTER    │
   │        (UI/UX Espacial & Assets)       │                                                 │    (Validación No Técnica & Pitch)     │
   ├────────────────────────────────────────┤                                                 ├────────────────────────────────────────┤
   │ • Manual de estilo y tokens Tailwind   │                                                 │ • Pruebas de aceptación UAT sin código │
   │ • Paleta de seguridad MIL-STD-1472     │                                                 │ • Reporte estructurado de fallos       │
   │ • Insignias de misión y fotos en /assets│                                                │ • Orador del Pitch de 3 min al jurado  │
   │ • Diapositivas y Pitch Deck de apoyo   │                                                 │ • Guía: FLIGHT_TEST_MANUAL.md          │
   │ • Guía: DESIGN_SYSTEM_GUIDE.md         │                                                 │                                        │
   └────────────────────────────────────────┘                                                 └────────────────────────────────────────┘
```

---

## 🗺️ 2. MATRIZ DE RESPONSABILIDADES POR INTEGRANTE

| Integrante | Rol | Zona de Archivos | Responsabilidad Concreta | Guía de Referencia |
|---|---|---|---|---|
| **Dev A** | 📡 APIs, Datos & Cloud | `/src/app/api/v1/*`<br>`/src/repositories/*`<br>`/prisma/*` | Endpoints Next.js, transacciones con Prisma, esquema relacional en PostgreSQL/Supabase. | Este documento |
| **Dev B** | 🧬 Bio-Logic & Triage | `/src/core-logic/*` | Algoritmos fisiológicos, normalización según actividad (sueño vs. EVA), cálculo de `riskScore` y contramedidas autónomas. | Este documento |
| **Dev C** | 💻 Frontend & HUD | `/src/components/*`<br>`/src/hooks/*`<br>`/src/app/page.tsx` | Consola de vuelo interactiva, integración del hook de telemetría y botones de crisis para el pitch. | Este documento |
| **Diseñador** | 🎨 UI/UX & Arte Visual | `tailwind.config.ts`<br>`src/app/globals.css`<br>`/public/assets/*` | Paleta de colores espacial, identidad de misión (Mission Patch), avatares de la tripulación y estética de cabina NASA. | [`DESIGN_SYSTEM_GUIDE.md`](./DESIGN_SYSTEM_GUIDE.md) |
| **Tester No Dev** | 🧪 QA & Pitch Orator | Navegador (`localhost:3000`) | Probar los 4 escenarios de contingencia, verificar la interfaz, reportar fallos y recitar el pitch de 3 minutos al jurado. | [`FLIGHT_TEST_MANUAL.md`](./FLIGHT_TEST_MANUAL.md) |

---

## ⚡ 3. CÓMO TRABAJA EL EQUIPO EN PARALELO (SIN BLOQUEOS)

1. **El Diseñador Gráfico** abre [`DESIGN_SYSTEM_GUIDE.md`](./DESIGN_SYSTEM_GUIDE.md), ajusta las variables de color en `tailwind.config.ts` y coloca los gráficos e insignias en `/public/assets/`.
2. **El Desarrollador A** prueba y conecta las APIs en `/src/app/api/v1/` usando los mocks temporales ya listos en `core-logic`, sin esperar a que Dev B termine las fórmulas.
3. **El Desarrollador B** implementa las fórmulas biomédicas en `/src/core-logic/` resolviendo los `// TODO [DEV-LOGICA]:` en funciones puras sin necesidad de levantar bases de datos.
4. **El Desarrollador C** perfecciona los componentes visuales en `/src/components/mission-control/` usando el buffer de datos del hook `useMissionTelemetry`.
5. **El Tester No Técnico** levanta la aplicación con `npm run dev`, sigue la tabla de [`FLIGHT_TEST_MANUAL.md`](./FLIGHT_TEST_MANUAL.md), pulsa los botones de crisis en vivo y ensaya el guion del pitch cronometrado.

---

## 🏆 4. EL SECRETO PARA GANAR EL HACKATHON
- **El Jurado busca realismo científico:** Nuestro sistema reconoce que un pulso de 155 BPM en reposo es taquicardia severa, pero en una caminata espacial (EVA) con traje rígido puede ser estrés metabólico compensado.
- **El Jurado busca autonomía radical:** Frente a la latencia de Marte (4 a 44 minutos de radio), un médico en la Tierra no puede evitar la muerte por ebullismo ante una fisura en el traje. **Nuestro software actúa en < 200 ms**.
- **El Jurado busca impacto visual:** La combinación del diseño de cabina oscura (Diseñador) y la inyección de crisis en 1 click (Tester/Orador) genera un impacto demoledor e inolvidable.
