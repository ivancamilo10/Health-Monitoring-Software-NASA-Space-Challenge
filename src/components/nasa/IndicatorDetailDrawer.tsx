"use client";

import React, { useState } from "react";
import { useHealthStore } from "@/store/health-store";
import { IndicatorId, HEALTH_INDICATORS } from "@/data/indicators";
import { EvaluationState } from "@/core/rules";
import { evaluateHazardSynergy } from "@/core/hazard-interactions";
import { getSimpleIndicators, getTexts } from "@/data/i18n";
import {
  generateSBARHandoverPacket,
  downloadSBARPacketJSON,
  printSBARReportPDF,
} from "@/core/sbar-handover";
import {
  X,
  CheckCircle2,
  Circle,
  ChevronDown,
  ShieldCheck,
  FileDown,
  Printer,
  Sparkles,
  Info,
  Radio,
} from "lucide-react";

interface IndicatorDetailDrawerProps {
  indicatorId: IndicatorId;
  onClose: () => void;
}

export function IndicatorDetailDrawer({
  indicatorId,
  onClose,
}: IndicatorDetailDrawerProps) {
  const {
    decisionReport,
    currentReadings,
    baselines,
    mission,
    astronautName,
    astronautRole,
    careerRadiationAccumulatedMilliSv,
    careerRadiationLimitMilliSv,
    openDsnModal,
    language,
  } = useHealthStore();

  const texts = getTexts(language);
  const simpleIndicators = getSimpleIndicators(language);
  const def = HEALTH_INDICATORS[indicatorId];
  const simple = simpleIndicators[indicatorId];
  const evalData = decisionReport.evaluations[indicatorId];
  const baseline = baselines[indicatorId];
  const val = currentReadings[indicatorId];

  // Acordeón de detalles técnicos y científicos
  const [isTechnicalAccordionOpen, setIsTechnicalAccordionOpen] = useState<boolean>(false);

  // Checklist de tareas de autocuidado completadas
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  // Detección de sinergias activas
  const deviatedKeys = (Object.keys(HEALTH_INDICATORS) as IndicatorId[]).filter(
    (k) => decisionReport.evaluations[k]?.state !== "HABITUAL" && decisionReport.evaluations[k]?.state !== "SIN_DATOS"
  );
  const activeSynergy = evaluateHazardSynergy(deviatedKeys);

  const toggleAction = (idx: number) => {
    setCompletedActions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getStatusVisuals = (state: EvaluationState) => {
    switch (state) {
      case "ESCALAR_TIERRA":
        return {
          label: "Pedir ayuda a tierra",
          color: "#f43f5e",
          bgColor: "rgba(244, 63, 94, 0.15)",
        };
      case "ATENCION":
        return {
          label: "Requiere atención",
          color: "#f97316",
          bgColor: "rgba(249, 115, 22, 0.15)",
        };
      case "VIGILAR":
        return {
          label: "Vigilar",
          color: "#f59e0b",
          bgColor: "rgba(245, 158, 11, 0.15)",
        };
      case "HABITUAL":
        return {
          label: "Normal",
          color: "#10b981",
          bgColor: "rgba(16, 185, 129, 0.15)",
        };
      case "SIN_DATOS":
      default:
        return {
          label: "Sin datos",
          color: "#94a3b8",
          bgColor: "rgba(148, 163, 184, 0.12)",
        };
    }
  };

  const status = getStatusVisuals(evalData.state);

  // Mensaje en lenguaje claro para el Bloque 1 ("¿Cómo estás?")
  const getPlainExplanation = () => {
    if (val === null) {
      return `Aún no has registrado tu lectura de hoy para ${simple.name}. Puedes pulsar 'Hacer mi chequeo de hoy' para anotarla.`;
    }

    const diff = val - baseline.mean;
    const isWithinNormal = Math.abs(diff) <= baseline.standardDeviation;

    if (isWithinNormal) {
      return `Tu valor de hoy es ${val} ${def.unit}. Está dentro de tu rango normal personal (tu promedio habitual suele ser ${baseline.mean} ${def.unit}). Todo en orden.`;
    }

    if (evalData.state === "VIGILAR") {
      return `Tu valor de hoy es ${val} ${def.unit}, lo que representa una ligera variación respecto a tu promedio habitual de ${baseline.mean} ${def.unit}. No es motivo de alarma, pero conviene seguirlo de cerca.`;
    }

    if (evalData.state === "ATENCION") {
      return `Tu valor de hoy es ${val} ${def.unit}, alejándose de tu promedio normal de ${baseline.mean} ${def.unit}. Sigue las recomendaciones de autocuidado a bordo.`;
    }

    return `Tu valor de hoy (${val} ${def.unit}) supera el umbral de seguridad clínica. Avisa al resto de la tripulación y prepara la consulta con el médico de vuelo en Houston.`;
  };

  // Exportación SBAR
  const handleExportJSON = () => {
    const packet = generateSBARHandoverPacket(
      decisionReport,
      mission,
      currentReadings,
      baselines,
      activeSynergy,
      {
        name: astronautName,
        role: astronautRole,
        careerRadiation: careerRadiationAccumulatedMilliSv,
        careerLimit: careerRadiationLimitMilliSv,
      }
    );
    downloadSBARPacketJSON(packet);
  };

  const handlePrintPDF = () => {
    const packet = generateSBARHandoverPacket(
      decisionReport,
      mission,
      currentReadings,
      baselines,
      activeSynergy,
      {
        name: astronautName,
        role: astronautRole,
        careerRadiation: careerRadiationAccumulatedMilliSv,
        careerLimit: careerRadiationLimitMilliSv,
      }
    );
    printSBARReportPDF(packet);
  };

  return (
    <div className="w-full md:w-[420px] xl:w-[460px] h-full bg-[#0c0d12]/95 backdrop-blur-xl border-l border-white/10 flex flex-col justify-between p-5 overflow-y-auto flex-shrink-0 z-20 shadow-2xl select-none">
      {/* ========================================================
          ENCABEZADO: PREGUNTA 3 "¿QUÉ HAGO?" Y NOMBRE SENCILLO
          ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {texts.zoneRightTitle}
            </h2>
            <span className="text-xs text-slate-300 font-medium">· Plan y recomendaciones</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar panel de detalle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nombre del indicador y estado con icono y forma */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-extrabold text-white leading-tight">
              {simple.name}
            </h3>
            <span className="text-xs text-slate-300 mt-0.5 block font-medium">
              Zona anatómica: {simple.bodyZone}
            </span>
          </div>

          <div
            className="px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 flex-shrink-0 border shadow-sm"
            style={{
              backgroundColor: status.bgColor,
              color: status.color,
              borderColor: `${status.color}50`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
            <span>{status.label}</span>
          </div>
        </div>

        {/* ========================================================
            BLOQUE (A): "¿CÓMO ESTÁS?" EN LENGUAJE SIMPLE
            ======================================================== */}
        <div className="p-4 rounded-2xl glass-panel border border-white/10 shadow-lg">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-bold text-[#bca6ff] uppercase tracking-wide">
              ¿Cómo estás hoy?
            </span>
            <div className="text-right text-xs text-slate-300 font-medium">
              Tu normal: <strong className="text-white">{baseline.mean}</strong> {def.unit}
            </div>
          </div>

          <p className="text-sm text-slate-100 leading-relaxed font-sans">
            {getPlainExplanation()}
          </p>
        </div>

        {/* Alerta de sinergia entre peligros si aplica */}
        {activeSynergy && activeSynergy.involvedIndicators.includes(indicatorId) && (
          <div className="p-3.5 rounded-2xl bg-orange-950/30 border border-orange-500/30 text-xs text-orange-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-orange-300">
              <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>Cuidado combinado: {activeSynergy.title}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeSynergy.whyTogetherTheyMatterMore}
            </p>
          </div>
        )}

        {/* ========================================================
            BLOQUE (B): "¿QUÉ HAGO?" - ACCIÓN PRINCIPAL Y CHECKLIST
            ======================================================== */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[#9975ff]/15 border border-[#9975ff]/30 text-slate-100 flex items-start gap-3 shadow-md shadow-purple-500/10">
            <ShieldCheck className="w-5 h-5 text-[#bca6ff] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#bca6ff] block uppercase tracking-wide">
                Paso recomendado:
              </span>
              <p className="text-sm leading-relaxed font-medium text-white mt-0.5">
                {evalData.escalation.actionRequired}
              </p>
            </div>
          </div>

          {/* Checklist de autocuidado a bordo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold uppercase text-xs tracking-wide text-slate-200">
                Tareas de autocuidado:
              </span>
              <span className="text-emerald-400 font-semibold">
                {Object.values(completedActions).filter(Boolean).length} de {def.acciones.length} completadas
              </span>
            </div>

            <div className="space-y-2 pr-1">
              {def.acciones.map((acc, idx) => {
                const isChecked = !!completedActions[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleAction(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-sm transition-all duration-200 flex items-start gap-2.5 cursor-pointer ${
                      isChecked
                        ? "bg-emerald-950/25 border-emerald-500/40 text-emerald-200 line-through opacity-80"
                        : "glass-panel glass-panel-hover text-slate-100"
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{acc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            BLOQUE (C): "SABER MÁS Y DETALLES TÉCNICOS" (ACORDEÓN)
            ======================================================== */}
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
          <button
            onClick={() => setIsTechnicalAccordionOpen(!isTechnicalAccordionOpen)}
            className="w-full p-3.5 flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#66d8d1]" />
              <span>{texts.seeMoreAccordion}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isTechnicalAccordionOpen ? "rotate-180" : ""}`} />
          </button>

          {isTechnicalAccordionOpen && (
            <div className="p-4 border-t border-white/10 space-y-3 text-xs text-slate-200 animate-in fade-in duration-150">
              {/* 4 Preguntas clave explicadas en palabras sencillas */}
              <div className="space-y-2.5">
                <div>
                  <strong className="text-white block font-semibold text-xs">¿Cómo se mide en el espacio?:</strong>
                  <p className="text-slate-300 text-xs leading-relaxed mt-0.5">{simple.howToMeasure}</p>
                </div>
                <div>
                  <strong className="text-white block font-semibold text-xs">¿Por qué importa este examen?:</strong>
                  <p className="text-slate-300 text-xs leading-relaxed mt-0.5">{simple.whyItMatters}</p>
                </div>
                <div>
                  <strong className="text-white block font-semibold text-xs">¿Qué lo afecta en el espacio?:</strong>
                  <p className="text-slate-300 text-xs leading-relaxed mt-0.5">{simple.whatAffectsItInSpace}</p>
                </div>
                <div>
                  <strong className="text-white block font-semibold text-xs">¿Cuándo pedir ayuda?:</strong>
                  <p className="text-slate-300 text-xs leading-relaxed mt-0.5">{simple.whenToAskForHelp}</p>
                </div>
              </div>

              {/* Parámetros estadísticos y fuentes técnicas */}
              <div className="pt-2.5 border-t border-white/10 space-y-1 text-xs text-slate-400">
                <div>
                  Línea base personal: <strong className="text-white">{baseline.mean} {def.unit}</strong> (desviación típica: ± {baseline.standardDeviation})
                </div>
                <div>
                  Rango normal esperado: {(baseline.mean - baseline.standardDeviation).toFixed(1)} a {(baseline.mean + baseline.standardDeviation).toFixed(1)} {def.unit}
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Fuente científica: {def.fuenteReferencia} ({def.isProvisional ? "Regla provisional de vuelo" : "Norma clínica NASA-STD / CSA"})
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          BOTONES DE REPORTE PARA EL MÉDICO DE VUELO (SBAR / PDF)
          ======================================================== */}
      <div className="pt-4 border-t border-white/10 space-y-2.5 mt-4">
        <div className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
          <Info className="w-4 h-4 text-[#66d8d1]" />
          <span>Para enviar a los cirujanos de vuelo en Houston:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openDsnModal}
            className="btn-primary-gradient w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold cursor-pointer shadow-md shadow-purple-500/20"
            title="Abrir telemetría y transmisión en vivo por la Red de Espacio Profundo"
          >
            <Radio className="w-4 h-4 text-white animate-pulse" />
            <span>Transmitir por Enlace DSN</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="btn-secondary-glass flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold cursor-pointer"
            title="Descargar paquete de datos clínicos con código de verificación para Houston"
          >
            <FileDown className="w-4 h-4 text-[#66d8d1]" />
            <span>Exportar JSON</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="btn-secondary-glass flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold cursor-pointer"
            title="Imprimir o guardar reporte clínico aeroespacial en formato PDF legible"
          >
            <Printer className="w-4 h-4 text-[#bca6ff]" />
            <span>Imprimir PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
