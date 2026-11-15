"use client";

import React, { useState, useEffect } from "react";
import { HeaderBar } from "@/components/nasa/HeaderBar";
import { BentoTelemetryRail } from "@/components/nasa/BentoTelemetryRail";
import { AstronautGLBViewer } from "@/components/nasa/AstronautGLBViewer";
import { IndicatorDetailDrawer } from "@/components/nasa/IndicatorDetailDrawer";
import { CheckupWizardModal } from "@/components/nasa/CheckupWizardModal";
import { DemoScenariosModal } from "@/components/nasa/DemoScenariosModal";
import { PsychomotorVigilanceModal } from "@/components/nasa/PsychomotorVigilanceModal";
import { NasaOsdrReferenceModal } from "@/components/nasa/NasaOsdrReferenceModal";
import { ScientificEvidenceModal } from "@/components/nasa/ScientificEvidenceModal";
import { GuidedPitchDemoModal } from "@/components/nasa/GuidedPitchDemoModal";
import { WelcomeTourModal } from "@/components/nasa/WelcomeTourModal";
import { IndicatorId } from "@/data/indicators";

export default function MinsHealthSpaceCockpit() {
  const [mounted, setMounted] = useState<boolean>(false);

  // Indicador seleccionado en el panel de detalle
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<IndicatorId>("heart_rate");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // Modales especializados accesibles desde el menú "Más" o botones de acción
  const [isCheckupWizardOpen, setIsCheckupWizardOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isPvtModalOpen, setIsPvtModalOpen] = useState<boolean>(false);
  const [isOsdrModalOpen, setIsOsdrModalOpen] = useState<boolean>(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);
  const [isPitchDemoModalOpen, setIsPitchDemoModalOpen] = useState<boolean>(false);
  const [isWelcomeTourOpen, setIsWelcomeTourOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Activar tour de bienvenida automáticamente solo la primera vez
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem("mins_health_welcome_seen");
      if (!seen) {
        setIsWelcomeTourOpen(true);
      }
    }
  }, []);

  const handleSelectIndicator = (id: IndicatorId) => {
    setSelectedIndicatorId(id);
    setIsDrawerOpen(true);
  };

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-[#08090d] flex flex-col items-center justify-center font-sans text-xs text-[#9975ff] tracking-wide gap-3">
        <div className="w-10 h-10 border-2 border-[#9975ff] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-normal text-slate-200">
          Iniciando Mins-Health by Mins Solutions TI...
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col liquid-glass-bg bg-[#08090d] text-[#f1f5f9] select-none relative">
      {/* 1. BARRA SUPERIOR (4 GRUPOS CLAROS + MENÚ MÁS) */}
      <HeaderBar
        onOpenCheckupWizard={() => setIsCheckupWizardOpen(true)}
        onOpenDemoMenu={() => setIsDemoModalOpen(true)}
        onOpenPvtModal={() => setIsPvtModalOpen(true)}
        onOpenOsdrModal={() => setIsOsdrModalOpen(true)}
        onOpenEvidenceModal={() => setIsEvidenceModalOpen(true)}
        onOpenPitchDemoModal={() => setIsPitchDemoModalOpen(true)}
        onOpenWelcomeTour={() => setIsWelcomeTourOpen(true)}
      />

      {/* 2. ÁREA DE CABINA DE 3 ZONAS (SIN SCROLL GLOBAL, SCROLL INTERNO INDEPENDIENTE) */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        {/* ZONA 1: "¿CÓMO ESTOY?" (RIEL IZQUIERDO DE TELEMETRÍA Y ESTADO GENERAL) */}
        <BentoTelemetryRail
          selectedIndicatorId={selectedIndicatorId}
          onSelectIndicator={handleSelectIndicator}
        />

        {/* ZONA 2: "¿DÓNDE?" (MAPA ANATÓMICO 3D CON LEYENDA FIJA Y HOTSPOTS CORREGIDOS) */}
        <AstronautGLBViewer
          selectedIndicatorId={selectedIndicatorId}
          onSelectIndicator={handleSelectIndicator}
        />

        {/* ZONA 3: "¿QUÉ HAGO?" (PANEL DE ACCIÓN Y RECOMENDACIONES EN 3 BLOQUES) */}
        {isDrawerOpen && (
          <IndicatorDetailDrawer
            indicatorId={selectedIndicatorId}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </main>

      {/* MODAL 1: ASISTENTE DE CHEQUEO DIARIO PASO A PASO */}
      <CheckupWizardModal
        isOpen={isCheckupWizardOpen}
        onClose={() => setIsCheckupWizardOpen(false)}
      />

      {/* MODAL 2: TOUR DE BIENVENIDA EN 3 PASOS */}
      <WelcomeTourModal
        isOpen={isWelcomeTourOpen}
        onClose={() => setIsWelcomeTourOpen(false)}
      />

      {/* MODALES ADICIONALES (ACCESIBLES DESDE MENÚ "MÁS") */}
      <DemoScenariosModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      <PsychomotorVigilanceModal
        isOpen={isPvtModalOpen}
        onClose={() => setIsPvtModalOpen(false)}
      />

      <NasaOsdrReferenceModal
        isOpen={isOsdrModalOpen}
        onClose={() => setIsOsdrModalOpen(false)}
      />

      <ScientificEvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
      />

      <GuidedPitchDemoModal
        isOpen={isPitchDemoModalOpen}
        onClose={() => setIsPitchDemoModalOpen(false)}
      />
    </div>
  );
}
