import * as THREE from "three";

/**
 * Mins-Health Anatomical Organs System — NASA Space Apps Challenge 2026
 * Modelos 3D anatómicos realistas bio-holográficos para la cabina médica aeroespacial:
 * 1. Corazón anatómico con ventrículos, aurículas, cayado aórtico, arterias coronarias y tronco pulmonar.
 * 2. Pulmones anatómicos bilaterales (lóbulos y escotadura cardíaca) con ciclo respiratorio.
 * 3. Cerebro anatómico tridimensional con hemisferios cerebrales, cerebelo y red sináptica.
 */

// ============================================================================
// 1. CORAZÓN ANATÓMICO 3D (ANATOMICAL HEART)
// ============================================================================
export interface AnatomicalHeartInstance {
  group: THREE.Group;
  ventriclesMesh: THREE.Mesh;
  aortaMesh: THREE.Mesh;
  coronaryMesh: THREE.Mesh;
  updateHeartBeat: (time: number, bpm: number, bp: number) => void;
}

export function createAnatomicalHeart(): AnatomicalHeartInstance {
  const heartGroup = new THREE.Group();
  heartGroup.name = "AnatomicalHeartReal";

  // VENTRÍCULOS ORGÁNICOS (MIOCARDIO CON ÁPICE ASIMÉTRICO)
  const ventGeom = new THREE.SphereGeometry(0.086, 36, 30);
  const posAttr = ventGeom.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);

    // Tapering hacia el ápice inferior (y < 0)
    if (vertex.y < 0) {
      const taper = 1.0 - Math.abs(vertex.y) * 4.3;
      vertex.x *= Math.max(0.24, taper);
      vertex.z *= Math.max(0.28, taper);
      // Ápice desviado hacia la izquierda anatómica del astronauta (+X)
      vertex.x += Math.abs(vertex.y) * 0.42;
      vertex.z += Math.abs(vertex.y) * 0.14;
      vertex.y *= 1.38;
    } else {
      // Base ventricular ensanchada con convexidad
      vertex.x *= 1.14;
      vertex.z *= 0.96;
    }

    // Surco interventricular anterior oblicuo
    if (vertex.z > 0.015 && vertex.x > -0.015 && vertex.x < 0.04) {
      vertex.z *= 0.86;
    }

    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  ventGeom.computeVertexNormals();

  const myocardialMat = new THREE.MeshStandardMaterial({
    color: 0xbe123c, // Rojo rubí arterial
    roughness: 0.30,
    metalness: 0.12,
    emissive: 0x881337,
    emissiveIntensity: 0.4,
  });

  const ventriclesMesh = new THREE.Mesh(ventGeom, myocardialMat);
  heartGroup.add(ventriclesMesh);

  // AURÍCULAS (ATRIOS DERECHO E IZQUIERDO)
  const atrialMat = new THREE.MeshStandardMaterial({
    color: 0x9f1239,
    roughness: 0.38,
    metalness: 0.08,
    emissive: 0x4c0519,
    emissiveIntensity: 0.3,
  });

  // Aurícula derecha
  const rightAtriumGeom = new THREE.SphereGeometry(0.044, 20, 16);
  rightAtriumGeom.scale(1.1, 0.92, 0.95);
  const rightAtrium = new THREE.Mesh(rightAtriumGeom, atrialMat);
  rightAtrium.position.set(-0.044, 0.068, -0.015);
  heartGroup.add(rightAtrium);

  // Aurícula izquierda
  const leftAtriumGeom = new THREE.SphereGeometry(0.048, 20, 16);
  leftAtriumGeom.scale(1.15, 0.95, 0.9);
  const leftAtrium = new THREE.Mesh(leftAtriumGeom, atrialMat);
  leftAtrium.position.set(0.046, 0.07, -0.022);
  heartGroup.add(leftAtrium);

  // CAYADO AÓRTICO (AORTIC ARCH)
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.012, 0.052, 0.012),
    new THREE.Vector3(0.006, 0.115, 0.016),
    new THREE.Vector3(-0.016, 0.142, 0.006),
    new THREE.Vector3(-0.034, 0.128, -0.026),
    new THREE.Vector3(-0.036, 0.048, -0.04),
  ]);
  const aortaGeom = new THREE.TubeGeometry(aortaCurve, 28, 0.019, 16, false);
  const aortaMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.25,
    metalness: 0.15,
    emissive: 0x9f1239,
    emissiveIntensity: 0.5,
  });
  const aortaMesh = new THREE.Mesh(aortaGeom, aortaMat);
  heartGroup.add(aortaMesh);

  // 3 Ramas supraaórticas
  const branches = [
    { pos: new THREE.Vector3(-0.005, 0.146, 0.012), rotZ: -0.16, h: 0.03 },
    { pos: new THREE.Vector3(-0.019, 0.149, 0.004), rotZ: -0.04, h: 0.027 },
    { pos: new THREE.Vector3(-0.030, 0.143, -0.014), rotZ: 0.14, h: 0.025 },
  ];
  branches.forEach((b) => {
    const brGeom = new THREE.CylinderGeometry(0.0055, 0.0065, b.h, 10);
    const brMesh = new THREE.Mesh(brGeom, aortaMat);
    brMesh.position.copy(b.pos);
    brMesh.rotation.z = b.rotZ;
    heartGroup.add(brMesh);
  });

  // TRONCO PULMONAR Y ARTERIAS PULMONARES (CYAN-INDIGO)
  const pulmonaryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.018, 0.046, 0.038),
    new THREE.Vector3(-0.005, 0.092, 0.030),
    new THREE.Vector3(0.020, 0.112, -0.002),
  ]);
  const pulmonaryGeom = new THREE.TubeGeometry(pulmonaryCurve, 20, 0.016, 14, false);
  const pulmonaryMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.32,
    metalness: 0.1,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
  });
  const pulmonaryMesh = new THREE.Mesh(pulmonaryGeom, pulmonaryMat);
  heartGroup.add(pulmonaryMesh);

  // ARTERIAS CORONARIAS CON PULSO LUMINOSO (LAD)
  const ladCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.008, 0.05, 0.065),
    new THREE.Vector3(0.014, 0.014, 0.072),
    new THREE.Vector3(0.025, -0.036, 0.054),
    new THREE.Vector3(0.036, -0.084, 0.026),
  ]);
  const ladGeom = new THREE.TubeGeometry(ladCurve, 24, 0.003, 8, false);
  const ladMat = new THREE.MeshStandardMaterial({
    color: 0xff4d6d,
    emissive: 0xff0054,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });
  const coronaryMesh = new THREE.Mesh(ladGeom, ladMat);
  heartGroup.add(coronaryMesh);

  // Escala anatómica general
  heartGroup.scale.set(1.18, 1.18, 1.18);

  const updateHeartBeat = (time: number, bpm: number, bp: number) => {
    const freq = (bpm / 60) * 2 * Math.PI;
    const phase = (time * freq) % (2 * Math.PI);
    const normalizedPhase = phase / (2 * Math.PI);

    let cardiacCycle = 0;
    if (normalizedPhase < 0.12) {
      cardiacCycle = Math.sin((normalizedPhase / 0.12) * Math.PI) * 0.08;
    } else if (normalizedPhase >= 0.12 && normalizedPhase < 0.42) {
      const s = (normalizedPhase - 0.12) / 0.3;
      cardiacCycle = Math.sin(s * Math.PI) * 0.24;
    } else {
      cardiacCycle = 0;
    }

    const bpScale = Math.max(0.6, Math.min(1.85, bp / 120));
    const scaleFactor = 1.0 + cardiacCycle * bpScale;

    // Torsión fisiológica y eyección
    ventriclesMesh.scale.set(scaleFactor, scaleFactor * 0.95, scaleFactor);
    ventriclesMesh.rotation.y = -0.15 + cardiacCycle * 0.20;
    ventriclesMesh.rotation.z = 0.22 - cardiacCycle * 0.10;

    // Expansión aórtica sistólica
    const aortaScale = 1.0 + (cardiacCycle > 0.08 ? (cardiacCycle - 0.08) * 0.35 * bpScale : 0);
    aortaMesh.scale.set(aortaScale, aortaScale, aortaScale);

    // Destello de flujo coronario
    ladMat.emissiveIntensity = 0.5 + cardiacCycle * 1.5;
  };

  return {
    group: heartGroup,
    ventriclesMesh,
    aortaMesh,
    coronaryMesh,
    updateHeartBeat,
  };
}

// ============================================================================
// 2. PULMONES ANATÓMICOS 3D (ANATOMICAL LUNGS)
// ============================================================================
export interface AnatomicalLungsInstance {
  group: THREE.Group;
  updateRespiration: (time: number) => void;
}

export function createAnatomicalLungs(): AnatomicalLungsInstance {
  const lungsGroup = new THREE.Group();
  lungsGroup.name = "AnatomicalLungsReal";

  const lungMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.16,
    roughness: 0.2,
    metalness: 0.1,
    emissive: 0x0284c7,
    emissiveIntensity: 0.25,
    depthWrite: false,
  });

  // Pulmón Derecho (3 lóbulos, ligeramente más ancho)
  const rightLungGeom = new THREE.SphereGeometry(0.082, 24, 20);
  rightLungGeom.scale(0.85, 1.6, 0.75);
  const rightLung = new THREE.Mesh(rightLungGeom, lungMat);
  rightLung.position.set(-0.095, 0.43, 0.005);
  lungsGroup.add(rightLung);

  // Pulmón Izquierdo (2 lóbulos con escotadura cardíaca)
  const leftLungGeom = new THREE.SphereGeometry(0.078, 24, 20);
  leftLungGeom.scale(0.80, 1.55, 0.72);
  const leftLung = new THREE.Mesh(leftLungGeom, lungMat);
  leftLung.position.set(0.105, 0.43, 0.005);
  lungsGroup.add(leftLung);

  const updateRespiration = (time: number) => {
    // Frecuencia respiratoria nominal ~14 respiraciones por minuto
    const respCycle = Math.sin(time * 1.45);
    const expand = 1.0 + respCycle * 0.045;
    rightLung.scale.set(0.85 * expand, 1.6 * expand, 0.75 * expand);
    leftLung.scale.set(0.80 * expand, 1.55 * expand, 0.72 * expand);
  };

  return {
    group: lungsGroup,
    updateRespiration,
  };
}

// ============================================================================
// 3. CEREBRO ANATÓMICO 3D (ANATOMICAL BRAIN)
// ============================================================================
export interface AnatomicalBrainInstance {
  group: THREE.Group;
  updateBrainWaves: (time: number, isWarning: boolean) => void;
}

export function createAnatomicalBrain(): AnatomicalBrainInstance {
  const brainGroup = new THREE.Group();
  brainGroup.name = "AnatomicalBrainReal";

  const brainMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc, // Lavanda bioluminiscente
    roughness: 0.35,
    metalness: 0.15,
    emissive: 0x9333ea,
    emissiveIntensity: 0.45,
    transparent: true,
    opacity: 0.88,
  });

  // Hemisferio Izquierdo
  const leftHemiGeom = new THREE.SphereGeometry(0.052, 28, 24);
  leftHemiGeom.scale(0.88, 1.15, 1.35);
  const leftHemi = new THREE.Mesh(leftHemiGeom, brainMat);
  leftHemi.position.set(0.024, 0.94, 0.015);
  brainGroup.add(leftHemi);

  // Hemisferio Derecho
  const rightHemiGeom = new THREE.SphereGeometry(0.052, 28, 24);
  rightHemiGeom.scale(0.88, 1.15, 1.35);
  const rightHemi = new THREE.Mesh(rightHemiGeom, brainMat);
  rightHemi.position.set(-0.024, 0.94, 0.015);
  brainGroup.add(rightHemi);

  // Cerebelo (posterior e inferior)
  const cerebMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    roughness: 0.4,
    metalness: 0.1,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.85,
  });
  const cerebGeom = new THREE.SphereGeometry(0.034, 20, 16);
  cerebGeom.scale(1.3, 0.8, 0.9);
  const cerebMesh = new THREE.Mesh(cerebGeom, cerebMat);
  cerebMesh.position.set(0, 0.89, -0.038);
  brainGroup.add(cerebMesh);

  // Tronco encefálico (conecta con médula cervical)
  const stemGeom = new THREE.CylinderGeometry(0.012, 0.010, 0.045, 12);
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x9333ea,
    emissive: 0x6b21a8,
    emissiveIntensity: 0.3,
  });
  const stemMesh = new THREE.Mesh(stemGeom, stemMat);
  stemMesh.position.set(0, 0.865, -0.015);
  brainGroup.add(stemMesh);

  // Red de sinapsis neurales (holograma de puntos bioeléctricos)
  const synapseCount = 38;
  const synGeom = new THREE.BufferGeometry();
  const synPositions = new Float32Array(synapseCount * 3);
  for (let i = 0; i < synapseCount; i++) {
    const angle = (i / synapseCount) * Math.PI * 2;
    const r = 0.042 + Math.sin(i * 3.7) * 0.015;
    synPositions[i * 3] = Math.cos(angle) * r;
    synPositions[i * 3 + 1] = 0.94 + Math.sin(i * 2.3) * 0.025;
    synPositions[i * 3 + 2] = Math.sin(angle) * (r * 1.3) + 0.015;
  }
  synGeom.setAttribute("position", new THREE.BufferAttribute(synPositions, 3));
  const synMat = new THREE.PointsMaterial({
    color: 0x66d8d1,
    size: 0.008,
    transparent: true,
    opacity: 0.85,
  });
  const synPoints = new THREE.Points(synGeom, synMat);
  brainGroup.add(synPoints);

  const updateBrainWaves = (time: number, isWarning: boolean) => {
    const wave = 0.35 + Math.sin(time * 3.2) * 0.2;
    brainMat.emissiveIntensity = isWarning ? 0.6 + Math.sin(time * 6) * 0.4 : wave;
    if (isWarning) {
      synMat.color.setHex(0xf43f5e);
    } else {
      synMat.color.setHex(0x66d8d1);
    }
  };

  return {
    group: brainGroup,
    updateBrainWaves,
  };
}
