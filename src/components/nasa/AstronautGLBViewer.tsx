"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useHealthStore } from "@/store/health-store";
import { IndicatorId } from "@/data/indicators";
import { EvaluationState } from "@/core/rules";
import { UI_TEXTS_ES } from "@/data/i18n";
import {
  Brain,
  Eye,
  Heart,
  Thermometer,
  Zap,
  Radio,
  Layers,
  Sparkles,
} from "lucide-react";

interface AstronautGLBViewerProps {
  selectedIndicatorId: IndicatorId;
  onSelectIndicator: (id: IndicatorId) => void;
}

interface AnatomicalHotspot {
  id: IndicatorId;
  name: string;
  simpleName: string;
  zone: string;
  defaultCoords: { x: number; y: number };
  anchor3D: THREE.Vector3;
  icon: React.ReactNode;
}

const HOTSPOTS: AnatomicalHotspot[] = [
  {
    id: "mood",
    name: "Cerebro & Función Conductual",
    simpleName: "Cerebro y descanso",
    zone: "Cabeza",
    defaultCoords: { x: 50, y: 32 },
    anchor3D: new THREE.Vector3(0, 0.96, 0.18),
    icon: <Brain className="w-4 h-4" />,
  },
  {
    id: "blood_pressure",
    name: "Ojos & Síndrome SANS",
    simpleName: "Ojos y cabeza",
    zone: "Visor",
    defaultCoords: { x: 50, y: 39 },
    anchor3D: new THREE.Vector3(0, 0.82, 0.26),
    icon: <Eye className="w-4 h-4" />,
  },
  {
    id: "heart_rate",
    name: "Corazón & Sistema Cardiovascular",
    simpleName: "Ritmo del corazón",
    zone: "Pecho izquierdo",
    defaultCoords: { x: 44, y: 46 },
    anchor3D: new THREE.Vector3(-0.14, 0.44, 0.22),
    icon: <Heart className="w-4 h-4" />,
  },
  {
    id: "core_temp",
    name: "Termorregulación Central",
    simpleName: "Temperatura corporal",
    zone: "Pecho derecho",
    defaultCoords: { x: 56, y: 46 },
    anchor3D: new THREE.Vector3(0.14, 0.44, 0.22),
    icon: <Thermometer className="w-4 h-4" />,
  },
  {
    id: "glucose",
    name: "Metabolismo & Glucemia",
    simpleName: "Azúcar y energía",
    zone: "Abdomen",
    defaultCoords: { x: 50, y: 56 },
    anchor3D: new THREE.Vector3(0, 0.10, 0.25),
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "radiation_dose",
    name: "Médula Ósea & Radiación",
    simpleName: "Radiación cósmica",
    zone: "Cuerpo entero",
    defaultCoords: { x: 50, y: 70 },
    anchor3D: new THREE.Vector3(0, -0.32, 0.2),
    icon: <Radio className="w-4 h-4" />,
  },
];

export function AstronautGLBViewer({
  selectedIndicatorId,
  onSelectIndicator,
}: AstronautGLBViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { decisionReport } = useHealthStore();

  const [isXrayActive, setIsXrayActive] = useState<boolean>(false);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<IndicatorId | null>(null);

  const suitMaterialsRef = useRef<THREE.Material[]>([]);
  const xrayGroupRef = useRef<THREE.Group | null>(null);
  const astronautModelRef = useRef<THREE.Group | null>(null);

  const getStatusColor = (state: EvaluationState) => {
    switch (state) {
      case "ESCALAR_TIERRA":
        return "#f43f5e"; // Rose / Rojo
      case "ATENCION":
        return "#f97316"; // Naranja
      case "VIGILAR":
        return "#f59e0b"; // Ámbar
      case "HABITUAL":
        return "#10b981"; // Verde esmeralda
      case "SIN_DATOS":
      default:
        return "#64748b"; // Pizarra
    }
  };

  const getStatusSimpleName = (state: EvaluationState) => {
    switch (state) {
      case "ESCALAR_TIERRA":
        return "Pedir ayuda";
      case "ATENCION":
        return "Atención";
      case "VIGILAR":
        return "Vigilar";
      case "HABITUAL":
        return "Normal";
      case "SIN_DATOS":
      default:
        return "Sin datos";
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 4.0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // OrbitControls: Permite rotar suavemente con el mouse, hacer zoom y controlar la cámara
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false; // DESACTIVADO por defecto: rotación con mouse manual
    controls.autoRotateSpeed = 1.2;
    controls.minDistance = 2.0;
    controls.maxDistance = 6.0;
    controls.enablePan = false;
    controls.target.set(0, 0.25, 0);
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minPolarAngle = Math.PI * 0.15;

    // Iluminación moderna Liquid Glass
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbca6ff, 1.0);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    const softCyanGlow = new THREE.DirectionalLight(0x66d8d1, 1.2);
    softCyanGlow.position.set(0, 3, -3);
    scene.add(softCyanGlow);

    // Plataforma circular translúcida estilo Liquid Glass
    const platformGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.04, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x111218,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.6,
    });
    const platformMesh = new THREE.Mesh(platformGeom, platformMat);
    platformMesh.position.y = -1.18;
    scene.add(platformMesh);

    // Anillo de luz en la base
    const ringGeom = new THREE.RingGeometry(1.5, 1.58, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x9975ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.16;
    scene.add(ringMesh);

    // Grupo de órganos para modo rayos X
    const xrayGroup = new THREE.Group();
    xrayGroup.visible = false;
    xrayGroupRef.current = xrayGroup;

    // Cerebro
    const brainGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const brainMat = new THREE.MeshBasicMaterial({
      color: 0x9975ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const brainMesh = new THREE.Mesh(brainGeom, brainMat);
    brainMesh.position.set(0, 0.95, 0);
    xrayGroup.add(brainMesh);

    // Corazón
    const heartGeom = new THREE.OctahedronGeometry(0.13, 2);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const heartMesh = new THREE.Mesh(heartGeom, heartMat);
    heartMesh.position.set(-0.11, 0.44, 0.05);
    xrayGroup.add(heartMesh);

    // Glucosa / Digestivo
    const glucoseGeom = new THREE.TorusGeometry(0.12, 0.035, 12, 24);
    const glucoseMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
    });
    const glucoseMesh = new THREE.Mesh(glucoseGeom, glucoseMat);
    glucoseMesh.position.set(0, 0.1, 0.02);
    glucoseMesh.rotation.x = Math.PI / 2;
    xrayGroup.add(glucoseMesh);

    // Médula / Columna
    const spineGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.75, 12);
    const spineMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
    });
    const spineMesh = new THREE.Mesh(spineGeom, spineMat);
    spineMesh.position.set(0, 0.4, -0.04);
    xrayGroup.add(spineMesh);

    scene.add(xrayGroup);

    // Carga del modelo GLB del astronauta
    const loader = new GLTFLoader();
    suitMaterialsRef.current = [];

    loader.load(
      "/assets/astronaut.glb",
      (gltf) => {
        const model = gltf.scene;
        astronautModelRef.current = model;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxAxis = Math.max(size.x, size.y, size.z);
        const targetHeight = 2.2;
        const scaleFactor = targetHeight / maxAxis;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        model.position.x = -center.x * scaleFactor;
        model.position.y = -center.y * scaleFactor;
        model.position.z = -center.z * scaleFactor;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => suitMaterialsRef.current.push(m));
            } else if (mesh.material) {
              suitMaterialsRef.current.push(mesh.material);
            }
          }
        });

        scene.add(model);
        setIsLoadingModel(false);
      },
      undefined,
      (error) => {
        console.warn("Fallback astronaut geometry:", error);
        const fallbackGroup = new THREE.Group();
        const placeholderMat = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          roughness: 0.5,
        });
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.9, 16), placeholderMat);
        torso.position.y = 0.4;
        fallbackGroup.add(torso);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), placeholderMat);
        head.position.y = 1.0;
        fallbackGroup.add(head);
        scene.add(fallbackGroup);
        astronautModelRef.current = fallbackGroup;
        setIsLoadingModel(false);
      }
    );

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      controls.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Efecto modo rayos X
  useEffect(() => {
    if (xrayGroupRef.current) {
      xrayGroupRef.current.visible = isXrayActive;
    }

    suitMaterialsRef.current.forEach((mat) => {
      if (isXrayActive) {
        mat.transparent = true;
        mat.opacity = 0.35;
        // @ts-expect-error Three.js wireframe flag
        mat.wireframe = true;
      } else {
        mat.transparent = false;
        mat.opacity = 1.0;
        // @ts-expect-error Three.js wireframe flag
        mat.wireframe = false;
      }
      mat.needsUpdate = true;
    });
  }, [isXrayActive]);

  const activeNode = HOTSPOTS.find((n) => n.id === selectedIndicatorId);
  const activeEval = decisionReport.evaluations[selectedIndicatorId];
  const activeColor = getStatusColor(activeEval?.state ?? "HABITUAL");
  const activeStateName = getStatusSimpleName(activeEval?.state ?? "HABITUAL");

  return (
    <section className="flex-1 h-full relative flex flex-col items-center justify-center bg-[#08090d] overflow-hidden select-none">
      {/* ========================================================
          BARRA DE CONTROLES LIQUID GLASS SUPERIOR
          ======================================================== */}
      <div className="absolute top-4 inset-x-5 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Píldoras de control */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 glass-panel text-xs font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-[#9975ff]" />
            <span className="text-white font-medium">{UI_TEXTS_ES.zoneCenterTitle}</span>
            <span className="text-slate-400">· Vista 3D interactiva</span>
          </div>

          <button
            onClick={() => setIsXrayActive(!isXrayActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isXrayActive
                ? "bg-[#9975ff] text-white font-semibold shadow-lg shadow-purple-500/25"
                : "glass-pill text-slate-200 hover:text-white hover:bg-white/10"
            }`}
            title="Muestra el interior del traje para ubicar corazón, pulmones y cerebro"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isXrayActive ? "Ocultar órganos" : "Ver órganos"}</span>
          </button>
        </div>

        {/* Leyenda didáctica en formato Liquid Glass */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 glass-panel text-xs text-slate-300 pointer-events-auto">
          <span className="text-[11px] font-medium text-slate-400 mr-0.5">
            {UI_TEXTS_ES.legendTitle}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-300">{UI_TEXTS_ES.legendNormal}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-slate-300">{UI_TEXTS_ES.legendWatch}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
            <span className="text-slate-300">{UI_TEXTS_ES.legendAttention}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="text-slate-300">{UI_TEXTS_ES.legendHelp}</span>
          </div>
        </div>
      </div>

      {/* Indicador de carga */}
      {isLoadingModel && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#08090d]/80 backdrop-blur-md">
          <div className="flex items-center gap-3 px-5 py-3 glass-panel text-xs font-medium text-purple-300">
            <Sparkles className="w-4 h-4 animate-spin text-[#9975ff]" />
            <span>Cargando modelo 3D del astronauta...</span>
          </div>
        </div>
      )}

      {/* Canvas Three.js con OrbitControls para arrastrar */}
      <div
        ref={mountRef}
        className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing"
      />

      {/* ========================================================
          HOTSPOTS ANATÓMICOS DIDÁCTICOS CON LIQUID GLASS
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {HOTSPOTS.map((node) => {
          const evalData = decisionReport.evaluations[node.id];
          const state: EvaluationState = evalData?.state ?? "HABITUAL";
          const color = getStatusColor(state);
          const simpleStateName = getStatusSimpleName(state);
          const isSelected = selectedIndicatorId === node.id;
          const isHovered = hoveredNodeId === node.id;
          const isWarning = state === "ESCALAR_TIERRA" || state === "ATENCION";

          return (
            <div
              key={node.id}
              style={{
                top: `${node.defaultCoords.y}%`,
                left: `${node.defaultCoords.x}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <button
                onClick={() => onSelectIndicator(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={`relative flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none ${
                  isSelected
                    ? "w-10 h-10 ring-4 ring-[#9975ff]/40 scale-110 z-30 shadow-lg shadow-purple-500/30"
                    : "w-8 h-8 hover:scale-110 hover:ring-2 hover:ring-white/40"
                }`}
                style={{
                  backgroundColor: "rgba(17, 18, 24, 0.9)",
                  borderColor: isSelected ? "#9975ff" : color,
                  borderWidth: isSelected ? "2.5px" : "1.5px",
                  boxShadow: `0 4px 14px ${color}60`,
                }}
                title={`${node.simpleName} (${simpleStateName})`}
                aria-label={node.simpleName}
              >
                <span style={{ color }}>{node.icon}</span>

                {isWarning && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-50"
                    style={{ backgroundColor: color }}
                  />
                )}
              </button>

              {/* Tooltip moderno Liquid Glass */}
              {isHovered && !isSelected && (
                <div className="absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap glass-panel px-3 py-1.5 text-xs text-white shadow-xl z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="font-semibold text-white">{node.simpleName}</div>
                  <div className="text-[11px] text-slate-300">
                    Estado: <strong style={{ color }}>{simpleStateName}</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================
          BARRA DE ACCESO RÁPIDO INFERIOR (PÍLDORAS REDONDEADAS)
          ======================================================== */}
      <div className="absolute bottom-4 inset-x-5 z-20 flex flex-wrap justify-center gap-2 pointer-events-auto">
        {HOTSPOTS.map((node) => {
          const evalData = decisionReport.evaluations[node.id];
          const color = getStatusColor(evalData?.state ?? "HABITUAL");
          const isSelected = selectedIndicatorId === node.id;

          return (
            <button
              key={node.id}
              onClick={() => onSelectIndicator(node.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-[#9975ff] text-white font-semibold shadow-lg shadow-purple-500/30 ring-2 ring-white/20"
                  : "glass-pill text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>{node.simpleName}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
