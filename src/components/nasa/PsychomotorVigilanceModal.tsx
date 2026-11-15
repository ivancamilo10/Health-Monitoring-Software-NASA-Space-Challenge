"use client";

import React, { useState, useEffect, useRef } from "react";
import { Zap, Clock, CheckCircle2, RotateCcw, X, Play } from "lucide-react";
import { useHealthStore } from "@/store/health-store";

interface PsychomotorVigilanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TestState = "idle" | "waiting" | "ready" | "clicked_early" | "finished";

export function PsychomotorVigilanceModal({
  isOpen,
  onClose,
}: PsychomotorVigilanceModalProps) {
  const { setReading, evaluateHealth } = useHealthStore();

  const [testState, setTestState] = useState<TestState>("idle");
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentTrial, setCurrentTrial] = useState<number>(0);
  const totalTrials = 3; // 3 ensayos rápidos didácticos

  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [falseStarts, setFalseStarts] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleStartTest = () => {
    setReactionTimes([]);
    setCurrentTrial(0);
    setFalseStarts(0);
    setFeedbackMessage("");
    startNextTrial(0);
  };

  const startNextTrial = (trialIndex: number) => {
    setTestState("waiting");
    setFeedbackMessage("Espera el estímulo...");

    // Retardo aleatorio entre 1.5 y 3.5 segundos
    const randomDelay = Math.floor(Math.random() * 2000) + 1500;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setTestState("ready");
      setFeedbackMessage("¡PULSA AHORA!");
    }, randomDelay);
  };

  const handleUserInput = () => {
    if (testState === "waiting") {
      // Pulsó antes de tiempo (anticipación falsa)
      if (timerRef.current) clearTimeout(timerRef.current);
      setFalseStarts((prev) => prev + 1);
      setTestState("clicked_early");
      setFeedbackMessage("Anticipación falsa: Espera a que la pantalla se ponga roja.");

      setTimeout(() => {
        startNextTrial(currentTrial);
      }, 1400);
      return;
    }

    if (testState === "ready") {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      const newTimes = [...reactionTimes, elapsed];
      setReactionTimes(newTimes);

      if (currentTrial + 1 < totalTrials) {
        setCurrentTrial(currentTrial + 1);
        setFeedbackMessage(`Tiempo registrado: ${elapsed} ms. Preparando siguiente...`);
        setTimeout(() => {
          startNextTrial(currentTrial + 1);
        }, 1000);
      } else {
        // Test completado
        setTestState("finished");
        setFeedbackMessage("¡Test completado con éxito!");

        // Calcular mediana
        const sorted = [...newTimes].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];

        // Actualizar automáticamente indicador conductual
        if (median > 350) {
          setReading("mood", 2); // Fatiga detectable
        }
        evaluateHealth();
      }
    }
  };

  // Escuchar barra espaciadora
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (testState === "waiting" || testState === "ready") {
          handleUserInput();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, testState, currentTrial, reactionTimes]);

  if (!isOpen) return null;

  const medianRT =
    reactionTimes.length > 0
      ? Math.round([...reactionTimes].sort((a, b) => a - b)[Math.floor(reactionTimes.length / 2)])
      : 0;

  const lapsesCount = reactionTimes.filter((t) => t > 500).length;
  const baselineComparison = 245;
  const isFatigueDetected = medianRT > 340 || lapsesCount >= 1;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl glass-panel border border-white/15 shadow-2xl rounded-3xl overflow-hidden flex flex-col font-sans text-xs bg-[#111218]/90">
        {/* Encabezado Liquid Glass */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#66d8d1]/20 border border-[#66d8d1]/30 flex items-center justify-center text-[#66d8d1]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Test de Vigilancia Psicomotora (NASA PVT)
              </h3>
              <p className="text-xs text-slate-400">
                Indicador de fatiga operacional y tiempo de reacción
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

        {/* Área del Estímulo Visual */}
        <div className="p-6 space-y-4">
          <div
            onClick={testState === "waiting" || testState === "ready" ? handleUserInput : undefined}
            className={`w-full h-48 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none relative overflow-hidden ${
              testState === "ready"
                ? "bg-rose-950/80 border-rose-500 shadow-2xl shadow-rose-500/40 animate-pulse"
                : testState === "waiting"
                ? "glass-panel border-white/10"
                : testState === "finished"
                ? "bg-emerald-950/40 border-emerald-500/40"
                : "glass-panel border-white/10"
            }`}
          >
            {testState === "idle" && (
              <div className="text-center space-y-3 p-4">
                <p className="text-xs text-slate-300 font-sans max-w-sm">
                  Prueba de atención de la NASA: pulsa la barra espaciadora o haz clic en cuanto aparezca el recuadro rojo.
                </p>
                <button
                  onClick={handleStartTest}
                  className="btn-primary-gradient px-6 py-2.5 font-semibold text-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Iniciar test PVT ({totalTrials} intentos)</span>
                </button>
              </div>
            )}

            {testState === "waiting" && (
              <div className="text-center space-y-1.5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Prepárate...</span>
                <div className="text-xl font-bold text-white">Intento {currentTrial + 1} de {totalTrials}</div>
                <div className="text-[11px] text-slate-400">Pulsa inmediatamente al cambiar de color</div>
              </div>
            )}

            {testState === "ready" && (
              <div className="text-center space-y-1">
                <span className="text-3xl font-extrabold text-white tracking-wider">¡PULSA AHORA!</span>
                <span className="text-xs text-rose-200 block">Estímulo activo</span>
              </div>
            )}

            {testState === "finished" && (
              <div className="text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <span className="text-base font-bold text-white">Evaluación completada</span>
                <p className="text-xs text-slate-400">Datos comparados con tu línea base individual.</p>
              </div>
            )}
          </div>

          {/* Retroalimentación en vivo */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-3">
            <span>Estado: <strong className="text-white">{feedbackMessage || "Listo"}</strong></span>
            <span>Anticipaciones: <strong className="text-[#66d8d1]">{falseStarts}</strong></span>
          </div>

          {/* Resultados del Test */}
          {testState === "finished" && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase block font-medium">Mediana TR</span>
                <div className="flex items-baseline gap-1 mt-0.5 font-sans">
                  <span className={`text-xl font-bold ${isFatigueDetected ? "text-amber-400" : "text-emerald-400"}`}>
                    {medianRT}
                  </span>
                  <span className="text-[10px] text-slate-400">ms</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Base: {baselineComparison} ms</span>
              </div>

              <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase block font-medium">Lapsos (&gt;500ms)</span>
                <div className="text-xl font-bold text-white mt-0.5 font-sans">{lapsesCount}</div>
                <span className="text-[10px] text-slate-400 block mt-1">Nominal: 0 lapsos</span>
              </div>

              <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase block font-medium">Estado Operativo</span>
                <div className={`text-xs font-bold mt-1 ${isFatigueDetected ? "text-amber-400" : "text-emerald-400"}`}>
                  {isFatigueDetected ? "Fatiga moderada" : "Óptimo / Alerta"}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Impacta: Sueño & Ánimo</span>
              </div>
            </div>
          )}
        </div>

        {/* Acciones del pie */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/30 flex items-center justify-between">
          <button
            onClick={handleStartTest}
            disabled={testState === "waiting" || testState === "ready"}
            className="btn-secondary-glass flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>

          <button
            onClick={onClose}
            className="btn-primary-gradient px-5 py-2 text-xs font-semibold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
