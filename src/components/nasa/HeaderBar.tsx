"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useHealthStore } from "@/store/health-store";
import { MISSIONS_CONFIG, MissionDestination } from "@/core/missions";
import { UI_TEXTS_ES } from "@/data/i18n";
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
  User,
} from "lucide-react";

interface HeaderBarProps {
  onOpenCheckupWizard: () => void;
  onOpenDemoMenu: () => void;
  onOpenPvtModal: () => void;
  onOpenOsdrModal: () => void;
  onOpenEvidenceModal: () => void;
  onOpenPitchDemoModal: () => void;
  onOpenWelcomeTour: () => void;
}

export function HeaderBar({
  onOpenCheckupWizard,
  onOpenDemoMenu,
  onOpenPvtModal,
  onOpenOsdrModal,
  onOpenEvidenceModal,
  onOpenPitchDemoModal,
  onOpenWelcomeTour,
}: HeaderBarProps) {
  const { mission, setMission, commsCountdownSeconds } = useHealthStore();
  const missionConfig = MISSIONS_CONFIG[mission];

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const delayDisplay =
    commsCountdownSeconds !== null
      ? `${Math.floor(commsCountdownSeconds / 60)} min ${commsCountdownSeconds % 60} s`
      : mission === "ISS"
      ? "En vivo (< 1 s)"
      : mission === "LUNA"
      ? "~1.3 s"
      : "~20 min";

  return (
    <header className="h-16 px-4 md:px-6 bg-[#0c0d12]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-3 flex-shrink-0 z-30 select-none shadow-lg shadow-black/40">
      {/* ========================================================
          GRUPO 1: IDENTIDAD DE MARCA (LOGO + NOMBRE + TRIPULANTE)
          ======================================================== */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0 rounded-xl overflow-hidden bg-[#171822] border border-white/10 flex items-center justify-center shadow-inner p-1">
          <Image
            src="/assets/mins-solutions-logo.png"
            alt="Mins Solutions TI"
            width={34}
            height={34}
            className="object-contain rounded-lg"
            priority
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-bold text-white tracking-tight">
              {UI_TEXTS_ES.appName}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#9975ff]/20 text-[#bca6ff] font-medium border border-[#9975ff]/30 hidden sm:inline">
              {UI_TEXTS_ES.byCompany}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden xl:block leading-none truncate max-w-[340px] mt-0.5">
            {UI_TEXTS_ES.challengeName}
          </p>
        </div>

        {/* Separador vertical discreto */}
        <div className="hidden lg:block w-px h-6 bg-white/10 mx-1" />

        {/* Avatar del astronauta en misión */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#794ff5] to-[#bca6ff] flex items-center justify-center text-xs font-bold text-white shadow-sm">
              EM
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c0d12]" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-white leading-tight">Elena Martínez</div>
            <div className="text-[10px] text-slate-400 leading-tight">Comandante · Vuelo Artemis</div>
          </div>
        </div>
      </div>

      {/* ========================================================
          GRUPO 2: SELECTOR DE MISIÓN Y LATENCIA DE TIERRA
          ======================================================== */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
          {(["ISS", "LUNA", "MARTE"] as MissionDestination[]).map((m) => (
            <button
              key={m}
              onClick={() => setMission(m)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                mission === m
                  ? "bg-[#9975ff] text-white font-semibold shadow-md shadow-purple-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
              title={`Simular condiciones en ${m}`}
            >
              {m === "ISS" ? "ISS" : m === "LUNA" ? "Luna" : "Marte"}
            </button>
          ))}
        </div>

        {/* Latencia con la Tierra */}
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300"
          title="Tiempo que tarda una señal de radio en viajar a la Tierra"
        >
          <Clock className="w-3.5 h-3.5 text-[#66d8d1]" />
          <span className="text-slate-400">Tierra:</span>
          <span className="font-semibold text-white">{delayDisplay}</span>
        </div>
      </div>

      {/* ========================================================
          GRUPO 3: INSIGNIAS DISCRETAS (OFFLINE & PROTOTIPO)
          ======================================================== */}
      <div className="hidden 2xl:flex items-center gap-2 flex-shrink-0">
        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400"
          title={UI_TEXTS_ES.noConnectionDesc}
        >
          <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
          <span>{UI_TEXTS_ES.offlineBadge}</span>
        </span>
        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300"
          title="Herramienta demostrativa de apoyo al astronauta, no certificada para diagnóstico clínico."
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{UI_TEXTS_ES.demoBadge}</span>
        </span>
      </div>

      {/* ========================================================
          GRUPO 4: BOTÓN DESTACADO "HACER MI CHEQUEO" + MENÚ "MÁS"
          ======================================================== */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Botón principal prominente con gradiente violeta didáctico */}
        <button
          onClick={onOpenCheckupWizard}
          className="btn-primary-gradient flex items-center gap-2 px-4 py-2 font-semibold text-xs md:text-sm tracking-wide flex-shrink-0 cursor-pointer"
          title="Anotar tus medidas de salud del día en 2 minutos"
        >
          <ClipboardList className="w-4 h-4 text-white" />
          <span className="whitespace-nowrap hidden sm:inline">{UI_TEXTS_ES.todayCheckupButton}</span>
          <span className="whitespace-nowrap sm:hidden">Chequeo hoy</span>
        </button>

        {/* Menú "Más" con esquinas redondeadas y estilo Liquid Glass */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="btn-secondary-glass flex items-center gap-1.5 px-3 py-2 text-xs font-medium cursor-pointer"
            title="Herramientas científicas, datos reales y simulaciones"
          >
            <span>{UI_TEXTS_ES.moreMenuButton}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#111218]/98 backdrop-blur-2xl border border-white/20 p-2.5 z-50 text-xs text-slate-200 shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#bca6ff] uppercase tracking-wider">
                Herramientas y Pruebas
              </div>

              {/* Opción 1: Simular situaciones de crisis */}
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenDemoMenu();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Simular situaciones de vuelo</div>
                  <div className="text-[11px] text-slate-400">Tormenta solar, aislamiento, datos perdidos</div>
                </div>
              </button>

              {/* Opción 2: Test de reflejos */}
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenPvtModal();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#66d8d1]/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#66d8d1]" />
                </div>
                <div>
                  <div className="font-medium text-white">{UI_TEXTS_ES.reactionTest}</div>
                  <div className="text-[11px] text-slate-400">Evalúa atención y fatiga mental (NASA PVT)</div>
                </div>
              </button>

              {/* Opción 3: Datos reales NASA OSDR */}
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenOsdrModal();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Datos reales de NASA (Inspiration4)</div>
                  <div className="text-[11px] text-slate-400">Muestras del repositorio abierto NASA OSDR</div>
                </div>
              </button>

              {/* Opción 4: Fuentes científicas */}
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenEvidenceModal();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#9975ff]/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-[#bca6ff]" />
                </div>
                <div>
                  <div className="font-medium text-white">{UI_TEXTS_ES.scientificSources}</div>
                  <div className="text-[11px] text-slate-400">Manuales HRP y protocolos de vuelo</div>
                </div>
              </button>

              {/* Opción 5: Guion de presentación para jurados */}
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenPitchDemoModal();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <div className="font-medium text-white">{UI_TEXTS_ES.demoPitchScript}</div>
                  <div className="text-[11px] text-slate-400">Paso a paso para el pitch del jurado</div>
                </div>
              </button>

              <div className="border-t border-white/10 my-1.5" />

              {/* Opción 6: Repetir Tour */}
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenWelcomeTour();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1.5" />
                <div>
                  <div className="font-medium text-slate-300">{UI_TEXTS_ES.restartWelcomeTour}</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
