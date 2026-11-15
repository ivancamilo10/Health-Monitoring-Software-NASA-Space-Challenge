"use client";

import React from "react";
import { IndicatorId, HEALTH_INDICATORS } from "@/data/indicators";
import { BookOpen, CheckCircle2, AlertOctagon, X, ExternalLink, ShieldCheck } from "lucide-react";

interface ScientificEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScientificEvidenceModal({
  isOpen,
  onClose,
}: ScientificEvidenceModalProps) {
  if (!isOpen) return null;

  const indicatorKeys = Object.keys(HEALTH_INDICATORS) as IndicatorId[];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-3xl glass-panel border border-white/15 shadow-2xl rounded-3xl overflow-hidden flex flex-col font-sans text-xs bg-[#111218]/90 max-h-[85vh]">
        {/* Encabezado Liquid Glass */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-black/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#9975ff]/20 border border-[#9975ff]/30 flex items-center justify-center text-[#bca6ff]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Evidencia Científica y Transparencia
              </h3>
              <p className="text-xs text-slate-400">
                Clasificación de fuentes, rigor metodológico y límites clínicos
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

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* SECCIÓN: QUÉ HACE Y QUÉ NO HACE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Qué hace Mins-Health</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-xs">
                <li>Compara lecturas diarias con la <strong>línea base individualizada</strong> del astronauta (L-30).</li>
                <li>Monitorea 7 biomarcadores esenciales en tiempo real en misiones de exploración.</li>
                <li>Distingue variaciones estadísticas leves de umbrales clínicos absolutos.</li>
                <li>Detecta sinergias entre los 5 peligros espaciales de NASA (RIDGE).</li>
                <li>Funciona 100% autónomo y local-first sin depender de internet a Tierra.</li>
                <li>Genera reportes médicos estructurados en formato estándar SBAR.</li>
              </ul>
            </div>

            <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4" />
                <span>Qué no hace (Límites éticos)</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-xs">
                <li><strong>No emite diagnósticos médicos definitivos</strong>: el software es un sistema de soporte y alerta temprana.</li>
                <li><strong>No prescribe medicamentos de forma autónoma</strong>: sugiere acciones no invasivas del botiquín estándar de la misión.</li>
                <li><strong>No reemplaza al cirujano de vuelo</strong>: cuando se cruza un umbral crítico, el sistema instruye escalar la decisión a Tierra.</li>
                <li><strong>No toma decisiones operativas de vuelo</strong>: no cancela paseos espaciales (EVAs) ni desvía trayectorias de navegación.</li>
              </ul>
            </div>
          </div>

          {/* TABLA DE TRANSPARENCIA CIENTÍFICA */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#66d8d1]" />
              <span>Matriz de Indicadores y Fuentes Oficiales</span>
            </h4>

            <div className="border border-white/10 rounded-2xl overflow-hidden glass-panel">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-300">
                    <th className="p-2.5 font-semibold">Indicador</th>
                    <th className="p-2.5 font-semibold">Unidad</th>
                    <th className="p-2.5 font-semibold">Tipo de Norma</th>
                    <th className="p-2.5 font-semibold">Fuente Oficial</th>
                    <th className="p-2.5 font-semibold">Peligro NASA HRP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {indicatorKeys.map((key) => {
                    const item = HEALTH_INDICATORS[key];
                    return (
                      <tr key={key} className="hover:bg-white/5 transition-colors">
                        <td className="p-2.5 font-medium text-white">{item.name}</td>
                        <td className="p-2.5 text-slate-400">{item.unit}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.isProvisional
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {item.isProvisional ? "Provisional de vuelo" : "Norma clínica NASA"}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400 truncate max-w-[200px]" title={item.fuenteReferencia}>
                          {item.fuenteReferencia}
                        </td>
                        <td className="p-2.5 text-slate-400">{item.fondoHazard}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 bg-black/30 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="btn-primary-gradient px-5 py-2 font-semibold text-xs cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
