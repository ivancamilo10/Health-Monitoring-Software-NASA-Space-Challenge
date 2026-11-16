"use client";

import React from "react";
import { useHealthStore } from "@/store/health-store";
import { IndicatorId } from "@/data/indicators";
import { EvaluationState, TYPICAL_ENVIRONMENT_RADIATION } from "@/core/rules";
import { getSimpleIndicators, getTexts } from "@/data/i18n";
import { LiveBiometricWaveform } from "@/components/nasa/LiveBiometricWaveform";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  HelpCircle,
  Activity,
  Heart,
  Thermometer,
  Moon,
  Smile,
  Zap,
  Radio,
  Sparkles,
} from "lucide-react";

interface BentoTelemetryRailProps {
  selectedIndicatorId: IndicatorId;
  onSelectIndicator: (id: IndicatorId) => void;
}

export function BentoTelemetryRail({
  selectedIndicatorId,
  onSelectIndicator,
}: BentoTelemetryRailProps) {
  const {
    decisionReport,
    currentReadings,
    baselines,
    mission,
    careerRadiationAccumulatedMilliSv,
    careerRadiationLimitMilliSv,
    language,
  } = useHealthStore();

  const texts = getTexts(language);
  const simpleIndicators = getSimpleIndicators(language);

  const getStatusInfo = (state: EvaluationState) => {
    switch (state) {
      case "ESCALAR_TIERRA":
        return {
          label: texts.legendHelp,
          color: "#f43f5e",
          bgColor: "rgba(244, 63, 94, 0.12)",
          borderColor: "rgba(244, 63, 94, 0.4)",
          icon: <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" />,
        };
      case "ATENCION":
        return {
          label: texts.legendAttention,
          color: "#f97316",
          bgColor: "rgba(249, 115, 22, 0.12)",
          borderColor: "rgba(249, 115, 22, 0.4)",
          icon: <ShieldAlert className="w-4 h-4 text-orange-500" />,
        };
      case "VIGILAR":
        return {
          label: texts.legendWatch,
          color: "#f59e0b",
          bgColor: "rgba(245, 158, 11, 0.12)",
          borderColor: "rgba(245, 158, 11, 0.35)",
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        };
      case "HABITUAL":
        return {
          label: texts.legendNormal,
          color: "#10b981",
          bgColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 0.3)",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        };
      case "SIN_DATOS":
      default:
        return {
          label: texts.noDataYet,
          color: "#94a3b8",
          bgColor: "rgba(148, 163, 184, 0.08)",
          borderColor: "rgba(148, 163, 184, 0.2)",
          icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
        };
    }
  };

  const getIndicatorIcon = (id: IndicatorId) => {
    switch (id) {
      case "blood_pressure":
        return <Activity className="w-4 h-4 text-[#66d8d1]" />;
      case "heart_rate":
        return <Heart className="w-4 h-4 text-[#f43f5e]" />;
      case "glucose":
        return <Zap className="w-4 h-4 text-[#f59e0b]" />;
      case "core_temp":
        return <Thermometer className="w-4 h-4 text-[#9975ff]" />;
      case "sleep_hours":
        return <Moon className="w-4 h-4 text-[#818cf8]" />;
      case "mood":
        return <Smile className="w-4 h-4 text-[#ec4899]" />;
      default:
        return <Activity className="w-4 h-4 text-[#66d8d1]" />;
    }
  };

  // Renderiza sparkline suave con gradiente bajo la curva
  const renderSparklineWithRange = (
    val: number | null,
    mean: number,
    sd: number,
    state: EvaluationState,
    isHeartRate = false,
    gradientId = "sparkline-grad"
  ) => {
    if (val === null) {
      return (
        <div className="w-full h-7 flex items-center justify-center text-[11px] text-slate-500">
          {texts.noDataYet}
        </div>
      );
    }

    const info = getStatusInfo(state);
    const strokeColor = info.color;

    return (
      <div className="w-full h-8 flex flex-col justify-end overflow-hidden" title="Evolución reciente con franja normal">
        <svg viewBox="0 0 100 28" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Franja de normalidad personal */}
          <rect x="0" y="7" width="100" height="14" rx="4" fill="rgba(255, 255, 255, 0.03)" />
          <line x1="0" y1="14" x2="100" y2="14" stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" strokeWidth="1" />

          {/* Curva suave */}
          {isHeartRate ? (
            <path
              d="M0 14 L18 14 L24 10 L28 18 L34 14 L44 14 L49 4 L54 24 L59 9 L64 16 L70 14 L100 14"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <>
              <path
                d={`M0 16 Q25 ${14 - (val - mean) * 0.4} 50 14 T96 ${14 - (val - mean) * 0.8} L96 28 L0 28 Z`}
                fill={`url(#${gradientId})`}
              />
              <path
                d={`M0 16 Q25 ${14 - (val - mean) * 0.4} 50 14 T96 ${14 - (val - mean) * 0.8}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle
                cx="96"
                cy={Math.max(4, Math.min(24, 14 - (val - mean) * 0.8))}
                r="3"
                fill={strokeColor}
              />
            </>
          )}
        </svg>
      </div>
    );
  };

  const primarySixIndicators: IndicatorId[] = [
    "blood_pressure",
    "heart_rate",
    "glucose",
    "core_temp",
    "sleep_hours",
    "mood",
  ];

  const overall = getStatusInfo(decisionReport.overallState);
  const radiationEval = decisionReport.evaluations.radiation_dose;
  const radiationVal = currentReadings.radiation_dose;
  const radiationStatus = getStatusInfo(radiationEval.state);
  const envTypical = TYPICAL_ENVIRONMENT_RADIATION[mission];
  const careerPercent = ((careerRadiationAccumulatedMilliSv / careerRadiationLimitMilliSv) * 100).toFixed(1);

  // Garantiza que el consejo prioritario refleje siempre el idioma actual incluso si proviene de una caché previa
  const displayPrimaryAction = React.useMemo(() => {
    if (language === "en") {
      if (decisionReport.primaryAction.includes("Vigilancia preventiva")) {
        const vigilarEval = Object.values(decisionReport.evaluations).find((e) => e.state === "VIGILAR");
        const indName = vigilarEval ? simpleIndicators[vigilarEval.indicatorId]?.name : "Sleep & rest";
        return `Preventive watch: mild variation in ${indName}. Maintain regular hydration and monitoring.`;
      }
      if (decisionReport.primaryAction.includes("Todos los indicadores fisiológicos")) {
        return "All physiological indicators in nominal flight balance. Continue mission timeline.";
      }
      if (decisionReport.primaryAction.includes("Revisión clínica prioritaria")) {
        return "Priority clinical review with flight surgeon in Houston.";
      }
      if (decisionReport.primaryAction.includes("Notificar a la tripulación")) {
        return "Notify crew for medical monitoring.";
      }
      if (decisionReport.primaryAction.includes("Alerta de radiación")) {
        return "Radiation alert: consult flight surgeon and initiate mission shelter protocol.";
      }
    }
    return decisionReport.primaryAction;
  }, [decisionReport.primaryAction, language, simpleIndicators, decisionReport.evaluations]);

  return (
    <aside className="w-full md:w-[400px] xl:w-[440px] h-full flex flex-col justify-between gap-3 p-4 bg-[#0c0d12]/95 backdrop-blur-xl border-r border-white/10 overflow-y-auto flex-shrink-0 z-20 select-none">
      {/* ========================================================
          PREGUNTA 1: ¿CÓMO ESTOY? - ESTADO GLOBAL EN LENGUAJE SIMPLE
          ======================================================== */}
      <div
        className="p-4 rounded-2xl border transition-all duration-200 shadow-lg"
        style={{
          backgroundColor: overall.bgColor,
          borderColor: overall.borderColor,
          boxShadow: `0 8px 24px ${overall.color}20`,
        }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {texts.zoneLeftTitle}
            </h2>
            <span className="text-xs text-slate-300 font-medium">· {texts.howIsAstronautToday}</span>
          </div>
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10"
            style={{ color: overall.color }}
          >
            {overall.icon}
            <span>{overall.label}</span>
          </span>
        </div>

        {/* Patrón sistémico en lenguaje claro si hay varias desviaciones a la vez */}
        {decisionReport.isSystemicPattern && decisionReport.patternTitle && (
          <div className="mb-2.5 p-3 rounded-xl bg-orange-950/40 border border-orange-500/40 text-xs text-orange-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-semibold">{texts.systemicPatternTitle}</strong>
              <p className="text-xs text-slate-300 mt-0.5">{decisionReport.patternTitle}</p>
            </div>
          </div>
        )}

        {/* Acción recomendada en palabras cotidianas */}
        <div className="text-sm text-slate-100 font-sans leading-relaxed">
          <strong className="text-white font-semibold">
            {language === "en" ? "Priority Advice: " : "Consejo prioritario: "}
          </strong>
          {displayPrimaryAction}
        </div>
      </div>

      {/* ========================================================
          MOSAICOS DE LOS 6 INDICADORES (NOMBRES SIMPLES, NÚMERO GRANDE, GRÁFICA)
          ======================================================== */}
      <div className="grid grid-cols-2 gap-3 my-auto">
        {primarySixIndicators.map((id, index) => {
          const simple = simpleIndicators[id];
          const val = currentReadings[id];
          const baseline = baselines[id];
          const evaluation = decisionReport.evaluations[id];
          const isSelected = selectedIndicatorId === id;
          const status = getStatusInfo(evaluation.state);

          const diffFromMean = val !== null ? val - baseline.mean : 0;
          const diffSign = diffFromMean >= 0 ? "+" : "";

          const isCritical = evaluation.state === "ESCALAR_TIERRA";
          const isAttention = evaluation.state === "ATENCION";

          return (
            <button
              key={id}
              onClick={() => onSelectIndicator(id)}
              className={`p-3.5 rounded-2xl text-left transition-all duration-200 relative flex flex-col justify-between h-[152px] focus:outline-none cursor-pointer ${
                isSelected
                  ? "bg-[#171822] border-2 border-[#9975ff] shadow-xl shadow-purple-500/25 ring-2 ring-[#9975ff]/30 scale-[1.02]"
                  : isCritical
                  ? "bg-rose-950/20 border-2 border-rose-500/70 shadow-lg shadow-rose-950/40"
                  : isAttention
                  ? "bg-orange-950/20 border-2 border-orange-500/60 shadow-lg shadow-orange-950/30"
                  : "glass-panel glass-panel-hover"
              }`}
            >
              {/* Título simple e icono de zona */}
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-slate-100 truncate pr-1">
                  {simple.name}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {getIndicatorIcon(id)}
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: status.color,
                      boxShadow: `0 0 8px ${status.color}`,
                    }}
                  />
                </div>
              </div>

              {/* Número grande con unidad pequeña al lado */}
              <div className="my-0.5">
                {val !== null ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
                      {val}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">
                      {id === "blood_pressure" ? "mmHg" : id === "heart_rate" ? "BPM" : id === "glucose" ? "mg/dL" : id === "core_temp" ? "°C" : id === "sleep_hours" ? "h" : "/5"}
                    </span>
                  </div>
                ) : (
                  <span className="text-base font-medium text-slate-400 leading-none">
                    Sin datos
                  </span>
                )}

                {/* Comparación amigable con tu valor normal */}
                <div className="text-xs mt-1 truncate flex items-center gap-1">
                  <span className="font-bold" style={{ color: status.color }}>
                    {status.label}
                  </span>
                  {val !== null && (
                    <span className="text-slate-300 text-[11px] font-medium">
                      ({diffSign}{diffFromMean.toFixed(1)} {language === "en" ? "vs baseline" : "vs normal"})
                    </span>
                  )}
                </div>
              </div>

              {/* Onda biométrica continua dinámica en tiempo real (60 FPS) */}
              <LiveBiometricWaveform
                id={id}
                val={val}
                mean={baseline.mean}
                sd={baseline.standardDeviation}
                state={evaluation.state}
                color={status.color}
              />
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TARJETA DE RADIACIÓN DEL ESPACIO (COMPARATIVA AMIGABLE)
          ======================================================== */}
      <div
        onClick={() => onSelectIndicator("radiation_dose")}
        className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
          selectedIndicatorId === "radiation_dose"
            ? "bg-[#171822] border-2 border-[#9975ff] ring-2 ring-[#9975ff]/30 shadow-xl shadow-purple-500/25"
            : "glass-panel glass-panel-hover"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#66d8d1]" />
            <span className="text-sm font-bold text-white">
              {simpleIndicators.radiation_dose.name}
            </span>
          </div>
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10"
            style={{ color: radiationStatus.color }}
          >
            {radiationStatus.icon}
            <span>{radiationStatus.label}</span>
          </span>
        </div>

        {/* Tasa del día comparada con el entorno */}
        <div className="flex items-baseline justify-between mb-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-sans tracking-tight">
              {radiationVal !== null ? radiationVal : (language === "en" ? "No data" : "Sin datos")}
            </span>
            <span className="text-sm text-slate-300 font-semibold">
              {language === "en" ? "µSv today" : "µSv hoy"}
            </span>
          </div>
          <span className="text-xs text-slate-300 font-medium">
            {language === "en"
              ? `Typical in ${mission === "ISS" ? "ISS" : mission === "LUNA" ? "Moon" : "Mars"}: ~${envTypical.typicalDailyMicroSv} µSv`
              : `Típico en ${mission}: ~${envTypical.typicalDailyMicroSv} µSv`}
          </span>
        </div>

        {/* Barra de progreso de carrera espacial */}
        <div className="pt-2.5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-200 mb-1.5 font-medium">
            <span>
              {language === "en" ? "Accumulated dose: " : "Dosis acumulada: "}
              <strong className="text-white font-bold">{careerRadiationAccumulatedMilliSv}</strong>{" "}
              {language === "en" ? "of" : "de"} {careerRadiationLimitMilliSv} mSv
            </span>
            <span className="text-[#66d8d1] font-bold text-sm">{careerPercent}%</span>
          </div>
          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9975ff] to-[#66d8d1] transition-all duration-500 shadow-sm shadow-[#66d8d1]/50"
              style={{ width: `${careerPercent}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
