"use client";

import React, { useState, useEffect } from "react";
import { UI_TEXTS_ES } from "@/data/i18n";
import { Sparkles, HeartPulse, User, ClipboardCheck, X, ChevronRight } from "lucide-react";

interface WelcomeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeTourModal({ isOpen, onClose }: WelcomeTourModalProps) {
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mins_health_welcome_seen", "true");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel border border-white/15 shadow-2xl rounded-3xl flex flex-col overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200 bg-[#111218]/90">
        {/* Encabezado */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#9975ff]/20 border border-[#9975ff]/30 flex items-center justify-center text-[#bca6ff]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Bienvenido a Mins-Health
              </h3>
              <p className="text-xs text-slate-400">
                Paso {step} de 3 · Diseñado para astronautas y evaluadores
              </p>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar introducción"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indicador de pasos con gradiente */}
        <div className="flex h-1.5 bg-black/40">
          <div className={`h-full flex-1 transition-all duration-300 ${step >= 1 ? "bg-gradient-to-r from-[#9975ff] to-[#bca6ff]" : "bg-transparent"}`} />
          <div className={`h-full flex-1 transition-all duration-300 ${step >= 2 ? "bg-[#bca6ff]" : "bg-transparent"}`} />
          <div className={`h-full flex-1 transition-all duration-300 ${step >= 3 ? "bg-[#66d8d1]" : "bg-transparent"}`} />
        </div>

        {/* Contenido según paso */}
        <div className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#9975ff]/15 border border-[#9975ff]/30 flex items-center justify-center text-[#bca6ff] shadow-lg shadow-purple-500/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">
                {UI_TEXTS_ES.tourStep1Title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {UI_TEXTS_ES.tourStep1Body}
              </p>
              <div className="p-3.5 rounded-2xl glass-panel border border-white/10 text-xs text-slate-300">
                💡 <strong>Sin jerga:</strong> Comparamos tu lectura de hoy con lo que es <em>normal para ti</em>, no con promedios terrestres abstractos.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <User className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">
                {UI_TEXTS_ES.tourStep2Title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {UI_TEXTS_ES.tourStep2Body}
              </p>
              <div className="p-3.5 rounded-2xl glass-panel border border-white/10 text-xs text-slate-300">
                💡 <strong>Fácil de recordar:</strong> Verde = Normal · Amarillo = Vigilar · Naranja = Atención · Rojo = Pedir ayuda.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#66d8d1]/15 border border-[#66d8d1]/30 flex items-center justify-center text-[#66d8d1] shadow-lg shadow-cyan-500/20">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">
                {UI_TEXTS_ES.tourStep3Title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {UI_TEXTS_ES.tourStep3Body}
              </p>
              <div className="p-3.5 rounded-2xl glass-panel border border-white/10 text-xs text-slate-300">
                💡 <strong>Siempre funciona sin internet:</strong> Todos tus datos se procesan en la cabina y están listos aunque no haya señal con Houston.
              </div>
            </div>
          )}
        </div>

        {/* Pie con botones */}
        <div className="px-6 py-4.5 border-t border-white/10 bg-black/30 flex items-center justify-between">
          <button
            onClick={handleFinish}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {UI_TEXTS_ES.tourSkip}
          </button>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary-glass px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Atrás
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-primary-gradient flex items-center gap-1.5 px-5 py-2 text-xs font-semibold cursor-pointer"
              >
                <span>{UI_TEXTS_ES.tourNext}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="btn-primary-gradient px-6 py-2 text-xs font-bold cursor-pointer"
              >
                {UI_TEXTS_ES.tourDone}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
