"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useHealthStore } from "@/store/health-store";
import { IndicatorId } from "@/data/indicators";
import { EvaluationState } from "@/core/rules";
import { getTexts, getSimpleIndicators } from "@/data/i18n";
import {
  createAnatomicalHeart,
  createAnatomicalLungs,
  createAnatomicalBrain,
} from "@/components/nasa/AnatomicalOrgans";
import { loadRealAnatomicalSkeleton } from "@/core/skeleton-builder";
import {
  Brain,
  Eye,
  Heart,
  Thermometer,
  Zap,
  Radio,
  Layers,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Activity,
  Flame,
  Snowflake,
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
    zone: "Cabeza (Córtex cerebral)",
    defaultCoords: { x: 50, y: 31 },
    anchor3D: new THREE.Vector3(0, 0.94, 0.18),
    icon: <Brain className="w-4 h-4" />,
  },
  {
    id: "blood_pressure",
    name: "Ojos & Síndrome SANS",
    simpleName: "Ojos y cabeza",
    zone: "Visor y presiones craneales",
    defaultCoords: { x: 50, y: 38 },
    anchor3D: new THREE.Vector3(0, 0.82, 0.26),
    icon: <Eye className="w-4 h-4" />,
  },
  {
    id: "heart_rate",
    name: "Corazón & Sistema Cardiovascular",
    simpleName: "Ritmo del corazón",
    zone: "Pecho izquierdo (Hemotórax izq.)",
    defaultCoords: { x: 57, y: 46 }, // Lado izquierdo anatómico del astronauta (a la derecha del observador)
    anchor3D: new THREE.Vector3(0.12, 0.43, 0.22),
    icon: <Heart className="w-4 h-4" />,
  },
  {
    id: "core_temp",
    name: "Termorregulación Central",
    simpleName: "Temperatura corporal",
    zone: "Pecho derecho (Hemotórax der.)",
    defaultCoords: { x: 43, y: 46 }, // Lado derecho anatómico del astronauta (a la izquierda del observador)
    anchor3D: new THREE.Vector3(-0.12, 0.43, 0.22),
    icon: <Thermometer className="w-4 h-4" />,
  },
  {
    id: "glucose",
    name: "Metabolismo & Glucemia",
    simpleName: "Azúcar y energía",
    zone: "Abdomen (Hígado / Metabolismo)",
    defaultCoords: { x: 50, y: 56 },
    anchor3D: new THREE.Vector3(0, 0.10, 0.25),
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "radiation_dose",
    name: "Médula Ósea & Radiación",
    simpleName: "Radiación cósmica",
    zone: "Médula ósea y cuerpo entero",
    defaultCoords: { x: 50, y: 76 },
    anchor3D: new THREE.Vector3(0, -0.42, 0.20),
    icon: <Radio className="w-4 h-4" />,
  },
];

export function AstronautGLBViewer({
  selectedIndicatorId,
  onSelectIndicator,
}: AstronautGLBViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { decisionReport, currentReadings, activeScenarioName, resetToNominalCalm, language } = useHealthStore();
  const texts = getTexts(language);
  const simpleIndicators = getSimpleIndicators(language);

  const [isXrayActive, setIsXrayActive] = useState<boolean>(false);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<IndicatorId | null>(null);

  const suitMaterialsRef = useRef<THREE.Material[]>([]);
  const xrayGroupRef = useRef<THREE.Group | null>(null);
  const astronautModelRef = useRef<THREE.Group | null>(null);
  const ringMeshRef = useRef<THREE.Mesh | null>(null);
  const innerRingMeshRef = useRef<THREE.Mesh | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const updateHeartRef = useRef<((time: number, bpm: number, bp: number) => void) | null>(null);
  const updateLungsRef = useRef<((time: number) => void) | null>(null);
  const updateBrainRef = useRef<((time: number, isWarning: boolean) => void) | null>(null);

  const decisionReportRef = useRef(decisionReport);
  const currentReadingsRef = useRef(currentReadings);

  useEffect(() => {
    currentReadingsRef.current = currentReadings;
  }, [currentReadings]);

  useEffect(() => {
    decisionReportRef.current = decisionReport;
  }, [decisionReport]);

  const getStatusColor = (state: EvaluationState) => {
    switch (state) {
      case "ESCALAR_TIERRA":
        return "#f43f5e";
      case "ATENCION":
        return "#f97316";
      case "VIGILAR":
        return "#f59e0b";
      case "HABITUAL":
        return "#10b981";
      case "SIN_DATOS":
      default:
        return "#64748b";
    }
  };

  const getStatusSimpleName = (state: EvaluationState) => {
    if (language === "en") {
      switch (state) {
        case "ESCALAR_TIERRA":
          return "Request Help";
        case "ATENCION":
          return "Attention";
        case "VIGILAR":
          return "Watch";
        case "HABITUAL":
          return "Normal";
        case "SIN_DATOS":
        default:
          return "No data";
      }
    }
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
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // OrbitControls: rotación 3D fluida
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.0;
    controls.minDistance = 2.0;
    controls.maxDistance = 6.0;
    controls.enablePan = false;
    controls.target.set(0, 0.25, 0);
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minPolarAngle = Math.PI * 0.15;

    // Iluminación moderna aeromédica
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xbca6ff, 1.0);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const softCyanGlow = new THREE.DirectionalLight(0x66d8d1, 1.2);
    softCyanGlow.position.set(0, 3, -3);
    scene.add(softCyanGlow);

    // Plataforma circular translúcida estilo Smooth UI / Liquid Glass
    const platformGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.04, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0f1117,
      roughness: 0.18,
      metalness: 0.85,
      transparent: true,
      opacity: 0.75,
    });
    const platformMesh = new THREE.Mesh(platformGeom, platformMat);
    platformMesh.position.y = -1.18;
    scene.add(platformMesh);

    // Anillo exterior de luz en la base
    const ringGeom = new THREE.RingGeometry(1.5, 1.58, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x9975ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.16;
    scene.add(ringMesh);
    ringMeshRef.current = ringMesh;

    // Anillo interior concéntrico estilo radar médico
    const innerRingGeom = new THREE.RingGeometry(1.15, 1.18, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x66d8d1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeom, innerRingMat);
    innerRingMesh.rotation.x = Math.PI / 2;
    innerRingMesh.position.y = -1.16;
    scene.add(innerRingMesh);
    innerRingMeshRef.current = innerRingMesh;

    // Grupo de órganos y esqueleto real para modo rayos X
    const xrayGroup = new THREE.Group();
    xrayGroup.visible = false;
    xrayGroupRef.current = xrayGroup;

    // 1. CORAZÓN ANATÓMICO 3D REAL (con ventrículos, aurículas, cayado aórtico, coronarias y tronco pulmonar)
    const anatomicalHeart = createAnatomicalHeart();
    // Ubicado en el hemitórax izquierdo del astronauta (a la derecha del observador: +X)
    anatomicalHeart.group.position.set(0.045, 0.42, 0.02);
    xrayGroup.add(anatomicalHeart.group);
    heartMeshRef.current = anatomicalHeart.ventriclesMesh;
    updateHeartRef.current = anatomicalHeart.updateHeartBeat;

    // 2. PULMONES ANATÓMICOS BILATERALES
    const anatomicalLungs = createAnatomicalLungs();
    xrayGroup.add(anatomicalLungs.group);
    updateLungsRef.current = anatomicalLungs.updateRespiration;

    // 3. CEREBRO ANATÓMICO TRIDIMENSIONAL (Hemisferios cerebrales, cerebelo y red sináptica)
    const anatomicalBrain = createAnatomicalBrain();
    xrayGroup.add(anatomicalBrain.group);
    updateBrainRef.current = anatomicalBrain.updateBrainWaves;

    // 4. ESQUELETO HUMANO REAL 3D (BodyParts3D de mitina open-source)
    loadRealAnatomicalSkeleton()
      .then((skeleton) => {
        xrayGroup.add(skeleton);
      })
      .catch((err) => {
        console.warn("Carga de esqueleto 3D:", err);
      });

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

      const time = performance.now() * 0.001;
      const currentReport = decisionReportRef.current;
      const overallState = currentReport?.overallState;
      const isCrisis = overallState === "ESCALAR_TIERRA";
      const isAttention = overallState === "ATENCION";
      const isWarning = isCrisis || isAttention;

      const hr = currentReadingsRef.current.heart_rate || 60;
      const bp = currentReadingsRef.current.blood_pressure || 120;
      const temp = currentReadingsRef.current.core_temp || 36.8;

      // Actualizar contracción cardíaca fisiológica en tiempo real
      if (updateHeartRef.current) {
        updateHeartRef.current(time, hr, bp);
      }

      // Actualizar ciclo respiratorio en pulmones
      if (updateLungsRef.current) {
        updateLungsRef.current(time);
      }

      // Actualizar ondas cerebrales y red sináptica
      if (updateBrainRef.current) {
        updateBrainRef.current(time, isWarning);
      }

      // Respuesta fisiológica en el traje cuando hay emergencia o fiebre/hipotermia
      if (astronautModelRef.current) {
        const pulseSpeed = isCrisis ? 7 : isAttention ? 4 : 1.5;
        const alertPulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5;

        // Si hay fiebre severa (temp > 38.5) o shock hipotérmico (temp < 35.0)
        const isFever = temp >= 38.5;
        const isHypothermia = temp <= 35.0;

        suitMaterialsRef.current.forEach((mat) => {
          // @ts-expect-error Three.js material properties
          if (mat.emissive) {
            if (isCrisis) {
              // Pulso de alarma roja crítica
              // @ts-expect-error emissive set
              mat.emissive.setRGB(0.55 * alertPulse, 0.04, 0.08);
              // @ts-expect-error emissiveIntensity
              mat.emissiveIntensity = 0.35 + alertPulse * 0.45;
            } else if (isAttention) {
              // Pulso de atención naranja
              // @ts-expect-error emissive set
              mat.emissive.setRGB(0.5 * alertPulse, 0.22 * alertPulse, 0.03);
              // @ts-expect-error emissiveIntensity
              mat.emissiveIntensity = 0.25 + alertPulse * 0.35;
            } else if (isFever) {
              // Gradiente térmico infrarrojo de fiebre espacial
              // @ts-expect-error emissive set
              mat.emissive.setRGB(0.45 * alertPulse, 0.15 * alertPulse, 0.05);
              // @ts-expect-error emissiveIntensity
              mat.emissiveIntensity = 0.3 + alertPulse * 0.3;
            } else if (isHypothermia) {
              // Resplandor cian helado de hipotermia
              // @ts-expect-error emissive set
              mat.emissive.setRGB(0.05, 0.35 * alertPulse, 0.55 * alertPulse);
              // @ts-expect-error emissiveIntensity
              mat.emissiveIntensity = 0.3 + alertPulse * 0.3;
            } else {
              // @ts-expect-error emissive setHex
              mat.emissive.setHex(0x000000);
              // @ts-expect-error emissiveIntensity
              mat.emissiveIntensity = 0.0;
            }
          }
        });
      }

      // Anillo de luz en la base con pulso reactivo de alerta
      if (ringMeshRef.current) {
        const ringMat = ringMeshRef.current.material as THREE.MeshBasicMaterial;
        if (overallState === "ESCALAR_TIERRA") {
          ringMat.color.setHex(0xf43f5e);
          ringMat.opacity = 0.55 + Math.sin(time * 7) * 0.45;
        } else if (overallState === "ATENCION") {
          ringMat.color.setHex(0xf97316);
          ringMat.opacity = 0.55 + Math.sin(time * 4) * 0.35;
        } else if (overallState === "VIGILAR") {
          ringMat.color.setHex(0xf59e0b);
          ringMat.opacity = 0.5 + Math.sin(time * 2.5) * 0.25;
        } else {
          ringMat.color.setHex(0x9975ff);
          ringMat.opacity = 0.70;
        }
      }

      if (innerRingMeshRef.current) {
        const innerMat = innerRingMeshRef.current.material as THREE.MeshBasicMaterial;
        innerRingMeshRef.current.rotation.z = time * 0.2;
        if (isCrisis) {
          innerMat.color.setHex(0xff0054);
          innerMat.opacity = 0.6 + Math.sin(time * 8) * 0.4;
        } else {
          innerMat.color.setHex(0x66d8d1);
          innerMat.opacity = 0.45;
        }
      }

      // Iluminación ambiental y direccional reactiva de emergencia
      if (keyLightRef.current && fillLightRef.current) {
        if (overallState === "ESCALAR_TIERRA") {
          const pulse = 0.5 + Math.sin(time * 6) * 0.5;
          keyLightRef.current.color.setRGB(1.0, 0.2 * (1 - pulse), 0.25 * (1 - pulse));
          keyLightRef.current.intensity = 2.5;
          fillLightRef.current.color.setRGB(0.85, 0.1, 0.2);
          fillLightRef.current.intensity = 1.7;
        } else if (overallState === "ATENCION") {
          keyLightRef.current.color.setRGB(1.0, 0.55, 0.15);
          keyLightRef.current.intensity = 2.1;
          fillLightRef.current.color.setRGB(0.8, 0.3, 0.1);
          fillLightRef.current.intensity = 1.3;
        } else {
          keyLightRef.current.color.setHex(0xffffff);
          keyLightRef.current.intensity = 1.8;
          fillLightRef.current.color.setHex(0xbca6ff);
          fillLightRef.current.intensity = 1.0;
        }
      }

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

    // Raycaster para alternar visión de órganos al hacer clic en el astronauta
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerClick = (e: MouseEvent) => {
      if (!container || !astronautModelRef.current) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const objectsToTest: THREE.Object3D[] = [astronautModelRef.current];
      if (xrayGroupRef.current) objectsToTest.push(xrayGroupRef.current);
      const intersects = raycaster.intersectObjects(objectsToTest, true);

      if (intersects.length > 0) {
        setIsXrayActive((prev) => !prev);
      }
    };

    container.addEventListener("click", onPointerClick);

    return () => {
      container.removeEventListener("click", onPointerClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      controls.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Efecto modo rayos X: cristal translúcido ultra-limpio (Smooth UI glass), NUNCA wireframe tosco
  useEffect(() => {
    if (xrayGroupRef.current) {
      xrayGroupRef.current.visible = isXrayActive;
    }

    suitMaterialsRef.current.forEach((mat) => {
      const anyMat = mat as any;
      if (isXrayActive) {
        mat.transparent = true;
        mat.opacity = 0.12; // Traje como cristal aeroespacial ahumado sutil
        anyMat.roughness = 0.10;
        anyMat.metalness = 0.85;
        anyMat.wireframe = false;
        mat.depthWrite = false;
      } else {
        mat.transparent = false;
        mat.opacity = 1.0;
        anyMat.wireframe = false;
        mat.depthWrite = true;
      }
      mat.needsUpdate = true;
    });
  }, [isXrayActive]);


  const overallState = decisionReport.overallState;
  const isEmergencyActive = overallState === "ESCALAR_TIERRA" || overallState === "ATENCION";
  const tempReading = currentReadings.core_temp;
  const bpReading = currentReadings.blood_pressure;
  const hrReading = currentReadings.heart_rate;

  return (
    <section className="flex-1 h-full relative flex flex-col items-center justify-center bg-[#08090d] overflow-hidden select-none">
      {/* ========================================================
          BANNER DOCK SUPERIOR DE CONTINGENCIA / EMERGENCIA CLÍNICA
          (Acoplado al borde superior del visor 3D, nunca sobre el cuerpo del astronauta)
          ======================================================== */}
      {isEmergencyActive && (
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between gap-2 px-4 py-1.5 bg-rose-950/95 border-b border-rose-500/50 backdrop-blur-xl pointer-events-auto shadow-md shadow-black/50 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span className="p-1 rounded bg-rose-500/20 text-rose-400 flex-shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            </span>
            <span className="text-xs font-bold text-rose-200 uppercase tracking-wide whitespace-nowrap flex-shrink-0">
              {language === "en" ? "CRITICAL CLINICAL EMERGENCY:" : "EMERGENCIA CLÍNICA CRÍTICA:"}
            </span>
            <span className="text-xs text-rose-100 truncate font-medium">
              {activeScenarioName || decisionReport.primaryAction}
            </span>
            {tempReading && tempReading >= 38.5 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 font-mono font-semibold flex-shrink-0">
                {language === "en" ? "Fever" : "Fiebre"} {tempReading}°C
              </span>
            )}
            {bpReading && bpReading >= 160 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 font-mono font-semibold flex-shrink-0">
                {language === "en" ? "BP" : "TA"} {bpReading} mmHg
              </span>
            )}
          </div>

          <button
            onClick={() => resetToNominalCalm()}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            title="Restablecer telemetría nominal de calma"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === "en" ? "Normalize" : "Normalizar"}</span>
          </button>
        </div>
      )}

      {/* ========================================================
          BOTÓN DISCRETO ESQUINA SUPERIOR DERECHA (VER ÓRGANOS)
          (Completamente despejado, jamás en el centro ni tapando el cuerpo)
          ======================================================== */}
      <div
        className={`absolute right-4 z-20 pointer-events-auto transition-all duration-200 ${
          isEmergencyActive ? "top-11" : "top-3.5"
        }`}
      >
        <button
          onClick={() => setIsXrayActive(!isXrayActive)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-lg ${
            isXrayActive
              ? "bg-[#9975ff] text-white shadow-purple-500/30 ring-2 ring-purple-400/40"
              : "glass-panel text-slate-200 hover:text-white hover:bg-white/10"
          }`}
          title="Alternar vista de órganos y esqueleto 3D"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>
            {isXrayActive
              ? language === "en"
                ? "Hide Organs"
                : "Ocultar órganos"
              : language === "en"
              ? "Show Organs"
              : "Ver órganos"}
          </span>
        </button>
      </div>

      {/* Indicador de carga inicial */}
      {isLoadingModel && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-30 pointer-events-none">
          <div className="glass-panel px-6 py-4 rounded-xl flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#9975ff] border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-white tracking-wide">
              {language === "en"
                ? "Loading 3D model & medical anatomy..."
                : "Cargando modelo 3D y anatomía médica..."}
            </span>
          </div>
        </div>
      )}


      {/* Contenedor Three.js */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* ========================================================
          HOTSPOTS ANATÓMICOS FLOTANTES CON PULSO
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {HOTSPOTS.map((node) => {
          const evalData = decisionReport.evaluations[node.id];
          const state = evalData?.state ?? "HABITUAL";
          const color = getStatusColor(state);
          const simpleStateName = getStatusSimpleName(state);
          const isSelected = selectedIndicatorId === node.id;
          const isHovered = hoveredNodeId === node.id;
          const isWarning = state === "ESCALAR_TIERRA" || state === "ATENCION";
          const isHeart = node.id === "heart_rate";
          const heartBpm = currentReadings.heart_rate || 60;
          const heartPeriodSec = (60 / heartBpm).toFixed(2);

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
                    ? "w-11 h-11 ring-4 ring-[#9975ff]/50 scale-110 z-30 shadow-xl shadow-purple-500/40"
                    : "w-8.5 h-8.5 hover:scale-110 hover:ring-2 hover:ring-white/40"
                }`}
                style={{
                  backgroundColor: "rgba(17, 18, 24, 0.92)",
                  borderColor: isSelected ? "#9975ff" : color,
                  borderWidth: isSelected ? "2.5px" : "1.5px",
                  boxShadow: `0 4px 14px ${color}60`,
                }}
                title={`${node.simpleName} (${simpleStateName})`}
                aria-label={node.simpleName}
              >
                <span style={{ color }}>{node.icon}</span>

                {isHeart && (
                  <span
                    className="absolute -inset-2.5 rounded-full pointer-events-none opacity-80"
                    style={{
                      border: `1.5px solid ${color}`,
                      animation: `ping ${heartPeriodSec}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                    }}
                  />
                )}

                {isWarning && (
                  <>
                    <span
                      className="absolute -inset-1.5 rounded-full animate-ping opacity-75"
                      style={{ backgroundColor: color }}
                    />
                    <span
                      className="absolute -inset-3.5 rounded-full animate-pulse opacity-40"
                      style={{ backgroundColor: color }}
                    />
                  </>
                )}
              </button>

              {/* Tooltip moderno Liquid Glass */}
              {isHovered && !isSelected && (
                <div className="absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap glass-panel px-3 py-1.5 text-xs text-white shadow-xl z-40 animate-in fade-in zoom-in-95 duration-150 rounded-lg">
                  <div className="font-semibold text-white">
                    {simpleIndicators[node.id]?.name || node.simpleName}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {language === "en" ? "Status:" : "Estado:"}{" "}
                    <strong style={{ color }}>{simpleStateName}</strong>
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
              className={`text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 font-medium cursor-pointer ${
                isSelected
                  ? "bg-[#9975ff] text-white font-semibold shadow-lg shadow-purple-500/30 ring-2 ring-white/20"
                  : "glass-pill text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>{simpleIndicators[node.id]?.name || node.simpleName}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
