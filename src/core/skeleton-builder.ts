import * as THREE from "three";

// Decodificador base64 a BufferAttribute de Three.js idéntico al de BodyParts3D
function decodeBase64ToTypedArray(s: string, TypedArrayConstructor: any) {
  const binaryString = atob(s);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TypedArrayConstructor(bytes.buffer);
}

export function createBoneGeometry(
  boneData: { p: string; i: string; n: number },
  scaleMultiplier: number
): THREE.BufferGeometry {
  const coords = decodeBase64ToTypedArray(boneData.p, Int16Array);
  const positions = new Float32Array(coords.length);

  for (let i = 0; i < coords.length; i++) {
    positions[i] = coords[i] * scaleMultiplier;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const indices = decodeBase64ToTypedArray(
    boneData.i,
    boneData.n < 65535 ? Uint16Array : Uint32Array
  );
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Carga el esqueleto 3D real de BodyParts3D desde /models/skeleton-3d.js
 * y genera una estructura THREE.Group escalada perfectamente para habitar
 * el traje espacial del astronauta (2.2m).
 */
export async function loadRealAnatomicalSkeleton(): Promise<THREE.Group> {
  // Asegurar que el script esté disponible
  if (typeof window !== "undefined" && !(window as any).BODY_DATA) {
    await new Promise<void>((resolve) => {
      // Reintentar si ya se está cargando por layout.tsx
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        if ((window as any).BODY_DATA || attempts > 30) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      const existingScript = document.querySelector('script[src="/models/skeleton-3d.js"]');
      if (existingScript) {
        existingScript.addEventListener("load", () => {
          clearInterval(checkInterval);
          resolve();
        });
      } else {
        const script = document.createElement("script");
        script.src = "/models/skeleton-3d.js";
        script.async = true;
        script.onload = () => {
          clearInterval(checkInterval);
          resolve();
        };
        script.onerror = () => {
          clearInterval(checkInterval);
          resolve();
        };
        document.head.appendChild(script);
      }
    });
  }

  const bodyData = (window as any).BODY_DATA;
  if (!bodyData) {
    console.warn("BODY_DATA no disponible en window, usando fallback procedural");
    throw new Error("No se pudo cargar BODY_DATA del esqueleto 3D");
  }

  const skeletonGroup = new THREE.Group();
  skeletonGroup.name = "RealAnatomicalSkeleton";

  // El modelo del astronauta tiene una altura de 2.2 unidades.
  // El esqueleto BodyParts3D con escala base 0.01 mide 164.26 unidades.
  // Altura objetivo: 1.94m dentro del traje:
  const targetSkeletonHeight = 1.94;
  const originalHeight = 164.26;
  const netScale = 0.01 * (targetSkeletonHeight / originalHeight);

  // Material óseo de alta resolución con acabado bio-holográfico médico aeroespacial
  const boneMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Marfil óseo pulido
    roughness: 0.36,
    metalness: 0.10,
    emissive: 0x9975ff,
    emissiveIntensity: 0.15,
  });

  // Huesos de la caja torácica translúcidos para ver el corazón anatómico y grandes vasos
  const ribcageMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.32,
    metalness: 0.08,
    emissive: 0x66d8d1,
    emissiveIntensity: 0.18,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
  });

  // Cráneo translúcido para apreciar la estructura cerebral
  const skullMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35,
    metalness: 0.10,
    emissive: 0xa855f7,
    emissiveIntensity: 0.16,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
  });

  for (const boneKey of Object.keys(bodyData)) {
    const rawBone = bodyData[boneKey];
    if (!rawBone || !rawBone.p || !rawBone.i) continue;

    try {
      const geo = createBoneGeometry(rawBone, netScale);
      let mat = boneMaterial;
      if (boneKey === "thorax") {
        mat = ribcageMaterial;
      } else if (boneKey === "skull") {
        mat = skullMaterial;
      }
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = `bone_${boneKey}`;
      skeletonGroup.add(mesh);
    } catch (e) {
      console.warn(`Error al decodificar hueso ${boneKey}:`, e);
    }
  }

  // Alineación precisa del esqueleto en el eje vertical
  skeletonGroup.position.set(0, -0.02, 0);

  return skeletonGroup;
}
