import { NextRequest, NextResponse } from "next/server";
import { SimulationScenario } from "@/types/mission-health.types";
import { generateCrisisPayload } from "@/core-logic/crisis-simulator.service";
import { evaluateAstronautHealth } from "@/core-logic/biometric-analyzer.service";
import { saveTelemetryAndIncident } from "@/repositories/telemetry.repository";

/**
 * =============================================================================
 * API ROUTE: /api/v1/simulation/trigger
 * =============================================================================
 * @method POST
 * @responsible DESARROLLADOR A (APIs y Datos)
 * @description
 * Permite a los presentadores inyectar crisis médicas o ambientales en tiempo real
 * durante el pitch frente a los jueces de la NASA.
 * Invoca el generador de crisis de Core Logic y, opcionalmente, procesa y guarda
 * el incidente en Supabase para reflejarlo en vivo en el Dashboard.
 *
 * @param {NextRequest} req JSON con `{ scenario: SimulationScenario, astronautId?: string, persist?: boolean }`
 * @returns {NextResponse} Payload simulado generado y diagnóstico resultante
 *
 * @developer DESARROLLADOR A (APIs y Datos)
 *
 * @example
 * // Invocación (POST /api/v1/simulation/trigger):
 * // Body:
 * // {
 * //   "scenario": "SUIT_LEAK",
 * //   "astronautId": "astro-artemis-001",
 * //   "persist": true
 * // }
 *
 * // Respuesta (200 OK):
 * // {
 * //   "success": true,
 * //   "scenarioInjected": "SUIT_LEAK",
 * //   "generatedPayload": { ... },
 * //   "diagnosis": { "status": "EMERGENCY", "riskScore": 87, ... },
 * //   "persisted": true
 * // }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scenario: SimulationScenario = body.scenario ?? "NOMINAL";
    const astronautId: string = body.astronautId ?? "astro-artemis-001";
    const persist: boolean = body.persist ?? true;

    // 1. Generar datos fisiológicos de la crisis simulada (Dev B Service)
    const simulatedPayload = generateCrisisPayload(scenario, astronautId);

    // 2. Evaluar el impacto clínico (Dev B Service)
    const diagnosis = evaluateAstronautHealth(simulatedPayload);

    // 3. Persistir en la base de datos si se solicitó actualización en vivo del dashboard
    let persistenceDetails = null;
    if (persist) {
      try {
        persistenceDetails = await saveTelemetryAndIncident(simulatedPayload, diagnosis);
      } catch (dbError) {
        console.warn("[SIMULATION] No se pudo persistir en BD local, continuando en modo memoria:", dbError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        scenarioInjected: scenario,
        generatedPayload: simulatedPayload,
        diagnosis,
        persisted: persistenceDetails !== null,
        persistenceDetails,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error triggering crisis scenario";
    return NextResponse.json(
      {
        success: false,
        error: "SIMULATION_TRIGGER_FAILED",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
