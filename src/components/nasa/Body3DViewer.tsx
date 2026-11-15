"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useHealthStore } from "@/store/health-store";
import { IndicatorId, HEALTH_INDICATORS } from "@/data/indicators";
import { EvaluationState } from "@/core/rules";
import {
  Brain,
  Eye,
  Heart,
  Thermometer,
  Zap,
  Radio,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

interface Body3DViewerProps {
  selectedIndicatorId: IndicatorId;
  onSelectIndicator: (id: IndicatorId) => void;
}

interface AnatomicalNode {
  id: IndicatorId;
  name: string;
  category: string;
  coords: { x: number; y: number }; // Posición relativa en porcentaje sobre la silueta del astronauta
  icon: React.ReactNode;
}

const ASTRONAUT_HOTSPOTS: AnatomicalNode[] = [
  {
    id: "mood",
    name: "Cerebro & Función Conductual",
    category: "Factores Humanos",
    coords: { x: 50, y: 18 },
    icon: <Brain className="w-3.5 h-3.5" />,
  },
  {
    id: "blood_pressure",
    name: "Ojos & Síndrome SANS",
    category: "Fisiología",
    coords: { x: 50, y: 28 },
    icon: <Eye className="w-3.5 h-3.5" />,
  },
  {
    id: "heart_rate",
    name: "Corazón & Miocardio",
    category: "Cardiovascular",
    coords: { x: 44, y: 52 },
    icon: <Heart className="w-3.5 h-3.5" />,
  },
  {
    id: "core_temp",
    name: "Termorregulación Central",
    category: "Homeostasis",
    coords: { x: 57, y: 52 },
    icon: <Thermometer className="w-3.5 h-3.5" />,
  },
  {
    id: "glucose",
    name: "Metabolismo & Glucemia",
    category: "Nutrición",
    coords: { x: 50, y: 67 },
    icon: <Zap className="w-3.5 h-3.5" />,
  },
  {
    id: "radiation_dose",
    name: "Médula Ósea & Radiación",
    category: "Radiación",
    coords: { x: 50, y: 84 },
    icon: <Radio className="w-3.5 h-3.5" />,
  },
];

export function Body3DViewer({
  selectedIndicatorId,
  onSelectIndicator,
}: Body3DViewerProps) {
  const { decisionReport } = useHealthStore();
  const [hoveredNodeId, setHoveredNodeId] = useState<IndicatorId | null>(null);

  const getStatusColor = (state: EvaluationState) => {
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
    <section className="flex-1 h-full relative flex flex-col items-center justify-center bg-space-950 overflow-hidden select-none">
      {/* Fondo de radar espacial sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#172033_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

      {/* Identificador de Zona de Cabina */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
          ANATOMICAL HUD // ARTEMIS EVA SUIT (HD)
        </span>
      </div>

      {/* ÁREA HÉROE: ASTRONAUTA EN ALTA DEFINICIÓN CON PUNTOS BIOFÍSICOS */}
      <div className="relative w-full max-w-[460px] h-[78%] flex items-center justify-center my-auto">
        {/* Resplandor Luminiscente de Fondo */}
        <div className="absolute w-[340px] h-[340px] rounded-full bg-accent-cyan/10 blur-3xl -z-10 pointer-events-none" />

        {/* Imagen del Astronauta HD */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/assets/astronaut-hero.png"
            alt="Astronaut Space Suit High Definition Bio-Telemetry"
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            className="object-contain drop-shadow-[0_0_35px_rgba(0,229,255,0.22)] filter contrast-[1.04] brightness-[1.02] transition-transform duration-500"
            priority
            unoptimized
          />
        </div>

        {/* HOTSPOTS ANCLADOS SOBRE LA ANATOMÍA DEL TRAJE */}
        {ASTRONAUT_HOTSPOTS.map((node) => {
          const evalData = decisionReport.evaluations[node.id];
          const state: EvaluationState = evalData?.state ?? "HABITUAL";
          const color = getStatusColor(state);
          const isSelected = selectedIndicatorId === node.id;
          const isHovered = hoveredNodeId === node.id;
          const isCritical = state === "ESCALAR_TIERRA" || state === "ATENCION";

          return (
            <div
              key={node.id}
              style={{
                top: `${node.coords.y}%`,
                left: `${node.coords.x}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
            >
              <button
                onClick={() => onSelectIndicator(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none ${
                  isSelected
                    ? "w-9 h-9 ring-4 ring-accent-cyan scale-125 z-30 shadow-2xl"
                    : "w-8 h-8 hover:scale-115 hover:ring-2 hover:ring-white/40"
                }`}
                style={{
                  backgroundColor: "#090E17fa",
                  borderColor: color,
                  borderWidth: isSelected ? "2.5px" : "2px",
                  boxShadow: `0 0 15px ${color}60`,
                }}
                title={`${node.name} (${evalData?.stateLabel ?? "Habitual"})`}
                aria-label={node.name}
              >
                <span style={{ color }}>{node.icon}</span>

                {/* ANILLO DE PULSO: SOLO en alertas de 'Atención' o 'Escalar a tierra' */}
                {isCritical && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: color }}
                  />
                )}
              </button>

              {/* Tooltip técnico flotante al pasar el cursor o seleccionar */}
              {(isSelected || isHovered) && (
                <div className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-space-900/95 border border-space-700 px-3 py-1.5 rounded-lg text-xs font-mono text-white shadow-2xl z-40 backdrop-blur-md">
                  <div className="font-bold text-accent-cyan">{node.name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                    <span className="text-slate-400">Estado:</span>
                    <strong style={{ color }}>{evalData?.stateLabel}</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BARRA INFERIOR: SELECTOR ACCESIBLE POR TECLADO */}
      <div className="absolute bottom-4 inset-x-6 z-20 flex flex-wrap justify-center gap-1.5 pointer-events-auto">
        {ASTRONAUT_HOTSPOTS.map((node) => {
          const evalData = decisionReport.evaluations[node.id];
          const color = getStatusColor(evalData?.state ?? "HABITUAL");
          const isSelected = selectedIndicatorId === node.id;

          return (
            <button
              key={node.id}
              onClick={() => onSelectIndicator(node.id)}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-accent-cyan text-space-950 font-bold border-accent-cyan shadow-sm shadow-accent-cyan/20"
                  : "bg-space-900/90 text-slate-300 border-space-800 hover:border-space-700 hover:text-white"
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>{node.name.split("&")[0]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
