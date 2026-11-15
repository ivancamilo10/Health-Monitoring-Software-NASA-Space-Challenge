"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useHealthStore, ARTEMIS_CREW_ROSTER } from "@/store/health-store";
import { MISSIONS_CONFIG, MissionDestination } from "@/core/missions";
import { getTexts } from "@/data/i18n";
import {
  WifiOff,
  AlertCircle,
  ClipboardList,
  ChevronDown,
  Sparkles,
  Zap,
  Database,
  BookOpen,
  RotateCcw,
  Clock,
  Radio,
  Volume2,
  VolumeX,
  Users,
  Presentation,
  Globe,
} from "lucide-react";

interface HeaderBarProps {
  onOpenCheckupWizard: () => void;
  onOpenDemoMenu: () => void;
  onOpenPvtModal: () => void;
  onOpenOsdrModal: () => void;
  onOpenEvidenceModal: () => void;
  onOpenPitchDemoModal: () => void;
  onOpenWelcomeTour: () => void;
  onOpenPresentationModal?: () => void;
}

export function HeaderBar({
  onOpenCheckupWizard,
  onOpenDemoMenu,
  onOpenPvtModal,
  onOpenOsdrModal,
  onOpenEvidenceModal,
  onOpenPitchDemoModal,
  onOpenWelcomeTour,
  onOpenPresentationModal,
}: HeaderBarProps) {
  const {
    mission,
    setMission,
    commsCountdownSeconds,
    selectedCrewId,
    selectCrewMember,
    isAudioMuted,
    toggleAudio,
    openDsnModal,
    language,
    setLanguage,
  } = useHealthStore();

  const texts = getTexts(language);

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isCrewMenuOpen, setIsCrewMenuOpen] = useState<boolean>(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const crewMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
      if (crewMenuRef.current && !crewMenuRef.current.contains(event.target as Node)) {
        setIsCrewMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCrewMember =
    ARTEMIS_CREW_ROSTER.find((c) => c.id === selectedCrewId) || ARTEMIS_CREW_ROSTER[0];

  // Jitter dinámico de telemetría DSN en tiempo real
  const [telemetryJitter, setTelemetryJitter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryJitter((Math.random() - 0.5) * 0.06);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const delayDisplay =
    commsCountdownSeconds !== null
      ? `${Math.floor(commsCountdownSeconds / 60)} min ${commsCountdownSeconds % 60} s`
      : mission === "ISS"
      ? "24 ms (En vivo)"
      : mission === "LUNA"
      ? `~${(1.28 + telemetryJitter).toFixed(2)} s`
      : "~20 min 14 s";

  return (
    <header className="h-16 px-3 md:px-5 bg-[#0c0d12]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-2 md:gap-3 flex-shrink-0 z-30 select-none shadow-lg shadow-black/40 relative">
      {/* ========================================================
          GRUPO 1: IDENTIDAD DE MARCA (LOGO + NOMBRE + TRIPULANTE)
          ======================================================== */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <div className="relative w-8 h-8 md:w-9 md:h-9 flex-shrink-0 rounded-xl overflow-hidden bg-[#171822] border border-white/10 flex items-center justify-center shadow-inner p-1">
          <Image
            src="/assets/mins-solutions-logo.png"
            alt="Mins Solutions TI"
            width={32}
            height={32}
            className="object-contain rounded-lg"
            priority
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-sm md:text-base font-bold text-white tracking-tight">
              {texts.appName}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono sm:hidden">
              2026
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#9975ff]/20 text-[#bca6ff] font-medium border border-[#9975ff]/30 hidden md:inline">
              {texts.byCompany}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden 2xl:block leading-none truncate max-w-[320px] mt-0.5">
            {texts.challengeName}
          </p>
        </div>

        {/* Separador vertical discreto */}
        <div className="hidden xl:block w-px h-6 bg-white/10 mx-1" />

        {/* ========================================================
            SELECTOR INTERACTIVO DE TRIPULACIÓN (MULTI-CREW ROSTER)
            ======================================================== */}
        <div className="relative hidden xl:block" ref={crewMenuRef}>
          <button
            onClick={() => setIsCrewMenuOpen(!isCrewMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-all duration-150 cursor-pointer text-left shadow-sm"
            title="Seleccionar astronauta de la expedición Artemis"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#794ff5] to-[#bca6ff] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {activeCrewMember.avatarInitials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0c0d12]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                <span className="truncate max-w-[130px]">{activeCrewMember.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[130px] mt-0.5">
                {activeCrewMember.role}
              </div>
            </div>
          </button>

          {isCrewMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-[#111218]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                <span>Tripulación Expedición Artemis 2026</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-1.5 space-y-1">
                {ARTEMIS_CREW_ROSTER.map((crew) => (
                  <button
                    key={crew.id}
                    onClick={() => {
                      selectCrewMember(crew.id);
                      setIsCrewMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-all duration-150 cursor-pointer ${
                      selectedCrewId === crew.id
                        ? "bg-purple-500/20 border border-purple-500/30 text-white"
                        : "hover:bg-white/[0.08] active:bg-white/[0.12] text-slate-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-purple-300">
                      {crew.avatarInitials}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-sm font-semibold text-white truncate">
                        {crew.name}
                      </div>
                      <div className="text-xs text-slate-300 truncate mt-0.5">
                        {crew.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          GRUPO 2: SELECTOR DE MISIÓN Y LATENCIA DE TIERRA
          ======================================================== */}
      <div className="flex items-center gap-1.5 md:gap-2.5 flex-shrink-0">
        {/* Selector de Misión Espacial */}
        <div className="flex items-center bg-black/40 p-0.5 md:p-1 rounded-lg border border-white/10">
          {(["ISS", "LUNA", "MARTE"] as MissionDestination[]).map((m) => (
            <button
              key={m}
              onClick={() => setMission(m)}
              className={`px-2.5 md:px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-center ${
                mission === m
                  ? "bg-[#9975ff] text-white shadow-md shadow-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title={`Simular condiciones en ${m}`}
            >
              {m === "ISS" ? "ISS" : m === "LUNA" ? "Luna" : "Marte"}
            </button>
          ))}
        </div>

        {/* Latencia con la Tierra con baliza de ping en vivo */}
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300"
          title="Telemetría en tiempo real por la Red de Espacio Profundo (DSN)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#66d8d1] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#66d8d1]" />
          </span>
          <span className="text-slate-400">Tierra:</span>
          <span className="font-semibold text-white font-mono tracking-tight">{delayDisplay}</span>
        </div>
      </div>

      {/* ========================================================
          GRUPO 3: INSIGNIAS DISCRETAS + AUDIO TOGGLE
          ======================================================== */}
      <div className="hidden 2xl:flex items-center gap-2 flex-shrink-0">
        {/* Toggle Audio Cockpit */}
        <button
          onClick={toggleAudio}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            !isAudioMuted
              ? "bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25"
              : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
          }`}
          title={isAudioMuted ? "Activar audio táctico de cabina NASA" : "Silenciar audio táctico"}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400"
          title={texts.noConnectionDesc}
        >
          <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
          <span>{texts.offlineBadge}</span>
        </span>
        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300"
          title="Herramienta demostrativa de apoyo al astronauta, no certificada para diagnóstico clínico."
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{texts.demoBadge}</span>
        </span>
      </div>

      {/* ========================================================
          GRUPO 4: BOTÓN DESTACADO "HACER MI CHEQUEO" + DSN + MENÚ MÁS
          ======================================================== */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
        {/* Botón Transmisión DSN en pantallas grandes */}
        <button
          onClick={openDsnModal}
          className="hidden 2xl:flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs tracking-wide transition-all cursor-pointer"
          title="Abrir telemetría y enlace DSN con Houston"
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Enlace DSN</span>
        </button>

        {/* Botón principal prominente con gradiente violeta didáctico */}
        <button
          onClick={onOpenCheckupWizard}
          className="btn-primary-gradient flex items-center justify-center gap-1.5 px-3.5 md:px-4 py-2 font-semibold text-xs md:text-sm tracking-wide flex-shrink-0 cursor-pointer shadow-md shadow-purple-500/20"
          title="Anotar tus medidas de salud del día en 2 minutos"
        >
          <ClipboardList className="w-4 h-4 text-white flex-shrink-0" />
          <span className="whitespace-nowrap hidden lg:inline">{texts.todayCheckupButton}</span>
          <span className="whitespace-nowrap lg:hidden">Chequeo hoy</span>
        </button>

        {/* Conmutador de Idioma Bilingüe ES | EN */}
        <div className="flex items-center bg-white/[0.06] p-0.5 rounded-lg border border-white/10 text-xs font-semibold flex-shrink-0">
          <button
            onClick={() => setLanguage("es")}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
              language === "es"
                ? "bg-[#9975ff] text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Cambiar idioma a Español"
            aria-label="Español"
          >
            ES
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
              language === "en"
                ? "bg-[#9975ff] text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Switch language to English"
            aria-label="English"
          >
            EN
          </button>
        </div>

        {/* Botón Menú "Más" */}
        <div className="relative flex-shrink-0" ref={moreMenuRef}>
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            aria-label="Abrir menú de herramientas y recursos científicos"
          >
            <span>{texts.moreMenuButton}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMoreMenuOpen ? "rotate-180 text-white" : ""}`} />
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-[#111218]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                Herramientas de Misión & Jurado NASA
              </div>

              <div className="mt-1 space-y-1">
                {/* Opción DSN Móvil */}
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    openDsnModal();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center gap-3.5 transition-all duration-150 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                    <Radio className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white tracking-tight">Enlace DSN & Traspaso SBAR</div>
                    <div className="text-xs text-slate-300 mt-0.5">Exportar paquete clínico con firma CRC32</div>
                  </div>
                </button>

                {/* Opción 1: Escenarios de demostración */}
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenDemoMenu();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center gap-3.5 transition-all duration-150 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#9975ff]/15 border border-[#9975ff]/30 flex items-center justify-center flex-shrink-0 text-[#bca6ff]">
                    <Zap className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white tracking-tight">{texts.scenarioTester}</div>
                    <div className="text-xs text-slate-300 mt-0.5">Inyectar contingencias de vuelo (SPE, EVA)</div>
                  </div>
                </button>

                {/* Opción 2: Test de vigilancia NASA PVT */}
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenPvtModal();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center gap-3.5 transition-all duration-150 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#66d8d1]/15 border border-[#66d8d1]/30 flex items-center justify-center flex-shrink-0 text-[#66d8d1]">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white tracking-tight">{texts.reactionTest}</div>
                    <div className="text-xs text-slate-300 mt-0.5">Evalúa atención y fatiga mental (NASA PVT)</div>
                  </div>
                </button>

                {/* Opción 3: Datos reales NASA OSDR */}
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenOsdrModal();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center gap-3.5 transition-all duration-150 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
                    <Database className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white tracking-tight">Datos reales de NASA (Inspiration4)</div>
                    <div className="text-xs text-slate-300 mt-0.5">Muestras del repositorio abierto NASA OSDR</div>
                  </div>
                </button>

                {/* Opción 4: Fuentes científicas */}
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenEvidenceModal();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center gap-3.5 transition-all duration-150 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#9975ff]/15 border border-[#9975ff]/30 flex items-center justify-center flex-shrink-0 text-[#bca6ff]">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white tracking-tight">{texts.scientificSources}</div>
                    <div className="text-xs text-slate-300 mt-0.5">Manuales HRP y protocolos de vuelo</div>
                  </div>
                </button>

                {/* Opción 5: Guion de presentación para jurados */}
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenPitchDemoModal();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center gap-3.5 transition-all duration-150 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-purple-300">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white tracking-tight">{texts.demoPitchScript}</div>
                    <div className="text-xs text-slate-300 mt-0.5">Paso a paso para el pitch del jurado</div>
                  </div>
                </button>

                {/* Opción 6: Diapositivas de Presentación Reveal.js */}
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    if (onOpenPresentationModal) {
                      onOpenPresentationModal();
                    } else {
                      window.open("/presentation/index.html", "_blank");
                    }
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center gap-3.5 transition-all duration-150 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#9975ff]/20 border border-[#9975ff]/40 flex items-center justify-center flex-shrink-0 text-[#bca6ff]">
                    <Presentation className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                      <span>{texts.presentationSlides}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">Reveal.js</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">Pitch deck interactivo open-source para jurados</div>
                  </div>
                </button>

                <div className="border-t border-white/10 my-1.5" />

                {/* Opción 7: Repetir Tour */}
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenWelcomeTour();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] flex items-center gap-3.5 transition-all duration-150 cursor-pointer"
                >
                  <RotateCcw className="w-4.5 h-4.5 text-slate-400 flex-shrink-0 ml-1" />
                  <div>
                    <div className="text-sm font-medium text-slate-300">{texts.restartWelcomeTour}</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
