"use client";

import React, { useEffect, useRef } from "react";
import { IndicatorId } from "@/data/indicators";
import { EvaluationState } from "@/core/rules";

interface LiveBiometricWaveformProps {
  id: IndicatorId;
  val: number | null;
  mean: number;
  sd: number;
  state: EvaluationState;
  color: string;
}

export function LiveBiometricWaveform({
  id,
  val,
  mean,
  sd,
  state,
  color,
}: LiveBiometricWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();

    // Redimensionar canvas para soporte Retina / alta resolución
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Función de forma de onda ECG P-Q-R-S-T
    const getEcgOffset = (phase: number) => {
      const p = ((phase % 1) + 1) % 1;
      if (p < 0.1) return 0;
      if (p >= 0.1 && p < 0.18) return Math.sin(((p - 0.1) / 0.08) * Math.PI) * 0.18; // P
      if (p >= 0.18 && p < 0.22) return 0;
      if (p >= 0.22 && p < 0.25) return -((p - 0.22) / 0.03) * 0.22; // Q
      if (p >= 0.25 && p < 0.29) {
        if (p < 0.27) return -0.22 + ((p - 0.25) / 0.02) * 1.25; // R subida
        return 1.03 - ((p - 0.27) / 0.02) * 1.48; // S bajada
      }
      if (p >= 0.29 && p < 0.34) return -0.45 + ((p - 0.29) / 0.05) * 0.45; // S recuperación
      if (p >= 0.34 && p < 0.40) return 0;
      if (p >= 0.40 && p < 0.54) return Math.sin(((p - 0.4) / 0.14) * Math.PI) * 0.32; // T
      return 0; // Línea isoeléctrica
    };

    // Función de onda de pulso arterial (Presión arterial)
    const getArterialPressureOffset = (phase: number, pressure: number) => {
      const p = ((phase % 1) + 1) % 1;
      const ampScale = Math.max(0.4, Math.min(1.8, pressure / 120));
      if (p < 0.18) {
        // Onda anacrótica (expansión sistólica)
        return Math.sin((p / 0.18) * (Math.PI / 2)) * 0.9 * ampScale;
      }
      if (p < 0.38) {
        // Descenso hacia muesca dícrota
        const sub = (p - 0.18) / 0.2;
        return (0.9 - sub * 0.45) * ampScale;
      }
      if (p < 0.48) {
        // Muesca dícrota (cierre válvula aórtica) y rebote
        const sub = (p - 0.38) / 0.1;
        return (0.45 + Math.sin(sub * Math.PI) * 0.18) * ampScale;
      }
      // Escurrimiento diastólico
      const sub = (p - 0.48) / 0.52;
      return (0.45 * (1 - sub * 0.85)) * ampScale;
    };

    const render = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (w === 0 || h === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Franja de normalidad clínica en el fondo
      const baselineY = h * 0.5;
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.fillRect(0, h * 0.25, w, h * 0.5);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, baselineY);
      ctx.lineTo(w, baselineY);
      ctx.stroke();
      ctx.setLineDash([]);

      if (val === null) {
        // Si no hay datos, mostrar línea estática discontinua
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Parámetros dinámicos según el indicador
      ctx.beginPath();
      const pointsCount = Math.floor(w);

      // Gradiente de relleno bajo la curva
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, color + "40");
      grad.addColorStop(1, color + "00");

      const yCoords: number[] = [];

      if (id === "heart_rate") {
        // Frecuencia exacta de latidos por segundo
        const bpm = val || 60;
        const beatsPerSec = bpm / 60;
        const visibleBeats = 1.6; // Cuántos latidos caben en el ancho de la tarjeta
        const speed = beatsPerSec / visibleBeats;

        for (let x = 0; x <= pointsCount; x++) {
          const normX = x / w;
          const phase = normX * visibleBeats - elapsedSec * speed;
          const ecg = getEcgOffset(phase);
          const y = baselineY - ecg * (h * 0.42);
          yCoords.push(y);
        }
      } else if (id === "blood_pressure") {
        // Onda de presión arterial pulsátil sincronizada con hemodinámica
        const pressure = val || 120;
        const bpAmpFactor = Math.max(0.45, Math.min(2.1, pressure / 115));
        const beatsPerSec = Math.max(0.9, pressure / 110);
        const visibleWaves = 2.0;
        const speed = beatsPerSec / visibleWaves;

        for (let x = 0; x <= pointsCount; x++) {
          const normX = x / w;
          const phase = normX * visibleWaves - elapsedSec * speed;
          const art = getArterialPressureOffset(phase, pressure) * bpAmpFactor;
          const y = baselineY - art * (h * 0.36) + h * 0.12;
          yCoords.push(y);
        }
      } else if (id === "glucose") {
        // Micro-oscilación metabólica dinámica continua
        const diff = (val - mean) / (sd || 1);
        const offsetY = Math.max(-h * 0.35, Math.min(h * 0.35, -diff * 6));

        for (let x = 0; x <= pointsCount; x++) {
          const normX = x / w;
          const wave1 = Math.sin(normX * Math.PI * 4 - elapsedSec * 1.8) * (h * 0.08);
          const wave2 = Math.cos(normX * Math.PI * 2 + elapsedSec * 0.9) * (h * 0.05);
          const y = baselineY + offsetY + wave1 + wave2;
          yCoords.push(y);
        }
      } else if (id === "core_temp") {
        // Dinámica termodinámica celular con reacción a hipertermia (Space Fever) o hipotermia
        const temp = val || 36.8;
        const diff = (temp - mean) / (sd || 1);
        const offsetY = Math.max(-h * 0.35, Math.min(h * 0.35, -diff * 8));
        const isFever = temp >= 38.5;
        const isHypo = temp <= 35.0;

        for (let x = 0; x <= pointsCount; x++) {
          const normX = x / w;
          const thermalFreq = isFever ? 6 : isHypo ? 1.5 : 3;
          const thermalSpeed = isFever ? 2.8 : isHypo ? 0.7 : 1.4;
          const thermalWave = Math.sin(normX * Math.PI * thermalFreq - elapsedSec * thermalSpeed) * (h * (isFever ? 0.11 : 0.06));
          const feverJitter = isFever ? Math.sin(normX * Math.PI * 16 - elapsedSec * 7) * (h * 0.04) : 0;
          const y = baselineY + offsetY + thermalWave + feverJitter;
          yCoords.push(y);
        }
      } else if (id === "sleep_hours") {
        // Ondas lentas delta de descanso / sueño
        for (let x = 0; x <= pointsCount; x++) {
          const normX = x / w;
          const slowDelta = Math.sin(normX * Math.PI * 2.5 - elapsedSec * 0.8) * (h * 0.14);
          const y = baselineY + slowDelta;
          yCoords.push(y);
        }
      } else {
        // Ánimo y energía conductual (Ondas cerebrales alfa/beta según energía)
        const energyScore = val || 5;
        const freq = 2 + energyScore * 0.8;
        for (let x = 0; x <= pointsCount; x++) {
          const normX = x / w;
          const moodWave = Math.sin(normX * Math.PI * freq - elapsedSec * 2.5) * (h * 0.12);
          const y = baselineY + moodWave;
          yCoords.push(y);
        }
      }

      // Dibujar trazo con curvatura suave
      ctx.moveTo(0, yCoords[0]);
      for (let x = 1; x <= pointsCount; x++) {
        ctx.lineTo(x, yCoords[x]);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Cerrar trazo para relleno gradiente
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Punto escáner de pulso al extremo derecho (cabezal en vivo)
      const lastY = yCoords[yCoords.length - 1];
      const pulseSize = 3 + Math.sin(elapsedSec * 6) * 1.2;

      ctx.beginPath();
      ctx.arc(w - 3, lastY, Math.max(1.5, pulseSize), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Resplandor del punto de telemetría activa
      ctx.beginPath();
      ctx.arc(w - 3, lastY, pulseSize + 3, 0, Math.PI * 2);
      ctx.fillStyle = color + "33";
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [id, val, mean, sd, state, color]);

  return (
    <div className="w-full h-8 flex flex-col justify-end overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        title="Biometría continua en tiempo real (60 FPS)"
      />
    </div>
  );
}
