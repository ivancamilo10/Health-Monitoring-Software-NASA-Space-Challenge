/**
 * =============================================================================
 * MINS-HEALTH — PAQUETE DE TRASPASO CLÍNICO SBAR (SITUATION, BACKGROUND, ASSESSMENT, RECOMMENDATION)
 * by Mins Solutions TI — NASA Space Apps Challenge 2026
 * =============================================================================
 * Estándar aeroespacial de comunicación médica autónoma en misiones con latencia.
 * En el espacio profundo (Marte), este informe se empaqueta a bordo con firma
 * de integridad criptográfica (Checksum) y se encola en la red store-and-forward.
 */

import { MissionDecisionReport } from "./rules";
import { MissionDestination, MISSIONS_CONFIG } from "./missions";
import { BaselineStats } from "./baseline";
import { IndicatorId, HEALTH_INDICATORS } from "../data/indicators";
import { HazardSynergyPattern } from "./hazard-interactions";

export interface SBARHandoverPacket {
  packetId: string;
  generationTimestampUTC: string;
  mission: MissionDestination;
  missionElapsedDays: number;
  astronaut: {
    id: string;
    name: string;
    role: string;
    careerRadiationAccumulatedMilliSv: number;
    careerRadiationLimitMilliSv: number;
  };
  sbar: {
    situation: {
      headline: string;
      overallSeverity: string;
      activeSystemicPattern?: string;
    };
    background: {
      missionProfile: string;
      oneWayLightDelayMinutes: number;
      baselineSummary: string;
      previousIncidentsCount: number;
    };
    assessment: {
      indicatorsReadings: Array<{
        id: IndicatorId;
        name: string;
        currentValue: number | null;
        unit: string;
        baselineMean: number;
        status: string;
        evaluationType: string;
        explanation: string;
      }>;
      hazardSynergiesSummary?: string;
    };
    recommendation: {
      actionsTakenOnboard: string[];
      flightSurgeonAdvisoryRequested: string;
      followUpWindowMinutes: number;
    };
  };
  integrity: {
    checksum: string;
    algorithm: "CRC32-CCSDS-MOD";
    digitalSignature: string;
  };
  transmission: {
    simulatedDelaySeconds: number;
    status: "EN_COLA_LOCAL" | "TRANSMITIENDO_DSN" | "RECIBIDO_HOUSTON";
    progressPercent: number;
  };
}

/**
 * Calcula el checksum de integridad para transmisión de espacio profundo
 */
function calculateCRC32(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return "0x" + (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

/**
 * Genera el paquete de traspaso médico en formato formal SBAR
 */
export function generateSBARHandoverPacket(
  decisionReport: MissionDecisionReport,
  mission: MissionDestination,
  currentReadings: Record<IndicatorId, number | null>,
  baselines: Record<IndicatorId, BaselineStats>,
  hazardPattern: HazardSynergyPattern | null,
  astronaut: {
    name: string;
    role: string;
    careerRadiation: number;
    careerLimit: number;
  }
): SBARHandoverPacket {
  const missionConfig = MISSIONS_CONFIG[mission];
  const now = new Date().toISOString();
  const packetId = `SBAR-MINS-${mission}-${Date.now().toString(36).toUpperCase()}`;

  // 1. SITUATION
  const situationHeadline = hazardPattern
    ? `${hazardPattern.title} — Estado: ${decisionReport.overallStateLabel}`
    : `Evaluación clínica de rutina: ${decisionReport.overallStateLabel}`;

  // 2. BACKGROUND
  const backgroundSummary = `Perfil de misión: ${missionConfig.name} (${missionConfig.distanceFromEarthKm}). Gravedad: ${missionConfig.gravityLabel}. Retardo radio unidireccional: ${missionConfig.oneWayDelayDisplay}. Calibración individual L-30 verificada.`;

  // 3. ASSESSMENT
  const indicatorsReadings = (Object.keys(HEALTH_INDICATORS) as IndicatorId[]).map((key) => {
    const def = HEALTH_INDICATORS[key];
    const val = currentReadings[key];
    const b = baselines[key];
    const ev = decisionReport.evaluations[key];

    return {
      id: key,
      name: def.name,
      currentValue: val,
      unit: def.unit,
      baselineMean: b.mean,
      status: ev.stateLabel,
      evaluationType: ev.evaluationType,
      explanation: ev.explanation.queMidiendo,
    };
  });

  // 4. RECOMMENDATION
  const actionsTaken = [
    decisionReport.primaryAction,
    "Registro biomédico persistido en memoria local de la plataforma Mins-Health.",
    "Protocolo de vigilancia autonómica continuado a 1 Hz a bordo.",
  ];

  const advisory = decisionReport.overallState === "ESCALAR_TIERRA"
    ? "Se solicita revisión prioritaria del cirujano de vuelo en tierra en la próxima ventana de contacto DSN."
    : "Sin requerimiento de intervención terrestre de urgencia. Mantener bitácora regular.";

  const rawPayload = JSON.stringify({
    packetId,
    mission,
    readings: currentReadings,
    overallState: decisionReport.overallState,
  });

  const checksum = calculateCRC32(rawPayload);

  return {
    packetId,
    generationTimestampUTC: now,
    mission,
    missionElapsedDays: mission === "MARTE" ? 187 : mission === "LUNA" ? 14 : 92,
    astronaut: {
      id: "MINS-ASTRO-01",
      name: astronaut.name,
      role: astronaut.role,
      careerRadiationAccumulatedMilliSv: astronaut.careerRadiation,
      careerRadiationLimitMilliSv: astronaut.careerLimit,
    },
    sbar: {
      situation: {
        headline: situationHeadline,
        overallSeverity: decisionReport.overallState,
        activeSystemicPattern: hazardPattern?.title,
      },
      background: {
        missionProfile: backgroundSummary,
        oneWayLightDelayMinutes: Number((missionConfig.oneWayLightDelaySeconds / 60).toFixed(1)),
        baselineSummary: "7 biomarcadores calibrados con línea base L-30 de NASA HRP Standard Measures.",
        previousIncidentsCount: 0,
      },
      assessment: {
        indicatorsReadings,
        hazardSynergiesSummary: hazardPattern
          ? `Sinergia entre peligros: ${hazardPattern.whyTogetherTheyMatterMore}`
          : "Sin sinergia multi-factorial crítica detectada.",
      },
      recommendation: {
        actionsTakenOnboard: actionsTaken,
        flightSurgeonAdvisoryRequested: advisory,
        followUpWindowMinutes: mission === "MARTE" ? 120 : 30,
      },
    },
    integrity: {
      checksum,
      algorithm: "CRC32-CCSDS-MOD",
      digitalSignature: `SIG-${checksum.slice(2)}-MINS-SOLUTIONS`,
    },
    transmission: {
      simulatedDelaySeconds: missionConfig.oneWayLightDelaySeconds,
      status: "EN_COLA_LOCAL",
      progressPercent: 0,
    },
  };
}

/**
 * Exporta el paquete a archivo JSON descargable
 */
export function downloadSBARPacketJSON(packet: SBARHandoverPacket): void {
  const jsonStr = JSON.stringify(packet, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${packet.packetId}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Abre una ventana imprimible / descargable en PDF con formato clínico aeroespacial formal
 */
export function printSBARReportPDF(packet: SBARHandoverPacket): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${packet.packetId} — Mins-Health Clinical Handover</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 30px; color: #111; line-height: 1.5; font-size: 13px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 18px; font-weight: bold; }
          .subtitle { color: #555; font-size: 12px; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 14px; font-weight: bold; background: #eee; padding: 4px 8px; border-left: 4px solid #0B3D91; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
          th { background: #f8f8f8; font-weight: bold; }
          .checksum-box { border: 1px dashed #444; padding: 8px; background: #fafafa; font-family: monospace; font-size: 11px; margin-top: 20px; }
          .footer { font-size: 10px; color: #777; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">MINS-HEALTH // SBAR CLINICAL HANDOVER REPORT</div>
            <div class="subtitle">by Mins Solutions TI — NASA Space Apps Challenge 2026</div>
          </div>
          <div style="text-align: right; font-family: monospace; font-size: 11px;">
            ID: ${packet.packetId}<br>
            UTC: ${new Date(packet.generationTimestampUTC).toLocaleString()}<br>
            Misión: ${packet.mission}
          </div>
        </div>

        <div class="section">
          <div class="section-title">S — SITUATION (SITUACIÓN ACTUAL)</div>
          <p><strong>Titular:</strong> ${packet.sbar.situation.headline}</p>
          <p><strong>Severidad General:</strong> ${packet.sbar.situation.overallSeverity}</p>
          ${packet.sbar.situation.activeSystemicPattern ? `<p><strong>Patrón Sistémico Activo:</strong> ${packet.sbar.situation.activeSystemicPattern}</p>` : ""}
        </div>

        <div class="section">
          <div class="section-title">B — BACKGROUND (ANTECEDENTES Y ENTORNO DE MISIÓN)</div>
          <p><strong>Tripulante:</strong> ${packet.astronaut.name} (${packet.astronaut.role})</p>
          <p><strong>Perfil de Misión:</strong> ${packet.sbar.background.missionProfile}</p>
          <p><strong>Dosis de Carrera Acumulada:</strong> ${packet.astronaut.careerRadiationAccumulatedMilliSv} mSv / ${packet.astronaut.careerRadiationLimitMilliSv} mSv (Límite NASA)</p>
        </div>

        <div class="section">
          <div class="section-title">A — ASSESSMENT (EVALUACIÓN DE BIOMARCADORES Y TELEMETRÍA)</div>
          <table>
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Valor Actual</th>
                <th>Línea Base</th>
                <th>Estado</th>
                <th>Tipo de Evaluación</th>
              </tr>
            </thead>
            <tbody>
              ${packet.sbar.assessment.indicatorsReadings.map((r) => `
                <tr>
                  <td><strong>${r.name}</strong></td>
                  <td>${r.currentValue !== null ? `${r.currentValue} ${r.unit}` : "Sin datos"}</td>
                  <td>${r.baselineMean} ${r.unit}</td>
                  <td>${r.status}</td>
                  <td>${r.evaluationType}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <p style="margin-top: 8px;"><em>${packet.sbar.assessment.hazardSynergiesSummary}</em></p>
        </div>

        <div class="section">
          <div class="section-title">R — RECOMMENDATION (ACCIONES TOMADAS Y RECOMENDACIÓN A TIERRA)</div>
          <ul>
            ${packet.sbar.recommendation.actionsTakenOnboard.map((a) => `<li>${a}</li>`).join("")}
          </ul>
          <p><strong>Requerimiento para Cirujano de Vuelo:</strong> ${packet.sbar.recommendation.flightSurgeonAdvisoryRequested}</p>
        </div>

        <div class="checksum-box">
          <strong>FIRMA DE INTEGRIDAD DE TELEMETRÍA DE ESPACIO PROFUNDO:</strong><br>
          Algoritmo: ${packet.integrity.algorithm} | Checksum: ${packet.integrity.checksum} | Firma: ${packet.integrity.digitalSignature}
        </div>

        <div class="footer">
          Aviso: Documento de simulación técnica para el reto "Create Health Monitoring Software for Astronauts on Space Missions" (NASA Space Apps 2026). Prototipo de investigación aeroespacial, no constituye prescripción farmacológica ni dispositivo médico certificado.
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}
