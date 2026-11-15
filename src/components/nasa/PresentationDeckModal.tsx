"use client";

import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Presentation,
  Sparkles,
  Layers,
  Heart,
  Database,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { useHealthStore } from "@/store/health-store";
import { getTexts } from "@/data/i18n";

interface PresentationDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SlideContent {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export function PresentationDeckModal({ isOpen, onClose }: PresentationDeckModalProps) {
  const { language } = useHealthStore();
  const texts = getTexts(language);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  if (!isOpen) return null;

  const slides: SlideContent[] = [
    {
      id: 1,
      badge: language === "en" ? "Official Challenge Pitch" : "Desafío Oficial NASA Space Apps 2026",
      title: "MINS-HEALTH",
      subtitle:
        language === "en"
          ? "Autonomous Bio-Astronautics & Health Monitoring System for Deep Space Expeditions"
          : "Sistema Autónomo de Monitorización Bioclínica y Telemetría de Astronautas",
      content: (
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            {language === "en"
              ? "Designed for multi-month lunar stays (Artemis III/IV) and interplanetary Mars transit. 100% offline-first architecture with 3D anatomical digital twin and NASA-STD-3001 clinical reasoning."
              : "Diseñado para expediciones lunares de larga duración (Artemis III/IV) y tránsito interplanetario a Marte. 100% autónomo, arquitectura offline-first con gemelo digital 3D y razonamiento médico basado en NASA-STD-3001."}
          </p>
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <span className="px-3 py-1 rounded-full bg-[#9975ff]/20 text-[#bca6ff] text-xs font-semibold border border-[#9975ff]/30">
              Mins Solutions TI
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/20">
              Next.js 15 & React 19
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
              NASA OSDR Inspiration4
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
              Three.js 3D WebGL
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: language === "en" ? "Deep Space Challenge" : "El Problema en Espacio Profundo",
      title: language === "en" ? "Why Telemedicine Fails Beyond Low Earth Orbit" : "Por qué la Telemedicina Falla Más Allá de la Órbita Baja",
      subtitle:
        language === "en"
          ? "Communication Latency, High-Energy Radiation & Cephalad Fluid Shift"
          : "Latencia de Comunicación, Radiación Ionizante y Desplazamiento Cefálico de Fluidos",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="glass-panel p-4 rounded-xl border border-rose-500/30 text-left">
            <div className="text-2xl font-mono font-bold text-rose-400">~20 min</div>
            <div className="text-xs font-bold text-slate-300 uppercase mt-1">Latencia DSN en Marte</div>
            <p className="text-xs text-slate-400 mt-2">
              En emergencias agudas (tormenta solar SPE, taquiarritmia o microfuga), una consulta a Houston tarda hasta 40 minutos en ida y vuelta.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-amber-500/30 text-left">
            <div className="text-2xl font-mono font-bold text-amber-400">3x Sinergias</div>
            <div className="text-xs font-bold text-slate-300 uppercase mt-1">Riesgos Combinados HRP</div>
            <p className="text-xs text-slate-400 mt-2">
              La radiación ionizante más el déficit de sueño altera la reparación del ADN y dispara taquicardia refleja que un algoritmo terrestre ignora.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 text-left">
            <div className="text-2xl font-mono font-bold text-emerald-400">100% Offline</div>
            <div className="text-xs font-bold text-slate-300 uppercase mt-1">Autonomía Total en Borde</div>
            <p className="text-xs text-slate-400 mt-2">
              Toda la inferencia médica y algoritmos corren localmente en la tableta del astronauta sin depender de servidores terrestres.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: language === "en" ? "Interface Architecture" : "Arquitectura de Cabina",
      title: language === "en" ? "High Information Density: 3-Zone Cockpit" : "Cockpit de 3 Zonas sin Desplazamiento Global",
      subtitle: language === "en" ? "Linear / Stripe Aerospace High-Contrast Aesthetic" : "Diseño Aeroespacial de Alto Contraste Inspirado en Linear y Stripe",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-[#bca6ff] flex items-center justify-center text-xs font-bold">1</span>
              <span>¿Cómo estoy?</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Telemetría viva Bento con trazado SVG dinámico a 60 FPS, micro-jitter fisiológico y bandas de rango normal personalizadas por astronauta.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-purple-500/40">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#9975ff] text-white flex items-center justify-center text-xs font-bold">2</span>
              <span>¿Dónde? (Gemelo 3D)</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Esqueleto humano real 3D (BodyParts3D), corazón sistólico con pulso vivo, arco aórtico, coronarias y visor central 100% despejado.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">3</span>
              <span>¿Qué hago? (Triage)</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Motor clínico basado en NASA-STD-3001, recomendaciones en lenguaje claro y generación de reporte de traspaso SBAR con firma CRC32.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      badge: language === "en" ? "Scientific Basis" : "Evidencia Científica Real",
      title: language === "en" ? "NASA OSDR OSD-575 & Clinical Flight Rules" : "NASA Open Science Data Repository (Inspiration4)",
      subtitle: language === "en" ? "Grounded on Space Omics and Medical Atlas (SOMA) Data" : "Fundamentado en Datos Reales de Transcriptómica y Hematología Espacial",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="text-xs font-bold text-[#66d8d1] uppercase">Estudio OSD-575 (Inspiration4)</div>
            <div className="text-sm font-semibold text-white mt-1">Contracción Plasmática y Hematocrito Adaptativo</div>
            <div className="mt-2 text-xs font-mono bg-black/40 p-2.5 rounded-lg text-slate-300 space-y-1">
              <div>Tripulante 1: Hct 46.2% (+11% vs L-30)</div>
              <div>Tripulante 2: Hct 44.8% (+9% vs L-30)</div>
              <div>Tripulante 3: Hct 47.1% (+13% vs L-30)</div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              El software integra este factor para no confundir la hemoconcentración microgravitatoria adaptativa con deshidratación patológica.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="text-xs font-bold text-[#bca6ff] uppercase">Estándares NASA Implementados</div>
            <div className="text-sm font-semibold text-white mt-1">NASA-STD-3001 & HRP Hazards</div>
            <ul className="mt-2 text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li>Límite de carrera de radiación: 600 mSv (NASA REID standard).</li>
              <li>Test de Vigilancia Psicomotora (NASA PVT) para reflejos y fatiga.</li>
              <li>Fiebre espacial: termorregulación sin convección natural.</li>
              <li>Sindrome neuro-ocular asociado al vuelo espacial (SANS).</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      badge: language === "en" ? "Evaluation Ready" : "Herramientas para Jurados",
      title: language === "en" ? "1-Click Contingency Suite & Real DSN Telemetry" : "Simulación de Contingencias y Telemetría DSN",
      subtitle: language === "en" ? "Built for Live Demos in Front of NASA Space Apps Judges" : "Diseñado para Demostraciones Interactivas en Vivo",
      content: (
        <div className="space-y-3 text-left">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
              <strong className="text-rose-300 block">Tormenta Solar SPE</strong>
              <span className="text-[11px] text-slate-400">Fiebre 39.1°C, TA 168, radiación 120 µSv/h.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
              <strong className="text-amber-300 block">Fuga EVA</strong>
              <span className="text-[11px] text-slate-400">Taquicardia 126 BPM, caída glucosa.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs">
              <strong className="text-purple-300 block">Aislamiento Severo</strong>
              <span className="text-[11px] text-slate-400">Sueño &lt; 4.5h, fatiga cognitiva alta.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <strong className="text-emerald-300 block">Rutina Nominal</strong>
              <span className="text-[11px] text-slate-400">Restablece telemetría en calma.</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-white font-semibold">Simulador de Latencia DSN:</span>
              <span className="text-slate-300">ISS (24 ms) · Luna Gateway (~1.3 s) · Marte (~20 min)</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono font-bold">100% Verificado</div>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0e0f16] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#9975ff]/20 border border-[#9975ff]/40 flex items-center justify-center text-[#bca6ff]">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Diapositivas de Presentación · NASA Space Apps 2026</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                  {currentSlide + 1} / {slides.length}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Reveal.js Open Source Deck · Mins Solutions TI
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/presentation/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
              title="Abrir presentación completa en pantalla completa Reveal.js"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo Pantalla Completa</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto flex flex-col justify-center items-center text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-[#9975ff]/15 border border-[#9975ff]/30 text-xs font-semibold text-[#bca6ff] mb-3">
            {current.badge}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-1">
            {current.title}
          </h2>
          <h3 className="text-sm md:text-base font-medium text-[#66d8d1] mb-6">
            {current.subtitle}
          </h3>

          <div className="w-full">
            {current.content}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between bg-black/40">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentSlide === 0
                ? "opacity-30 cursor-not-allowed bg-white/5 text-slate-500"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {/* Slide dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? "w-7 bg-[#9975ff] shadow-sm shadow-purple-500/50"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                title={`Ir a diapositiva ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentSlide === slides.length - 1
                ? "opacity-30 cursor-not-allowed bg-white/5 text-slate-500"
                : "btn-primary-gradient text-white"
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
