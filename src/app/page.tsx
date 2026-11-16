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
import { DsnTransmissionModal } from "@/components/nasa/DsnTransmissionModal";
import { PresentationDeckModal } from "@/components/nasa/PresentationDeckModal";
import { IndicatorId } from "@/data/indicators";
import { useHealthStore } from "@/store/health-store";

export default function MinsHealthSpaceCockpit() {
  const [mounted, setMounted] = useState<boolean>(false);

  // Selected indicator in the detail drawer
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<IndicatorId>("heart_rate");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // Modals accessible from the "More" menu or direct action buttons
  const [isCheckupWizardOpen, setIsCheckupWizardOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isPvtModalOpen, setIsPvtModalOpen] = useState<boolean>(false);
  const [isOsdrModalOpen, setIsOsdrModalOpen] = useState<boolean>(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);
  const [isPitchDemoModalOpen, setIsPitchDemoModalOpen] = useState<boolean>(false);
  const [isWelcomeTourOpen, setIsWelcomeTourOpen] = useState<boolean>(false);
  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState<boolean>(false);

  const { isDsnModalOpen, closeDsnModal } = useHealthStore();

  useEffect(() => {
    setMounted(true);
    // Guarantee fresh health evaluation synchronized with user's selected language
    useHealthStore.getState().evaluateHealth();

    // Automatically trigger welcome tour only on first visit
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
      {/* 1. TOP HEADER (BRAND + CREW ROSTER + MISSION + DSN UPLINK) */}
      <HeaderBar
        onOpenCheckupWizard={() => setIsCheckupWizardOpen(true)}
        onOpenDemoMenu={() => setIsDemoModalOpen(true)}
        onOpenPvtModal={() => setIsPvtModalOpen(true)}
        onOpenOsdrModal={() => setIsOsdrModalOpen(true)}
        onOpenEvidenceModal={() => setIsEvidenceModalOpen(true)}
        onOpenPitchDemoModal={() => setIsPitchDemoModalOpen(true)}
        onOpenWelcomeTour={() => setIsWelcomeTourOpen(true)}
        onOpenPresentationModal={() => setIsPresentationModalOpen(true)}
      />

      {/* 2. THREE-ZONE COCKPIT (ZERO GLOBAL SCROLL) */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        {/* ZONE 1: BENTO TELEMETRY RAIL */}
        <BentoTelemetryRail
          selectedIndicatorId={selectedIndicatorId}
          onSelectIndicator={handleSelectIndicator}
        />

        {/* ZONE 2: 3D WEBGL SPACESUIT WITH ANATOMICAL HOTSPOTS */}
        <AstronautGLBViewer
          selectedIndicatorId={selectedIndicatorId}
          onSelectIndicator={handleSelectIndicator}
        />

        {/* ZONE 3: CLINICAL REASONING, HRP HAZARDS & SBAR HANDOVER */}
        {isDrawerOpen && (
          <IndicatorDetailDrawer
            indicatorId={selectedIndicatorId}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </main>

      {/* MODAL 1: DAILY TELEMETRY CHECKUP WIZARD */}
      <CheckupWizardModal
        isOpen={isCheckupWizardOpen}
        onClose={() => setIsCheckupWizardOpen(false)}
      />

      {/* MODAL 2: WELCOME TOUR */}
      <WelcomeTourModal
        isOpen={isWelcomeTourOpen}
        onClose={() => setIsWelcomeTourOpen(false)}
      />

      {/* MODAL 3: CONTINGENCY INJECTION SUITE (PITCH 3M) */}
      <DemoScenariosModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* MODAL 4: NASA PVT PSYCHOMOTOR VIGILANCE TEST */}
      <PsychomotorVigilanceModal
        isOpen={isPvtModalOpen}
        onClose={() => setIsPvtModalOpen(false)}
      />

      {/* MODAL 5: NASA OPEN SCIENCE DATA REPOSITORY (OSDR OSD-575) */}
      <NasaOsdrReferenceModal
        isOpen={isOsdrModalOpen}
        onClose={() => setIsOsdrModalOpen(false)}
      />

      {/* MODAL 6: NASA-STD-3001 SCIENTIFIC EVIDENCE MATRIX */}
      <ScientificEvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
      />

      {/* MODAL 7: GUIDED PITCH SCRIPT PLAYER FOR JUDGES */}
      <GuidedPitchDemoModal
        isOpen={isPitchDemoModalOpen}
        onClose={() => setIsPitchDemoModalOpen(false)}
      />

      {/* MODAL 8: DEEP SPACE NETWORK (DSN) TELEMETRY & SBAR EXPORT */}
      <DsnTransmissionModal
        isOpen={isDsnModalOpen}
        onClose={closeDsnModal}
      />

      {/* MODAL 9: REVEAL.JS OPEN SOURCE PITCH DECK */}
      <PresentationDeckModal
        isOpen={isPresentationModalOpen}
        onClose={() => setIsPresentationModalOpen(false)}
      />
    </div>
  );
}
