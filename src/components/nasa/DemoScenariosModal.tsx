"use client";

import React from "react";
import { useHealthStore } from "@/store/health-store";
import { X, Sparkles, AlertOctagon, CheckCircle2, Moon, HelpCircle } from "lucide-react";

interface DemoScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoScenariosModal({ isOpen, onClose }: DemoScenariosModalProps) {
  const { loadDemoScenario } = useHealthStore();

  if (!isOpen) return null;

  const handleSelect = (sc: "RUTINA_NORMAL" | "TORMENTA_SOLAR" | "FUGA_DE_TRAJE" | "AISLAMIENTO_PROLONGADO" | "SIN_DATOS") => {
    loadDemoScenario(sc);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel border border-white/15 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200 bg-[#111218]/90">
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Simular situaciones de vuelo
              </h3>
              <p className="text-xs text-slate-400">
                Demostración clínica para el jurado NASA Space Apps
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

        <div className="p-6 space-y-3 font-sans">
          {/* 1. RUTINA NORMAL */}
          <button
            onClick={() => handleSelect("RUTINA_NORMAL")}
            className="w-full p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 hover:border-emerald-500/50 text-left transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Rutina normal de vuelo (Estable)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Casi todos los signos en Normal y sueño en Vigilar (6.4 h). Sin alarmas críticas.
            </p>
          </button>

          {/* 2. TORMENTA SOLAR */}
          <button
            onClick={() => handleSelect("TORMENTA_SOLAR")}
            className="w-full p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 hover:border-rose-500/50 text-left transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-1">
              <AlertOctagon className="w-4 h-4" />
              <span>2. Tormenta solar aguda (SPE) - Multiórgano Crítico</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Radiación 3400 µSv/día, fiebre central 39.1 °C ("Space Fever"), presión 168 mmHg y taquicardia 126 BPM. Alerta unificada de refugio.
            </p>
          </button>

          {/* 3. FUGA DE TRAJE EVA */}
          <button
            onClick={() => handleSelect("FUGA_DE_TRAJE")}
            className="w-full p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 hover:border-red-500/50 text-left transition-all cursor-pointer bg-rose-500/5"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-1">
              <AlertOctagon className="w-4 h-4 animate-pulse" />
              <span>3. Fuga de traje espacial (EVA) - Despresurización</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Presión cae en shock a 76 mmHg, pulso salta a 152 BPM por hipoxia y temperatura corporal desciende a 34.6 °C por pérdida térmica en vacío.
            </p>
          </button>

          {/* 4. AISLAMIENTO PROLONGADO */}
          <button
            onClick={() => handleSelect("AISLAMIENTO_PROLONGADO")}
            className="w-full p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 hover:border-orange-500/50 text-left transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 mb-1">
              <Moon className="w-4 h-4" />
              <span>4. Aislamiento prolongado (Sueño 3.2 h & Ánimo 1/5)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Desincronización circadiana por distancia a la Tierra. Activa patrón de fatiga y confinamiento.
            </p>
          </button>

          {/* 5. INTEGRIDAD: SIN DATOS */}
          <button
            onClick={() => handleSelect("SIN_DATOS")}
            className="w-full p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 hover:border-cyan-500/50 text-left transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-1">
              <HelpCircle className="w-4 h-4 text-[#66d8d1]" />
              <span>5. Integridad de telemetría (Dato faltante = Gris)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Demuestra que un sensor desconectado se cataloga como Sin Datos y no engaña al sistema.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
