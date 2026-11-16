"use client";

import React, { useState } from "react";
import { useHealthStore } from "@/store/health-store";
import { IndicatorId, HEALTH_INDICATORS } from "@/data/indicators";
import { getSimpleIndicators, getTexts } from "@/data/i18n";
import {
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";

interface CheckupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WIZARD_INDICATORS: IndicatorId[] = [
  "blood_pressure",
  "heart_rate",
  "glucose",
  "core_temp",
  "sleep_hours",
  "mood",
  "radiation_dose",
];

export function CheckupWizardModal({ isOpen, onClose }: CheckupWizardModalProps) {
  const { currentReadings, baselines, setReading, evaluateHealth, decisionReport, language } = useHealthStore();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeId = WIZARD_INDICATORS[currentStep];
  const def = HEALTH_INDICATORS[activeId];
  const simpleIndicators = getSimpleIndicators(language || "es");
  const simple = simpleIndicators[activeId];
  const baseline = baselines[activeId];
  const currentVal = currentReadings[activeId];

  const handleNext = () => {
    setValidationError(null);
    if (currentStep < WIZARD_INDICATORS.length - 1) {
      setCurrentStep(currentStep + 1);
      setInputValue("");
    } else {
      evaluateHealth();
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setInputValue("");
    }
  };

  const handleSaveCurrent = () => {
    if (inputValue.trim() === "") {
      handleNext();
      return;
    }

    const num = parseFloat(inputValue);
    if (isNaN(num)) {
      setValidationError(language === "en" ? "Please enter a valid numeric value" : "Por favor ingresa un número válido");
      return;
    }

    if (num < def.inputRange.min || num > def.inputRange.max) {
      setValidationError(
        language === "en"
          ? `Expected range is typically between ${def.inputRange.min} and ${def.inputRange.max} ${def.unit}. If correct, you can proceed.`
          : `El valor suele estar entre ${def.inputRange.min} y ${def.inputRange.max} ${def.unit}. Si estás seguro, puedes pulsar continuar.`
      );
    }

    setReading(activeId, num);
    handleNext();
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleFinishAndClose = () => {
    evaluateHealth();
    setIsFinished(false);
    setCurrentStep(0);
    setInputValue("");
    onClose();
  };

  const normalCount = Object.values(decisionReport.evaluations).filter(
    (e) => e.state === "HABITUAL"
  ).length;
  const watchCount = Object.values(decisionReport.evaluations).filter(
    (e) => e.state === "VIGILAR"
  ).length;
  const helpCount = Object.values(decisionReport.evaluations).filter(
    (e) => e.state === "ATENCION" || e.state === "ESCALAR_TIERRA"
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel border border-white/15 overflow-hidden shadow-2xl rounded-3xl animate-in zoom-in-95 duration-200 flex flex-col bg-[#111218]/90">
        {/* Cabecera con título e indicador */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#bca6ff] uppercase tracking-wider block">
              {language === "en" ? "Astronaut Daily Health Checkup" : "Chequeo de salud del astronauta"}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {!isFinished ? (
                <>
                  {language === "en" ? "Step" : "Paso"} {currentStep + 1} {language === "en" ? "of" : "de"} {WIZARD_INDICATORS.length}: {simple.name}
                </>
              ) : (
                language === "en" ? "Today's checkup complete!" : "¡Chequeo de hoy completado!"
              )}
            </h3>
          </div>

          <button
            onClick={handleFinishAndClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de progreso suave con gradiente violeta a cian */}
        {!isFinished && (
          <div className="w-full bg-black/40 h-1.5">
            <div
              className="bg-gradient-to-r from-[#9975ff] to-[#66d8d1] h-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / WIZARD_INDICATORS.length) * 100}%`,
              }}
            />
          </div>
        )}

        {/* PANTALLA PASO A PASO */}
        {!isFinished ? (
          <div className="p-6 space-y-5">
            {/* Cómo medirlo en palabras sencillas */}
            <div className="p-4 rounded-2xl glass-panel border border-white/10 text-xs">
              <span className="text-[11px] font-semibold text-[#bca6ff] block mb-1">
                {language === "en" ? "HOW TO MEASURE ON BOARD:" : "¿CÓMO MEDIRLO A BORDO?:"}
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">{simple.howToMeasure}</p>
            </div>

            {/* Campo de entrada numérica */}
            <div className="space-y-2.5">
              <label className="text-xs font-medium text-slate-300 block">
                {language === "en" ? `Enter today's reading (${def.unit}):` : `Ingresa tu lectura de hoy (${def.unit}):`}
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="any"
                  value={inputValue !== "" ? inputValue : currentVal ?? ""}
                  placeholder={language === "en" ? `Typical baseline: ${baseline.mean}` : `Ejemplo habitual: ${baseline.mean}`}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-2xl font-sans text-white focus:outline-none focus:border-[#9975ff] focus:ring-2 focus:ring-[#9975ff]/30"
                  autoFocus
                />
                <span className="text-sm font-semibold text-slate-400 min-w-[70px]">
                  {def.unit}
                </span>
              </div>

              {/* Mensaje de validación amigable */}
              {validationError ? (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{language === "en" ? "Your baseline is typically:" : "Tu valor normal suele ser:"} <strong className="text-white">{baseline.mean}</strong> {def.unit}</span>
                  <span>{language === "en" ? "Expected range:" : "Rango esperado:"} {def.inputRange.min} {language === "en" ? "to" : "a"} {def.inputRange.max}</span>
                </div>
              )}
            </div>

            {/* Consejo de omisión amigable */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl glass-panel border border-white/5 text-xs text-slate-400">
              <HelpCircle className="w-4 h-4 text-[#66d8d1] flex-shrink-0" />
              <span>
                {language === "en"
                  ? <>If you cannot take this reading today, click <strong>"Skip"</strong>. It will be logged in gray without affecting alarms.</>
                  : <>Si hoy no puedes tomar esta medida, pulsa <strong>"Omitir"</strong> y quedará registrada en gris sin alterar tus alertas.</>}
              </span>
            </div>
          </div>
        ) : (
          /* ========================================================
             PANTALLA FINAL DE RESUMEN: HOY X NORMALES, Y A VIGILAR
             ======================================================== */
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">
                {language === "en" ? "Your metrics have been logged" : "Tus datos han quedado registrados"}
              </h4>
              <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                {language === "en"
                  ? "Readings automatically evaluated against your individual baseline and spaceflight clinical standards."
                  : "Comparamos automáticamente tus lecturas con tu línea base individual y las normas de salud de vuelo espacial."}
              </p>
            </div>

            {/* Tarjeta de balance */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl glass-panel border border-emerald-500/30">
                <span className="text-[11px] text-slate-400 uppercase block font-medium">
                  {language === "en" ? "Nominal" : "Normales"}
                </span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block font-sans">{normalCount}</span>
                <span className="text-[10px] text-slate-400">{language === "en" ? "Stable vitals" : "Signos estables"}</span>
              </div>

              <div className="p-3.5 rounded-2xl glass-panel border border-amber-500/30">
                <span className="text-[11px] text-slate-400 uppercase block font-medium">
                  {language === "en" ? "To Watch" : "A vigilar"}
                </span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block font-sans">{watchCount}</span>
                <span className="text-[10px] text-slate-400">{language === "en" ? "Mild trend" : "Ligera atención"}</span>
              </div>

              <div className="p-3.5 rounded-2xl glass-panel border border-rose-500/30">
                <span className="text-[11px] text-slate-400 uppercase block font-medium">
                  {language === "en" ? "Priority" : "Prioritarios"}
                </span>
                <span className="text-2xl font-bold text-rose-400 mt-1 block font-sans">{helpCount}</span>
                <span className="text-[10px] text-slate-400">{language === "en" ? "Ground advice" : "Requieren ayuda"}</span>
              </div>
            </div>

            {/* Siguiente paso recomendado */}
            <div className="p-4 rounded-2xl glass-panel border border-[#9975ff]/30 text-xs text-slate-200">
              <strong className="text-[#bca6ff] block mb-1 font-semibold">
                {language === "en" ? "Recommended next action:" : "Siguiente paso recomendado:"}
              </strong>
              <p className="font-sans leading-relaxed">{decisionReport.primaryAction}</p>
            </div>
          </div>
        )}

        {/* Pie con botones de acción */}
        <div className="px-6 py-4.5 border-t border-white/10 bg-black/30 flex items-center justify-between">
          {!isFinished ? (
            <>
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="btn-secondary-glass flex items-center gap-1.5 px-3.5 py-2 text-xs text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === "en" ? "Back" : "Anterior"}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSkip}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {language === "en" ? "Skip step" : "Omitir este paso"}
                </button>

                <button
                  onClick={handleSaveCurrent}
                  className="btn-primary-gradient flex items-center gap-2 px-5 py-2 font-semibold text-xs cursor-pointer"
                >
                  <span>
                    {currentStep === WIZARD_INDICATORS.length - 1
                      ? language === "en"
                        ? "Finish checkup"
                        : "Completar chequeo"
                      : language === "en"
                      ? "Save & next"
                      : "Guardar y seguir"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={handleFinishAndClose}
              className="w-full py-3 btn-primary-gradient font-bold text-xs tracking-wide cursor-pointer text-center"
            >
              {language === "en" ? "View cockpit telemetry" : "Ver mi resumen en cabina"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
