/**
 * =============================================================================
 * NASA SPACE APPS 2026 - PROTOCOLO DE ESCALADO Y REPORTE A TIERRA CON CHECKSUM
 * =============================================================================
 * En misiones con latencia de 20 minutos (Marte), los datos no se envían como
 * un stream TCP convencional, sino en paquetes autónomos sellados (Consultative
 * Committee for Space Data Systems - CCSDS) con firma de integridad (Checksum).
 */

import { MissionDecisionReport } from "./rules";
import { MissionDestination } from "./missions";

export interface FlightSurgeonReportPacket {
  packetId: string;
  mission: MissionDestination;
  timestamp: string;
  astronautId: string;
  astronautName: string;
  urgencyLevel: string;
  decisionReport: MissionDecisionReport;
  checksum: string;
  simulatedTransmissionDelayMinutes: number;
  deliveryStatus: "EMPAQUETADO_A_BORDO" | "TRANSMITIENDO_DSN" | "RECIBIDO_HOUSTON";
}

/**
 * Genera un checksum hexadecimal seguro de 8 caracteres para verificar integridad
 */
function generateTelemetryChecksum(payloadString: string): string {
  let hash = 0;
  for (let i = 0; i < payloadString.length; i++) {
    const char = payloadString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convertir a entero de 32 bits
  }
  return "0x" + Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
}

/**
 * Empaqueta el reporte del astronauta para ser transmitido por la Deep Space Network (DSN)
 */
export function packageFlightSurgeonReport(
  decisionReport: MissionDecisionReport,
  mission: MissionDestination,
  astronautId: string = "astro-artemis-001",
  astronautName: string = "Cmdr. Alex Vance"
): FlightSurgeonReportPacket {
  const delayMinutes = mission === "MARTE" ? 20 : mission === "LUNA" ? 0.02 : 0.03;
  const rawString = JSON.stringify({ astronautId, decisionReport, mission });
  const checksum = generateTelemetryChecksum(rawString);

  return {
    packetId: `DSN-PKT-${Date.now().toString(36).toUpperCase()}`,
    mission,
    timestamp: new Date().toISOString(),
    astronautId,
    astronautName,
    urgencyLevel: decisionReport.urgencyLevel,
    decisionReport,
    checksum,
    simulatedTransmissionDelayMinutes: delayMinutes,
    deliveryStatus: "EMPAQUETADO_A_BORDO",
  };
}
