import { NextRequest, NextResponse } from "next/server";
import { BiometricPayload } from "@/types/mission-health.types";
import { evaluateAstronautHealth } from "@/core-logic/biometric-analyzer.service";
import { saveTelemetryAndIncident } from "@/repositories/telemetry.repository";

/**
 * =============================================================================
 * API ROUTE: /api/v1/telemetry/ingest
 * =============================================================================
 * @method POST
 * @responsible DESARROLLADOR A (APIs y Datos)
 * @description
 * Recibe paquetes de telemetría biomédica y ambiental transmitidos por los trajes
 * o sistemas de a bordo. Invoca el motor de Core Logic para obtener el diagnóstico
 * clínico inmediato y persiste el evento en la base de datos (Supabase).
 *
 * @param {NextRequest} req Cuerpo JSON con estructura BiometricPayload
 * @returns {NextResponse} Diagnóstico clínico y confirmación de persistencia
 *
 * @developer DESARROLLADOR A (APIs y Datos)
 *
 * @example
 * // Invocación (POST /api/v1/telemetry/ingest):
 * // Body:
 * // {
 * //   "astronautId": "astro-artemis-001",
 * //   "timestamp": "2026-11-10T20:00:00.000Z",
 * //   "vitals": { "heartRate": 158.0, "hrv": 18.5, "spo2": 88.0, "coreTemp": 38.6 },
 * //   "environment": { "suitPressure": 3.2, "cabinCo2": 4.5, "solarRadiationIndex": 125.0 },
 * //   "activityState": "EVA_SPACEWALK"
 * // }
 *
 * // Respuesta (200 OK):
 * // {
 * //   "success": true,
 * //   "diagnosis": {
 * //     "astronautId": "astro-artemis-001",
 * //     "riskScore": 87,
 * //     "status": "EMERGENCY",
 * //     "detectedAnomalies": [...],
 * //     "recommendedProtocol": { "protocolCode": "EVA-ABORT-04", ... },
 * //     "autonomousActionTaken": "Presurización auxiliar activada a 4.2 psi."
 * //   },
 * //   "storage": { "telemetryId": "uuid-...", "incidentId": "uuid-..." }
 * // }
 */
export async function POST(req: NextRequest) {
  try {
    const body: BiometricPayload = await req.json();

    // 1. Validación básica de payload aeroespacial
    if (!body.astronautId || !body.vitals || !body.environment) {
      return NextResponse.json(
        {
          success: false,
          error: "PAYLOAD_MALFORMED: Faltan campos biométricos u operacionales esenciales.",
        },
        { status: 400 }
      );
    }

    // 2. Ejecutar análisis biomédico llamando a la capa de Core Logic (Zona Dev B)
    const diagnosis = evaluateAstronautHealth(body);

    // 3. Persistir en base de datos mediante el Repositorio (Zona Dev A)
    let storageResult = null;
    try {
      storageResult = await saveTelemetryAndIncident(body, diagnosis);
    } catch (dbError) {
      console.error("[CRITICAL DB ERROR]: Fallo al persistir en Supabase:", dbError);
      // En un entorno de misión espacial, el diagnóstico a bordo se entrega incluso si la BD sufre latencia
    }

    return NextResponse.json(
      {
        success: true,
        diagnosis,
        storage: storageResult,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal flight computer failure";
    return NextResponse.json(
      {
        success: false,
        error: "INGESTION_PIPELINE_ERROR",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
