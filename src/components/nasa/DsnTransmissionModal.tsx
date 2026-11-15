"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Satellite,
  Download,
  Printer,
  ShieldCheck,
  Clock,
  X,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useHealthStore } from "@/store/health-store";
import { MISSIONS_CONFIG } from "@/core/missions";
import {
  generateSBARHandoverPacket,
  downloadSBARPacketJSON,
  printSBARReportPDF,
} from "@/core/sbar-handover";
import { evaluateHazardSynergy } from "@/core/hazard-interactions";
import { HEALTH_INDICATORS, IndicatorId } from "@/data/indicators";

interface DsnTransmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DsnTransmissionModal({ isOpen, onClose }: DsnTransmissionModalProps) {
  const {
    mission,
    astronautName,
    astronautRole,
    careerRadiationAccumulatedMilliSv,
    careerRadiationLimitMilliSv,
    currentReadings,
    baselines,
    decisionReport,
  } = useHealthStore();

  const [txProgress, setTxProgress] = useState<number>(0);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(true);

  const missionConfig = MISSIONS_CONFIG[mission];
  const delayMinutes = Math.round(missionConfig.oneWayLightDelaySeconds / 60);

  const deviatedKeys = (Object.keys(HEALTH_INDICATORS) as IndicatorId[]).filter(
    (k) => decisionReport.evaluations[k]?.state !== "HABITUAL" && decisionReport.evaluations[k]?.state !== "SIN_DATOS"
  );
  const activeSynergy = evaluateHazardSynergy(deviatedKeys);

  const sbarPacket = generateSBARHandoverPacket(
    decisionReport,
    mission,
    currentReadings,
    baselines,
    activeSynergy,
    {
      name: astronautName,
      role: astronautRole,
      careerRadiation: careerRadiationAccumulatedMilliSv,
      careerLimit: careerRadiationLimitMilliSv,
    }
  );

  useEffect(() => {
    if (!isOpen) {
      setTxProgress(0);
      setIsTransmitting(true);
      return;
    }

    setTxProgress(10);
    const timer1 = setTimeout(() => setTxProgress(45), 400);
    const timer2 = setTimeout(() => setTxProgress(85), 900);
    const timer3 = setTimeout(() => {
      setTxProgress(100);
      setIsTransmitting(false);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl glass-panel border border-white/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col font-sans text-xs bg-[#0b0c10]/95 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Deep Space Network (DSN) Telemetry Uplink
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  Store & Forward Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Target: NASA Goldstone / Madrid / Canberra 70m Ground Antennas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Radio Link Status Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-white">
                  Mission Relay: {mission === "ISS" ? "LEO TDRS Satellites" : mission === "LUNA" ? "Lunar Gateway Relay" : "Mars Reconnaissance Orbiter (MRO)"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>One-Way Delay: {mission === "ISS" ? "< 1s" : mission === "LUNA" ? "~1.3s" : `~${delayMinutes} min`}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Packet Serialization & CRC32 Signing</span>
                <span className="text-white font-semibold">{txProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${txProgress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
              <span>Carrier Frequency: Ka-Band (32.0 GHz)</span>
              <span>Propagation Velocity: 299,792 km/s (c)</span>
            </div>
          </div>

          {/* SBAR Packet Summary */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-300 uppercase tracking-wider text-[11px]">
                SBAR Handover Packet Manifest
              </span>
              <span className="font-mono text-[10px] text-slate-400">ID: {sbarPacket.packetId}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Astronaut Subject</span>
                <span className="text-white font-semibold">{sbarPacket.astronaut.name}</span>
                <span className="text-[10px] text-slate-400 block">{sbarPacket.astronaut.role}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Clinical Triage Situation</span>
                <span className="text-white font-semibold truncate block">{sbarPacket.sbar.situation.headline}</span>
                <span className="text-[10px] text-amber-400 block">Severity: {sbarPacket.sbar.situation.overallSeverity}</span>
              </div>
            </div>

            {/* Cryptographic Checksum Box */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-emerald-300 font-semibold block text-[11px]">
                    Cryptographic Integrity Verification
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Algorithm: {sbarPacket.integrity.algorithm} · CRC32 Checksum: <strong className="text-white">{sbarPacket.integrity.checksum}</strong>
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/30 flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            {isTransmitting ? "Queued in store-and-forward transmission bus..." : "Ready for downlink and local archive."}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => printSBARReportPDF(sbarPacket)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors cursor-pointer"
              title="Print standard aerospace medical report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => downloadSBARPacketJSON(sbarPacket)}
              className="btn-primary-gradient flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-semibold transition-all cursor-pointer shadow-lg shadow-purple-500/20"
              title="Download signed JSON file for Houston Ground Control"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export SBAR (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
