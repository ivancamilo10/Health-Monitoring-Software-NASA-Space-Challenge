"use client";

import React, { useState } from "react";
import { useHealthStore } from "@/store/health-store";
import { IndicatorId, HEALTH_INDICATORS } from "@/data/indicators";
import {
  Brain,
  Eye,
  Heart,
  Activity,
  Flame,
  Shield,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
} from "lucide-react";

interface BodyZone {
  id: string;
  name: string;
  indicatorId: IndicatorId;
  icon: React.ReactNode;
  coords: { x: number; y: number }; // Porcentaje sobre la silueta anatómica
  organDescription: string;
}

const BODY_ZONES: BodyZone[] = [
  {
    id: "brain_mood",
    name: "Cerebro & Estado Psico-conductual",
    indicatorId: "mood",
    icon: <Brain className="w-4 h-4" />,
    coords: { x: 50, y: 12 },
    organDescription: "Corteza prefrontal y regulación dopaminérgica afectada por confinamiento de 3 años.",
  },
  {
    id: "eyes_sans",
    name: "Ojos & Síndrome Neuro-ocular (SANS)",
    indicatorId: "blood_pressure",
    icon: <Eye className="w-4 h-4" />,
    coords: { x: 50, y: 18 },
    organDescription: "Edema de papila y aplanamiento del globo ocular por presión intracraneal en microgravedad.",
  },
  {
    id: "heart_cardio",
    name: "Corazón & Sistema Cardiovascular",
    indicatorId: "heart_rate",
    icon: <Heart className="w-4 h-4" />,
    coords: { x: 52, y: 32 },
    organDescription: "Atrofia miocárdica adaptativa por menor carga hidrostática y arritmias por estrés.",
  },
  {
    id: "metabolism_glucose",
    name: "Metabolismo & Glucemia",
    indicatorId: "glucose",
    icon: <Activity className="w-4 h-4" />,
    coords: { x: 48, y: 45 },
    organDescription: "Resistencia transitoria a la insulina inducida por radiación y dieta espacial preservada.",
  },
  {
    id: "temp_fever",
    name: "Termorregulación ('Space Fever')",
    indicatorId: "core_temp",
    icon: <Flame className="w-4 h-4" />,
    coords: { x: 38, y: 38 },
    organDescription: "Incapacidad de disipación de calor por ausencia de corrientes convectivas de aire.",
  },
  {
    id: "sleep_circadian",
    name: "Ritmo Circadiano & Actigrafía",
    indicatorId: "sleep_hours",
    icon: <Zap className="w-4 h-4" />,
    coords: { x: 26, y: 50 },
    organDescription: "Pérdida del ciclo solar terrestre; desincronización de melatonina y descanso profundo.",
  },
  {
    id: "radiation_immune",
    name: "Médula Ósea & Radiación Cósmica",
    indicatorId: "radiation_dose",
    icon: <Shield className="w-4 h-4" />,
    coords: { x: 50, y: 62 },
    organDescription: "Dosis acumulada de neutrones y partículas solares; daño en células madre hematopoyéticas.",
  },
];

export function BodyMapInteractive() {
  const { decisionReport } = useHealthStore();
  const [selectedZoneId, setSelectedZoneId] = useState<string>("heart_cardio");

  const selectedZone = BODY_ZONES.find((z) => z.id === selectedZoneId) ?? BODY_ZONES[2];
  const evalData = decisionReport.evaluations[selectedZone.indicatorId];
  const indicatorDef = HEALTH_INDICATORS[selectedZone.indicatorId];

  const getStatusColor = (state: string) => {
    switch (state) {
      case "ESCALAR_TIERRA":
        return "#EF4444";
      case "ATENCION":
        return "#F97316";
      case "VIGILAR":
        return "#F59E0B";
      case "HABITUAL":
        return "#10B981";
      case "SIN_DATOS":
      default:
        return "#64748B";
    }
  };

  return (
    <div className="bg-space-surface border border-space-border rounded-2xl p-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
            MAPA ANATÓMICO DE TRIPULACIÓN (RETO OFICIAL NASA)
          </span>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Evaluación Fisiológica por Órganos y Sistemas
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
          Haz clic en cualquier zona anatómica
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SILUETA ANATÓMICA VECTORIAL ESPACIAL INTERACTIVA */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-64 h-[440px] bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-center p-4 shadow-inner">
            {/* Silueta Estilizada Tipo HUD de Astronauta */}
            <svg
              className="w-full h-full opacity-30 text-cyan-500"
              viewBox="0 0 200 400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {/* Cabeza / Casco */}
              <circle cx="100" cy="50" r="30" strokeDasharray="3 3" />
              <path d="M85 45 C85 35 115 35 115 45" />
              {/* Cuello y Torso */}
              <path d="M90 80 L110 80 M70 95 L130 95 L120 220 L80 220 Z" />
              {/* Extremidades Superiores */}
              <path d="M70 95 L35 160 L25 230 M130 95 L165 160 L175 230" />
              {/* Extremidades Inferiores */}
              <path d="M85 220 L75 330 L70 380 M115 220 L125 330 L130 380" />
            </svg>

            {/* Puntos Biofísicos Clicables sobre el Cuerpo */}
            {BODY_ZONES.map((zone) => {
              const zoneEval = decisionReport.evaluations[zone.indicatorId];
              const color = getStatusColor(zoneEval?.state ?? "HABITUAL");
              const isSelected = selectedZoneId === zone.id;

              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2.5 transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? "ring-4 ring-cyan-400 scale-125 z-20 shadow-xl"
                      : "hover:scale-110 z-10"
                  }`}
                  style={{
                    backgroundColor: `${color}25`,
                    borderColor: color,
                    borderWidth: "2px",
                    top: `${zone.coords.y}%`,
                    left: `${zone.coords.x}%`,
                  }}
                  title={zone.name}
                  aria-label={zone.name}
                >
                  <span style={{ color }}>{zone.icon}</span>
                  {isSelected && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selector Accesible por Teclado (Lista Equivalente) */}
          <div className="w-full mt-4 flex flex-wrap justify-center gap-1.5">
            {BODY_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`text-[10px] font-mono px-2 py-1 rounded border transition-all ${
                  selectedZoneId === zone.id
                    ? "bg-cyan-500 text-black font-bold border-cyan-400"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {zone.name.split("&")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DETALLADO DE LA ZONA ANATÓMICA SELECCIONADA */}
        <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                ZONA ANATÓMICA EVALUADA
              </span>
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                {selectedZone.icon}
                {selectedZone.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1">{selectedZone.organDescription}</p>
            </div>

            <div className="text-right">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold"
                style={{
                  backgroundColor: `${getStatusColor(evalData?.state ?? "HABITUAL")}20`,
                  color: getStatusColor(evalData?.state ?? "HABITUAL"),
                  borderColor: getStatusColor(evalData?.state ?? "HABITUAL"),
                  borderWidth: "1px",
                }}
              >
                {evalData?.stateLabel ?? "Habitual"}
              </span>
              <span className="block text-xs font-mono text-slate-400 mt-1">
                Valor: <strong>{evalData?.currentValue ?? "Sin dato"}</strong> {indicatorDef.unit}
              </span>
            </div>
          </div>

          {/* Las 4 Respuestas de Contenido Exigidas por la NASA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-cyan-400 font-bold block mb-1">1. ¿CÓMO SE MIDE EN EL ESPACIO?</span>
              <p className="text-slate-300 leading-relaxed">{indicatorDef.como_medir}</p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-amber-400 font-bold block mb-1">2. ¿POR QUÉ ES VITAL ESTE EXAMEN?</span>
              <p className="text-slate-300 leading-relaxed">{indicatorDef.por_que_importa}</p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-orange-400 font-bold block mb-1">3. PELIGRO HRP ASOCIADO</span>
              <p className="text-slate-300 leading-relaxed">{indicatorDef.peligro_asociado}</p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-red-400 font-bold block mb-1">4. ¿CUÁNDO ESCALAR A TIERRA?</span>
              <p className="text-slate-300 leading-relaxed">{indicatorDef.cuando_escalar}</p>
            </div>
          </div>

          {/* ACCIONES PREVENTIVAS / DE MEJORA (Sin fármacos ni dosis) */}
          <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-lg">
            <span className="text-xs font-mono font-bold text-cyan-300 block mb-1.5">
              // ACCIONES RECOMENDADAS PARA EL ASTRONAUTA A BORDO:
            </span>
            <ul className="list-disc list-inside space-y-1 text-xs font-mono text-slate-200">
              {indicatorDef.acciones.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </div>

          {/* FUENTE CIENTÍFICA */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900">
            <span>Fuente: {indicatorDef.fuenteReferencia}</span>
            <span className="text-amber-400">{indicatorDef.statusVerificacion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
