"use client";

import React, { useEffect } from "react";
import { useHealthStore } from "@/store/health-store";
import { Satellite, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export function CommsReportTracker() {
  const { sentPackets, commsCountdownSeconds, decrementCountdown } = useHealthStore();

  useEffect(() => {
    if (commsCountdownSeconds === null || commsCountdownSeconds <= 0) return;
    const interval = setInterval(() => {
      decrementCountdown();
    }, 1000);
    return () => clearInterval(interval);
  }, [commsCountdownSeconds, decrementCountdown]);

  if (sentPackets.length === 0 && commsCountdownSeconds === null) {
    return null;
  }

  return (
    <div className="bg-space-surface border border-space-border rounded-2xl p-6 font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Deep Space Network (DSN) // Telemetría Empaquetada para Cirujano de Vuelo
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Total Paquetes Transmitidos: <strong>{sentPackets.length}</strong>
        </span>
      </div>

      {commsCountdownSeconds !== null && (
        <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400 animate-spin" />
            <div>
              <span className="text-xs font-bold text-cyan-300 block">
                PAQUETE MÉDICO EN TRÁNSITO INTERPLANETARIO HACIA HOUSTON
              </span>
              <span className="text-[11px] text-slate-400">
                Llegada estimada a la antena de Goldstone/Madrid/Canberra
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {Math.floor(commsCountdownSeconds / 60)}m {commsCountdownSeconds % 60}s
            </span>
          </div>
        </div>
      )}

      {/* Lista de Paquetes con Checksum */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {sentPackets.map((pkt) => (
          <div
            key={pkt.packetId}
            className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs"
          >
            <div>
              <span className="text-cyan-400 font-bold block">{pkt.packetId}</span>
              <span className="text-[11px] text-slate-400">
                {pkt.astronautName} | Misión: {pkt.mission} | Nivel: {pkt.urgencyLevel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 text-[11px]">CHECKSUM: {pkt.checksum}</span>
              </div>
              <span className="text-slate-500 text-[10px]">
                {new Date(pkt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
