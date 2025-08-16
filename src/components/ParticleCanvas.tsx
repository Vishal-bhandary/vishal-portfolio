import { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// Constants
const NUM_POINTS = 8000;
const CANVAS_WIDTH = 550;
const CANVAS_HEIGHT = 550;

// ---------------------- Shape Generators ---------------------- //

// 1. Ancient / Historic
function createGizaPyramidPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  const mainCount = Math.floor(count * 0.7);
  for (let i = 0; i < count; i++) {
    let x, y, z;
    if (i < mainCount) {
      const u = Math.random() - 0.5;
      const v = Math.random() - 0.5;
      const pyramidHeight = 1.0;
      const height = Math.random() * pyramidHeight;
      if (Math.abs(u) + Math.abs(v) < 0.5 * (pyramidHeight - height)) {
        x = u; z = v; y = -0.5 + height;
      } else {
        x = (Math.random() - 0.5); y = (Math.random() - 0.5); z = (Math.random() - 0.5);
      }
      x *= scale; y *= scale; z *= scale;
    } else {
      x = (Math.random() - 0.5) * scale * 2.5;
      y = (Math.random() - 0.5) * scale * 2.5;
      z = (Math.random() - 0.5) * scale * 2.5;
    }
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
  }
  return points;
}

function createEyeOfHorusPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * 2 * Math.PI;
    const r = 0.3 + 0.7 * Math.random();
    const angle = t + Math.sin(t * 2) * 0.5;
    points[i * 3] = Math.cos(angle) * r * scale;
    points[i * 3 + 1] = Math.sin(angle) * r * scale * 0.6;
    points[i * 3 + 2] = (Math.random() - 0.5) * 0.1 * scale;
  }
  return points;
}

function createObeliskPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  const height = scale * 2;
  const width = scale * 0.2;
  for (let i = 0; i < count; i++) {
    points[i * 3] = (Math.random() - 0.5) * width;
    points[i * 3 + 1] = Math.random() * height - height / 2;
    points[i * 3 + 2] = (Math.random() - 0.5) * width;
  }
  return points;
}

function createStonehengePoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  const numStones = 8;
  for (let i = 0; i < count; i++) {
    const angle = (i % numStones) * (Math.PI * 2 / numStones);
    const radius = scale;
    const height = scale * 0.5;
    points[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.1;
    points[i * 3 + 1] = Math.random() * height;
    points[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.1;
  }
  return points;
}

function createMayanPyramidPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  const levels = 5;
  for (let i = 0; i < count; i++) {
    const level = Math.floor(Math.random() * levels);
    const levelScale = (levels - level) / levels;
    points[i * 3] = (Math.random() - 0.5) * levelScale * scale;
    points[i * 3 + 1] = level * (scale / levels) - scale / 2;
    points[i * 3 + 2] = (Math.random() - 0.5) * levelScale * scale;
  }
  return points;
}

// 2. Mystical / Occult
function createPentagramPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  const angles = [0, 4, 1, 3, 2, 0].map(i => i * (2 * Math.PI / 5));
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * (angles.length - 1));
    const t = Math.random();
    const x = (Math.cos(angles[idx]) * (1 - t) + Math.cos(angles[idx + 1]) * t) * scale;
    const y = (Math.sin(angles[idx]) * (1 - t) + Math.sin(angles[idx + 1]) * t) * scale;
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = (Math.random() - 0.5) * 0.1 * scale;
  }
  return points;
}

function createHexagramPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  const angles = [0, 2, 4, 0].map(i => i * Math.PI / 3);
  const angles2 = [1, 3, 5, 1].map(i => i * Math.PI / 3);
  for (let i = 0; i < count; i++) {
    const arr = Math.random() < 0.5 ? angles : angles2;
    const idx = Math.floor(Math.random() * (arr.length - 1));
    const t = Math.random();
    const x = (Math.cos(arr[idx]) * (1 - t) + Math.cos(arr[idx + 1]) * t) * scale;
    const y = (Math.sin(arr[idx]) * (1 - t) + Math.sin(arr[idx + 1]) * t) * scale;
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = (Math.random() - 0.5) * 0.1 * scale;
  }
  return points;
}

function createCelticKnotPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 4;
    const x = Math.sin(t) * Math.cos(t) * scale;
    const y = Math.sin(t * 0.5) * scale;
    const z = Math.cos(t) * 0.1 * scale;
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
  }
  return points;
}

function createAnkhPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    let x, y, z;
    if (t < 0.3) { // Circle
      const angle = Math.random() * 2 * Math.PI;
      const r = scale * 0.3;
      x = Math.cos(angle) * r;
      y = scale * 0.5 + Math.sin(angle) * r;
      z = (Math.random() - 0.5) * 0.05 * scale;
    } else if (t < 0.6) { // Vertical bar
      x = (Math.random() - 0.5) * 0.1 * scale;
      y = (Math.random() - 0.5) * scale;
      z = (Math.random() - 0.5) * 0.05 * scale;
    } else { // Horizontal bar
      x = (Math.random() - 0.5) * scale * 0.5;
      y = 0;
      z = (Math.random() - 0.5) * 0.05 * scale;
    }
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
  }
  return points;
}

function createOuroborosPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = scale * 0.5 + Math.sin(angle * 3) * 0.1 * scale;
    points[i * 3] = Math.cos(angle) * radius;
    points[i * 3 + 1] = Math.sin(angle) * radius;
    points[i * 3 + 2] = (Math.random() - 0.5) * 0.05 * scale;
  }
  return points;
}

// 3. Astronomical / Cosmic
function createPolarisPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  const spiralCount = Math.floor(count * 0.8);
  const noiseCount = count - spiralCount;
  for (let i = 0; i < spiralCount; i++) {
    const r = (i / spiralCount) * scale;
    const angle = i * 0.1;
    points[i * 3] = r * Math.cos(angle);
    points[i * 3 + 1] = r * Math.sin(angle);
    points[i * 3 + 2] = (Math.random() - 0.5) * scale * 0.1;
  }
  for (let i = 0; i < noiseCount; i++) {
    const index = spiralCount + i;
    points[index * 3] = (Math.random() - 0.5) * scale * 2;
    points[index * 3 + 1] = (Math.random() - 0.5) * scale * 2;
    points[index * 3 + 2] = (Math.random() - 0.5) * scale * 2;
  }
  return points;
}

// 4. Cultural / Gaming / Fictional
function createAssassinsCreedPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    let x, y, z;
    if (t < 0.4) { // Hood shape
      const angle = Math.random() * Math.PI;
      const r = Math.sin(angle) * scale * 0.8;
      x = Math.cos(angle * 2) * r;
      y = Math.cos(angle) * scale;
      z = (Math.random() - 0.5) * 0.1 * scale;
    } else { // Body/cape
      x = (Math.random() - 0.5) * scale * 1.2;
      y = (Math.random() - 1) * scale;
      z = (Math.random() - 0.5) * 0.2 * scale;
    }
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
  }
  return points;
}

function createGOTPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    let x, y, z;
    if (t < 0.3) { // Crown spikes
      const angle = (Math.floor(Math.random() * 8) / 8) * 2 * Math.PI;
      const height = 0.5 + Math.random() * 0.5;
      x = Math.cos(angle) * scale * 0.7;
      y = height * scale;
      z = Math.sin(angle) * scale * 0.7;
    } else { // Base
      const angle = Math.random() * 2 * Math.PI;
      const r = scale * 0.8;
      x = Math.cos(angle) * r;
      y = (Math.random() - 0.5) * scale * 0.5;
      z = Math.sin(angle) * r;
    }
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
  }
  return points;
}

function createDragonPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    let x, y, z;
    if (t < 0.3) { // Wings
      const wingAngle = Math.random() * Math.PI;
      x = Math.cos(wingAngle) * scale * (1 + Math.sin(wingAngle));
      y = Math.sin(wingAngle) * scale * 0.5;
      z = (Math.random() - 0.5) * scale * 0.3;
    } else if (t < 0.7) { // Body
      const bodyT = Math.random();
      x = (bodyT - 0.5) * scale * 2;
      y = Math.sin(bodyT * Math.PI) * scale * 0.3;
      z = (Math.random() - 0.5) * scale * 0.4;
    } else { // Tail
      const tailT = Math.random() * 2;
      x = -scale + tailT * scale * 0.5;
      y = Math.sin(tailT * Math.PI) * scale * 0.2;
      z = Math.cos(tailT * Math.PI) * scale * 0.2;
    }
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
  }
  return points;
}

function createBirdPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    let x, y, z;
    if (t < 0.6) { // Wings
      const wingSpan = Math.random() * Math.PI;
      x = Math.cos(wingSpan) * scale;
      y = Math.sin(wingSpan) * scale * 0.3;
      z = (Math.random() - 0.5) * scale * 0.1;
    } else { // Body
      x = (Math.random() - 0.5) * scale * 0.3;
      y = (Math.random() - 0.5) * scale * 0.5;
      z = (Math.random() - 0.5) * scale * 0.2;
    }
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
  }
  return points;
}

// 5. Geometric / Esoteric Shapes
function createTorusPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  const R = scale * 0.6; // Major radius
  const r = scale * 0.3; // Minor radius
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 * Math.PI;
    const v = Math.random() * 2 * Math.PI;
    points[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    points[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
    points[i * 3 + 2] = r * Math.sin(v);
  }
  return points;
}

function createInfinityPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * 2 * Math.PI;
    const x = scale * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
    const y = scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = (Math.random() - 0.5) * scale * 0.1;
  }
  return points;
}

function createInfinityCubePoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    let x, y, z;
    if (t < 0.8) { // Cube edges
      const edge = Math.floor(Math.random() * 12);
      const s = (Math.random() - 0.5) * 2 * scale;
      switch (edge) {
        case 0: case 1: case 2: case 3: // Bottom edges
          x = edge % 2 === 0 ? s : (edge === 1 ? scale : -scale);
          y = -scale;
          z = edge < 2 ? scale : -scale;
          break;
        case 4: case 5: case 6: case 7: // Top edges
          x = edge % 2 === 0 ? s : (edge === 5 ? scale : -scale);
          y = scale;
          z = edge < 6 ? scale : -scale;
          break;
        default: // Vertical edges
          x = edge === 8 || edge === 11 ? scale : -scale;
          y = s;
          z = edge === 8 || edge === 9 ? scale : -scale;
      }
    } else { // Random fill
      x = (Math.random() - 0.5) * 2 * scale;
      y = (Math.random() - 0.5) * 2 * scale;
      z = (Math.random() - 0.5) * 2 * scale;
    }
    points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
  }
  return points;
}

// ---------------------- ParticleCanvas Component ---------------------- //

const SHAPES = [
  'giza_pyramid', 'eye_of_horus', 'obelisk', 'stonehenge', 'mayan_pyramid',
  'pentagram', 'hexagram', 'celtic_knot', 'ankh', 'ouroboros',
  'polaris', 'assassins_creed', 'got', 'dragon', 'bird',
  'torus', 'infinity', 'infinity_cube'
];

const SHAPE_NAMES = [
  'Giza Pyramid', 'Eye of Horus', 'Obelisk', 'Stonehenge', 'Mayan Pyramid',
  'Pentagram', 'Hexagram', 'Celtic Knot', 'Ankh', 'Ouroboros',
  'Polaris', 'Assassin\'s Creed', 'Game of Thrones', 'Dragon', 'Bird',
  'Torus', 'Infinity', 'Infinity Cube'
];

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const frameIdRef = useRef<number | null>(null);

  const [shapeIndex, setShapeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const points = useMemo(() => {
    const scale = 1.2;
    switch (SHAPES[shapeIndex]) {
      case 'giza_pyramid': return createGizaPyramidPoints(NUM_POINTS, scale);
      case 'eye_of_horus': return createEyeOfHorusPoints(NUM_POINTS, scale);
      case 'obelisk': return createObeliskPoints(NUM_POINTS, scale);
      case 'stonehenge': return createStonehengePoints(NUM_POINTS, scale);
      case 'mayan_pyramid': return createMayanPyramidPoints(NUM_POINTS, scale);
      case 'pentagram': return createPentagramPoints(NUM_POINTS, scale);
      case 'hexagram': return createHexagramPoints(NUM_POINTS, scale);
      case 'celtic_knot': return createCelticKnotPoints(NUM_POINTS, scale);
      case 'ankh': return createAnkhPoints(NUM_POINTS, scale);
      case 'ouroboros': return createOuroborosPoints(NUM_POINTS, scale);
      case 'polaris': return createPolarisPoints(NUM_POINTS, scale);
      case 'assassins_creed': return createAssassinsCreedPoints(NUM_POINTS, scale);
      case 'got': return createGOTPoints(NUM_POINTS, scale);
      case 'dragon': return createDragonPoints(NUM_POINTS, scale);
      case 'bird': return createBirdPoints(NUM_POINTS, scale);
      case 'torus': return createTorusPoints(NUM_POINTS, scale);
      case 'infinity': return createInfinityPoints(NUM_POINTS, scale);
      case 'infinity_cube': return createInfinityCubePoints(NUM_POINTS, scale);
      default: return createPolarisPoints(NUM_POINTS, scale);
    }
  }, [shapeIndex]);

  const handleParticleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShapeIndex((prevIndex) => (prevIndex + 1) % SHAPES.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 3;
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    if (pointsRef.current) {
      sceneRef.current.remove(pointsRef.current);
      pointsRef.current.geometry.dispose();
      (pointsRef.current.material as THREE.Material).dispose();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const material = new THREE.PointsMaterial({ 
      color: 0x38bdf8, 
      size: 0.015, 
      transparent: true, 
      opacity: 0.8, 
      sizeAttenuation: true 
    });
    const pointsMesh = new THREE.Points(geometry, material);
    pointsMesh.rotation.z = Math.PI / 4;
    sceneRef.current.add(pointsMesh);
    pointsRef.current = pointsMesh;
  }, [points]);

  useEffect(() => {
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !pointsRef.current) return;
      targetRotationRef.current.x += (mouseRef.current.y * 0.8 - targetRotationRef.current.x) * 0.05;
      targetRotationRef.current.y += (mouseRef.current.x * 0.8 - targetRotationRef.current.y) * 0.05;
      pointsRef.current.rotation.x = targetRotationRef.current.x;
      pointsRef.current.rotation.y = targetRotationRef.current.y;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    frameIdRef.current = requestAnimationFrame(animate);
    return () => { if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current); };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          onMouseMove={handleMouseMove} 
          onClick={handleParticleClick}
          className="cursor-pointer transition-all duration-300 hover:scale-105"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.3))',
          }}
        />
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-lg border border-cyan-400/30 shadow-[0_0_30px_rgba(56,189,248,0.3)]"></div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          {SHAPE_NAMES[shapeIndex]}
        </h3>
        <p className="text-sm text-gray-400 mt-1">Click to transform • Drag to rotate</p>
      </div>
    </div>
  );
};

export default ParticleCanvas;