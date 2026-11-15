"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ChevronRight, ChevronLeft, Play, Pause, X } from "lucide-react";
import { useHealthStore } from "@/store/health-store";

interface GuidedPitchDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoStep {
  stepNumber: number;
  timeRange: string;
  title: string;
  subtitlesSpanish: string;
  whatJudgesSee: string;
  keyScientificArgument: string;
  actionToTrigger?: () => void;
}

export function GuidedPitchDemoModal({
  isOpen,
  onClose,
}: GuidedPitchDemoModalProps) {
  const { setMission, loadDemoScenario } = useHealthStore();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);

  const DEMO_STEPS: DemoStep[] = [
    {
      stepNumber: 1,
      timeRange: "0:00 - 0:45",
      title: "1. El Problema: Retraso de comunicaciones y líneas base",
      subtitlesSpanish:
        "«En una misión a Marte, las señales tardan hasta 20 minutos en llegar a la Tierra. Si un astronauta se descompensa, el cirujano de vuelo en Houston no puede responder en tiempo real. Por eso creamos Mins-Health: un software que corre 100% en la cabina y compara cada signo vital no con promedios terrestres abstractos, sino con la línea base pre-vuelo individualizada de cada tripulante».",
      whatJudgesSee:
        "Cabina en órbita LEO con los 7 indicadores nominales. Contador de retraso de comunicaciones a Tierra y visualización 3D interactiva del astronauta.",
      keyScientificArgument:
        "La microgravedad altera la fisiología basal (adaptación vestibular, redistribución de fluidos hacia la cabeza). Usar umbrales terrestres causa falsos positivos.",
      actionToTrigger: () => {
        setMission("ISS");
        loadDemoScenario("RUTINA_NORMAL");
      },
    },
    {
      stepNumber: 2,
      timeRange: "0:45 - 1:30",
      title: "2. Triaje Inteligente: Del síntoma a la zona anatómica",
      subtitlesSpanish:
        "«Observen nuestro mapa anatómico en 3D. El astronauta o su compañero pueden girar el modelo libremente con el ratón o activar el modo de órganos internos. Al tocar una zona, el sistema explica en lenguaje natural qué está ocurriendo, el peligro de la NASA involucrado y las tareas de autocuidado a bordo».",
      whatJudgesSee:
        "El mapa 3D con hotspots anatómicos sobre el casco, pecho y abdomen. El panel derecho muestra la explicación sencilla y la lista de tareas de autocuidado.",
      keyScientificArgument:
        "Diseño de interfaz para situaciones de fatiga cognitiva: jerarquía clara, botones didácticos y distinción inmediata entre variación estadística y umbral de emergencia.",
      actionToTrigger: () => {
        setMission("LUNA");
      },
    },
    {
      stepNumber: 3,
      timeRange: "1:30 - 2:15",
      title: "3. Detección de Patrones Sistémicos y Radiación",
      subtitlesSpanish:
        "«Vean qué sucede durante una tormenta solar súbita de partículas. En lugar de bombardear a la tripulación con seis alarmas individuales rojas que causan pánico, el motor agrupa los indicadores en UNA sola alerta unificada de patrón sistémico con una acción clara y serena: consultar con el médico de vuelo y revisar el protocolo de refugio blindado».",
      whatJudgesSee:
        "Inyección del escenario de Tormenta Solar SPE. Una única tarjeta de alerta de patrón sistémico en la cabina con una recomendación coordinada.",
      keyScientificArgument:
        "Cumple las directrices NASA HRP Radiation & Behavioral Health. Previene la fatiga de alarmas médicas en momentos críticos de vuelo espacial.",
      actionToTrigger: () => {
        setMission("MARTE");
        loadDemoScenario("TORMENTA_SOLAR");
      },
    },
    {
      stepNumber: 4,
      timeRange: "2:15 - 3:00",
      title: "4. Protocolo SBAR y Entrega Clínica a Houston",
      subtitlesSpanish:
        "«Cuando la nave vuelve a estar en línea con la red de espacio profundo, Mins-Health genera un informe estructurado en formato SBAR con verificación criptográfica SHA-256. Así el equipo médico en Houston recibe el contexto completo en una sola transmisión compacta. Mins-Health es la cabina de salud autónoma que llevará a la humanidad a Marte».",
      whatJudgesSee:
        "Generación y descarga del reporte SBAR digital y opción de exportación a PDF para la tripulación médica.",
      keyScientificArgument:
        "Protocolo estándar de la Organización Mundial de la Salud y NASA Flight Medicine para traspaso de cuidados médicos críticos con cero pérdida de información.",
    },
  ];

  const step = DEMO_STEPS[currentStepIndex];

  useEffect(() => {
    if (!isOpen) {
      setIsPlayingAuto(false);
      return;
    }
    if (step.actionToTrigger) {
      step.actionToTrigger();
    }
  }, [isOpen, currentStepIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAuto && isOpen) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < DEMO_STEPS.length - 1) return prev + 1;
          setIsPlayingAuto(false);
          return prev;
        });
      }, 25000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAuto, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl glass-panel border border-white/15 shadow-2xl rounded-3xl overflow-hidden flex flex-col font-sans text-xs bg-[#111218]/90 max-h-[85vh]">
        {/* Encabezado Liquid Glass */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-black/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Modo Guion de Demo (Pitch 3 Minutos) · Jurado NASA
              </h3>
              <p className="text-xs text-slate-400">
                Paso {step.stepNumber} de {DEMO_STEPS.length} · Tiempo estimado: {step.timeRange}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progreso con Gradiente */}
        <div className="w-full bg-black/40 h-1.5 flex flex-shrink-0">
          {DEMO_STEPS.map((s, idx) => (
            <div
              key={idx}
              className={`flex-1 h-full border-r border-[#111218] transition-all duration-300 ${
                idx === currentStepIndex
                  ? "bg-gradient-to-r from-[#9975ff] to-[#66d8d1]"
                  : idx < currentStepIndex
                  ? "bg-emerald-500"
                  : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Cuerpo del Paso Guiado */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white tracking-tight">{step.title}</h4>
            <span className="px-3 py-1 rounded-full bg-[#9975ff]/20 border border-[#9975ff]/40 text-[#bca6ff] font-semibold text-xs">
              {step.timeRange}
            </span>
          </div>

          {/* Subtítulos sugeridos para el orador */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-[#bca6ff] font-bold block">
              Guion sugerido para el orador:
            </span>
            <p className="text-xs text-slate-200 font-sans italic leading-relaxed">
              {step.subtitlesSpanish}
            </p>
          </div>

          {/* Qué están viendo los jueces y argumento científico */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
              <span className="text-[10px] text-slate-400 block font-semibold mb-1 uppercase tracking-wider">
                Qué ven los jueces en pantalla:
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{step.whatJudgesSee}</p>
            </div>

            <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
              <span className="text-[10px] text-[#66d8d1] block font-semibold mb-1 uppercase tracking-wider">
                Argumento científico de fondo:
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{step.keyScientificArgument}</p>
            </div>
          </div>
        </div>

        {/* Pie con Controles de Avance */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="btn-secondary-glass flex items-center gap-1 px-3.5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => setIsPlayingAuto(!isPlayingAuto)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isPlayingAuto
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold"
                  : "btn-secondary-glass"
              }`}
            >
              {isPlayingAuto ? <Pause className="w-3.5 h-3.5 text-amber-300" /> : <Play className="w-3.5 h-3.5 fill-slate-300" />}
              <span>{isPlayingAuto ? "Pausar Auto" : "Auto Play (25s)"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex < DEMO_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn-primary-gradient flex items-center gap-1 px-5 py-2 text-xs font-semibold cursor-pointer"
              >
                <span>Siguiente paso</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn-primary-gradient px-6 py-2 text-xs font-bold cursor-pointer"
              >
                Finalizar Pitch
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
