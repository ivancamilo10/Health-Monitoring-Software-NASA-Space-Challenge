import * as THREE from "three";

/**
 * Genera un modelo anatómico tridimensional realista del corazón humano (Anatomical Human Heart),
 * con ventrículos asimétricos con ápice orientado a la izquierda, aurículas,
 * cayado aórtico con ramas supraaórticas, tronco pulmonar, vena cava y arterias coronarias.
 */
export function createAnatomicalHeart(): {
  group: THREE.Group;
  ventriclesMesh: THREE.Mesh;
  aortaMesh: THREE.Mesh;
  updateHeartBeat: (time: number, bpm: number, bp: number) => void;
} {
  const heartGroup = new THREE.Group();
  heartGroup.name = "AnatomicalHeart";

  // ========================================================
  // 1. VENTRÍCULOS (MIOCARDIO Y ÁPICE CARDÍACO ASIMÉTRICO)
  // ========================================================
  // Geometría orgánica deformada basada en la morfología del corazón humano
  const ventGeom = new THREE.SphereGeometry(0.082, 36, 28);
  const posAttr = ventGeom.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);

    // Tapering hacia el ápice inferior (y < 0)
    if (vertex.y < 0) {
      const taper = 1.0 - Math.abs(vertex.y) * 4.2;
      vertex.x *= Math.max(0.28, taper);
      vertex.z *= Math.max(0.32, taper);
      // Apéndice / ápice cardíaco desviado hacia la izquierda anatómica (x > 0) y ligeramente anterior (z > 0)
      vertex.x += Math.abs(vertex.y) * 0.38;
      vertex.z += Math.abs(vertex.y) * 0.12;
      vertex.y *= 1.35; // Alargamiento ventricular
    } else {
      // Base ventricular ensanchada con hendidura surco coronario
      vertex.x *= 1.12;
      vertex.z *= 0.95;
    }

    // Surco interventricular anterior (depresión oblicua en la cara frontal)
    if (vertex.z > 0.02 && vertex.x > -0.02 && vertex.x < 0.04) {
      vertex.z *= 0.88;
    }

    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  ventGeom.computeVertexNormals();

  const myocardialMat = new THREE.MeshStandardMaterial({
    color: 0x9f1239, // Rojo carmesí miocárdico profundo
    roughness: 0.32,
    metalness: 0.08,
    emissive: 0x4c0519,
    emissiveIntensity: 0.45,
  });

  const ventriclesMesh = new THREE.Mesh(ventGeom, myocardialMat);
  ventriclesMesh.position.set(0, 0, 0);
  heartGroup.add(ventriclesMesh);

  // ========================================================
  // 2. AURÍCULAS (ATRIOS DERECHO E IZQUIERDO)
  // ========================================================
  const atrialMat = new THREE.MeshStandardMaterial({
    color: 0x881337,
    roughness: 0.4,
    metalness: 0.05,
    emissive: 0x3f0312,
    emissiveIntensity: 0.3,
  });

  // Aurícula derecha
  const rightAtriumGeom = new THREE.SphereGeometry(0.042, 20, 16);
  rightAtriumGeom.scale(1.1, 0.9, 0.95);
  const rightAtrium = new THREE.Mesh(rightAtriumGeom, atrialMat);
  rightAtrium.position.set(-0.042, 0.065, -0.015);
  heartGroup.add(rightAtrium);

  // Aurícula izquierda y orejuela
  const leftAtriumGeom = new THREE.SphereGeometry(0.046, 20, 16);
  leftAtriumGeom.scale(1.15, 0.95, 0.9);
  const leftAtrium = new THREE.Mesh(leftAtriumGeom, atrialMat);
  leftAtrium.position.set(0.045, 0.068, -0.02);
  heartGroup.add(leftAtrium);

  // ========================================================
  // 3. GRANDES VASOS: CAYADO AÓRTICO (AORTIC ARCH)
  // ========================================================
  // Curva tridimensional que asciende del ventrículo izquierdo y se arquea hacia atrás
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.012, 0.05, 0.01),
    new THREE.Vector3(0.005, 0.11, 0.015),
    new THREE.Vector3(-0.015, 0.138, 0.005),
    new THREE.Vector3(-0.032, 0.125, -0.025),
    new THREE.Vector3(-0.034, 0.05, -0.038),
  ]);

  const aortaGeom = new THREE.TubeGeometry(aortaCurve, 28, 0.018, 16, false);
  const aortaMat = new THREE.MeshStandardMaterial({
    color: 0xe11d48, // Rojo escarlata arterial
    roughness: 0.28,
    metalness: 0.12,
    emissive: 0x881337,
    emissiveIntensity: 0.35,
  });
  const aortaMesh = new THREE.Mesh(aortaGeom, aortaMat);
  heartGroup.add(aortaMesh);

  // 3 Ramas supraaórticas: Tronco braquiocefálico, Carótida común, Subclavia
  const branchCoords = [
    { pos: new THREE.Vector3(-0.005, 0.142, 0.01), rotZ: -0.18, height: 0.028 },
    { pos: new THREE.Vector3(-0.018, 0.145, 0.002), rotZ: -0.05, height: 0.025 },
    { pos: new THREE.Vector3(-0.028, 0.140, -0.012), rotZ: 0.15, height: 0.024 },
  ];

  branchCoords.forEach((b) => {
    const branchGeom = new THREE.CylinderGeometry(0.0055, 0.0065, b.height, 12);
    const branchMesh = new THREE.Mesh(branchGeom, aortaMat);
    branchMesh.position.copy(b.pos);
    branchMesh.rotation.z = b.rotZ;
    heartGroup.add(branchMesh);
  });

  // ========================================================
  // 4. TRONCO PULMONAR (PULMONARY ARTERY TRUNK)
  // ========================================================
  const pulmonaryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.018, 0.045, 0.035),
    new THREE.Vector3(-0.005, 0.088, 0.028),
    new THREE.Vector3(0.018, 0.108, -0.002),
  ]);
  const pulmonaryGeom = new THREE.TubeGeometry(pulmonaryCurve, 20, 0.016, 14, false);
  const pulmonaryMat = new THREE.MeshStandardMaterial({
    color: 0x4338ca, // Azul violáceo sangre desoxigenada pulmonar
    roughness: 0.35,
    metalness: 0.08,
    emissive: 0x1e1b4b,
    emissiveIntensity: 0.3,
  });
  const pulmonaryMesh = new THREE.Mesh(pulmonaryGeom, pulmonaryMat);
  heartGroup.add(pulmonaryMesh);

  // Ramas pulmonares derecha e izquierda
  const leftPulmGeom = new THREE.CylinderGeometry(0.008, 0.009, 0.032, 10);
  const leftPulm = new THREE.Mesh(leftPulmGeom, pulmonaryMat);
  leftPulm.position.set(0.032, 0.108, -0.012);
  leftPulm.rotation.z = Math.PI / 2.8;
  heartGroup.add(leftPulm);

  // ========================================================
  // 5. VENA CAVA SUPERIOR
  // ========================================================
  const venaCavaGeom = new THREE.CylinderGeometry(0.013, 0.014, 0.055, 12);
  const venaCavaMat = new THREE.MeshStandardMaterial({
    color: 0x3730a3,
    roughness: 0.35,
    metalness: 0.05,
    emissive: 0x1e1b4b,
    emissiveIntensity: 0.25,
  });
  const venaCava = new THREE.Mesh(venaCavaGeom, venaCavaMat);
  venaCava.position.set(-0.052, 0.11, -0.025);
  heartGroup.add(venaCava);

  // ========================================================
  // 6. ARTERIAS CORONARIAS (CORONARY VESSELS)
  // ========================================================
  // Arteria descendente anterior (LAD) que recorre el surco frontal hacia el ápice
  const ladCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.008, 0.048, 0.062),
    new THREE.Vector3(0.014, 0.012, 0.068),
    new THREE.Vector3(0.024, -0.035, 0.052),
    new THREE.Vector3(0.034, -0.082, 0.026),
  ]);
  const ladGeom = new THREE.TubeGeometry(ladCurve, 24, 0.0028, 8, false);
  const coronaryArteryMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xf43f5e,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });
  const ladMesh = new THREE.Mesh(ladGeom, coronaryArteryMat);
  heartGroup.add(ladMesh);

  // Vena cardíaca magna (azul)
  const veinCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.002, 0.045, 0.06),
    new THREE.Vector3(0.006, 0.01, 0.066),
    new THREE.Vector3(0.016, -0.032, 0.05),
    new THREE.Vector3(0.025, -0.078, 0.024),
  ]);
  const veinGeom = new THREE.TubeGeometry(veinCurve, 20, 0.0024, 8, false);
  const coronaryVeinMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x0891b2,
    emissiveIntensity: 0.5,
    roughness: 0.2,
  });
  const veinMesh = new THREE.Mesh(veinGeom, coronaryVeinMat);
  heartGroup.add(veinMesh);

  // Escala anatómica general del corazón (alrededor de 12-14 cm en un adulto = ~0.14 unidades en la escena)
  heartGroup.scale.set(1.15, 1.15, 1.15);

  // ========================================================
  // 7. FUNCIÓN DE CONTRACCIÓN CARDÍACA FISIOLÓGICA (SÍSTOLE + DIÁSTOLE)
  // ========================================================
  const updateHeartBeat = (time: number, bpm: number, bp: number) => {
    const freq = (bpm / 60) * 2 * Math.PI;
    const phase = (time * freq) % (2 * Math.PI);

    // Ciclo cardíaco real: sístole ventricular vigorosa (contracción corta) + relajación diastólica (más larga)
    const normalizedPhase = phase / (2 * Math.PI);
    let cardiacCycle = 0;

    if (normalizedPhase < 0.12) {
      // Contracción auricular rápida previa (auricular kick)
      cardiacCycle = Math.sin((normalizedPhase / 0.12) * Math.PI) * 0.06;
    } else if (normalizedPhase >= 0.12 && normalizedPhase < 0.42) {
      // Sístole ventricular (Eyección potente rápida)
      const systoleSub = (normalizedPhase - 0.12) / 0.3;
      cardiacCycle = Math.sin(systoleSub * Math.PI) * 0.22;
    } else {
      // Diástole y llenado ventricular suave
      cardiacCycle = 0;
    }

    const bpScale = Math.max(0.65, Math.min(1.8, bp / 120));
    const scaleFactor = 1.0 + cardiacCycle * bpScale;

    // Movimiento torsional fisiológico: torsión del ventrículo en sístole
    ventriclesMesh.scale.set(scaleFactor, scaleFactor * 0.96, scaleFactor);
    ventriclesMesh.rotation.y = -0.15 + cardiacCycle * 0.18;
    ventriclesMesh.rotation.z = 0.25 - cardiacCycle * 0.08;

    // Pulso arterial expansivo en la aorta
    const aortaScale = 1.0 + (cardiacCycle > 0.08 ? (cardiacCycle - 0.08) * 0.3 * bpScale : 0);
    aortaMesh.scale.set(aortaScale, aortaScale, aortaScale);
  };

  return {
    group: heartGroup,
    ventriclesMesh,
    aortaMesh,
    updateHeartBeat,
  };
}
