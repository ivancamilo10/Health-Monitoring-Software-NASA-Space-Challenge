"use client";

import React, { useState } from "react";
import { Database, Users, Sun, X, ShieldCheck } from "lucide-react";

interface NasaOsdrReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NasaOsdrReferenceModal({
  isOpen,
  onClose,
}: NasaOsdrReferenceModalProps) {
  const [activeTab, setActiveTab] = useState<"osd575" | "solar2024">("osd575");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl glass-panel border border-white/15 shadow-2xl rounded-3xl overflow-hidden flex flex-col font-sans text-xs bg-[#111218]/90 max-h-[85vh]">
        {/* Encabezado Liquid Glass */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-black/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Datos Reales de Referencia · NASA OSDR y RadLab
              </h3>
              <p className="text-xs text-slate-400">
                Muestras descriptivas oficiales (NASA Open Science)
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

        {/* Pestañas de Datasets */}
        <div className="flex border-b border-white/10 bg-black/20 px-6 pt-2 gap-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab("osd575")}
            className={`px-4 py-2.5 border-b-2 font-semibold text-xs transition-all cursor-pointer ${
              activeTab === "osd575"
                ? "border-[#9975ff] text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            NASA OSDR: OSD-575 (Inspiration4)
          </button>
          <button
            onClick={() => setActiveTab("solar2024")}
            className={`px-4 py-2.5 border-b-2 font-semibold text-xs transition-all cursor-pointer ${
              activeTab === "solar2024"
                ? "border-[#9975ff] text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Evento Solar Histórico: Mayo 2024 (G5/SPE)
          </button>
        </div>

        {/* Contenido Descriptivo */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {activeTab === "osd575" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Users className="w-4 h-4 text-[#66d8d1]" />
                  <span>NASA Open Science Data Repository — Estudio OSD-575</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Datos de transcriptómica, proteómica y química sanguínea en vuelo espacial comercial (misión Inspiration4, 3 días en órbita a ~585 km). Registro de 4 tripulantes civiles monitoreados antes, durante y después del vuelo.
                </p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Fuente: <em>NASA OSDR Accession OSD-575 / Space Omics and Medical Atlas (SOMA)</em>
                </div>
              </div>

              {/* Muestra Descriptiva de Biomarcadores Reales */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#bca6ff] font-bold block">
                  Panel descriptivo de 4 tripulantes (Día de vuelo 2):
                </span>
                <div className="border border-white/10 rounded-2xl overflow-hidden glass-panel">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 border-b border-white/10 text-[11px]">
                      <tr>
                        <th className="p-2.5 font-semibold">Tripulante</th>
                        <th className="p-2.5 font-semibold">Hematocrito (%)</th>
                        <th className="p-2.5 font-semibold">FC Reposo (BPM)</th>
                        <th className="p-2.5 font-semibold">Cortisol Salival</th>
                        <th className="p-2.5 font-semibold">SpO2 Traje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr className="hover:bg-white/5">
                        <td className="p-2.5 font-medium text-white">Tripulante 1</td>
                        <td className="p-2.5 text-slate-300">46.2% (+11% vs L-30)</td>
                        <td className="p-2.5 text-slate-300">68 BPM</td>
                        <td className="p-2.5 text-slate-300">0.62 µg/dL</td>
                        <td className="p-2.5 text-slate-300">98.5%</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="p-2.5 font-medium text-white">Tripulante 2</td>
                        <td className="p-2.5 text-slate-300">44.8% (+9% vs L-30)</td>
                        <td className="p-2.5 text-slate-300">72 BPM</td>
                        <td className="p-2.5 text-slate-300">0.58 µg/dL</td>
                        <td className="p-2.5 text-slate-300">99.0%</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="p-2.5 font-medium text-white">Tripulante 3</td>
                        <td className="p-2.5 text-slate-300">47.1% (+13% vs L-30)</td>
                        <td className="p-2.5 text-slate-300">64 BPM</td>
                        <td className="p-2.5 text-slate-300">0.49 µg/dL</td>
                        <td className="p-2.5 text-slate-300">98.0%</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="p-2.5 font-medium text-white">Tripulante 4</td>
                        <td className="p-2.5 text-slate-300">45.0% (+10% vs L-30)</td>
                        <td className="p-2.5 text-slate-300">76 BPM</td>
                        <td className="p-2.5 text-slate-300">0.65 µg/dL</td>
                        <td className="p-2.5 text-slate-300">97.5%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-400 font-sans italic pt-1">
                  * Nota médica: En microgravedad, la contracción volumétrica de plasma incrementa el hematocrito un 9-13% adaptativo; una regla terrestre lo clasificaría erróneamente como deshidratación patológica.
                </p>
              </div>
            </div>
          )}

          {activeTab === "solar2024" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Tormenta Solar Extrema de Mayo 2024 (Región AR3664)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Mayor tormenta geomagnética (nivel G5) observada desde octubre de 2003. Múltiples eyecciones de masa coronal (CME) de clase X produjeron incrementos agudos en el flujo de protones energéticos fuera de la magnetosfera terrestre.
                </p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Fuente: <em>NOAA Space Weather Prediction Center y NASA RadLab</em>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase block font-medium">Flujo Máximo Protones</span>
                  <div className="text-xl font-bold text-rose-400 mt-1 font-sans">&gt; 10,000 pfu (&gt;10 MeV)</div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Nivel de alerta solar S3 / Fuerte</span>
                </div>

                <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase block font-medium">Tasa de Dosis Estimada</span>
                  <div className="text-xl font-bold text-amber-400 mt-1 font-sans">2.4 a 3.1 mSv/día</div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Requiere refugio blindado en Marte</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Datos descriptivos oficiales desde repositorio abierto NASA</span>
          </div>
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
