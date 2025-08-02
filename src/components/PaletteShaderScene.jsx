import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Vibrant from 'node-vibrant';

function ScrollCamera() {
  const { camera } = useThree();

  useEffect(() => {
    const handleScroll = () => {
      camera.position.z = 5 + window.scrollY * 0.01;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [camera]);

  return null;
}

function ShaderPlane({ colors }) {
  const materialRef = useRef();

  useEffect(() => {
    if (materialRef.current && colors.length) {
      colors.forEach((c, i) => {
        materialRef.current.uniforms[`uColor${i}`].value = new THREE.Color(c);
      });
    }
  }, [colors]);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor0;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    varying vec2 vUv;
    void main() {
      vec3 color = mix(uColor0, uColor1, vUv.x);
      color = mix(color, uColor2, vUv.y);
      color = mix(color, uColor3, vUv.x * vUv.y);
      color = mix(color, uColor4, 1.0 - vUv.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = {
    uColor0: { value: new THREE.Color('#000000') },
    uColor1: { value: new THREE.Color('#000000') },
    uColor2: { value: new THREE.Color('#000000') },
    uColor3: { value: new THREE.Color('#000000') },
    uColor4: { value: new THREE.Color('#000000') },
  };

  return (
    <mesh>
      <planeGeometry args={[5, 5]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function PaletteShaderScene() {
  const [colors, setColors] = useState([]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        const palette = await Vibrant.from(img).getPalette();
        const paletteColors = Object.values(palette).map((sw) => sw.getHex());
        console.log('Extracted palette:', paletteColors);
        setColors(paletteColors.slice(0, 5));
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <Canvas style={{ height: '100vh' }}>
        <ScrollCamera />
        <ShaderPlane colors={colors} />
      </Canvas>
    </div>
  );
}
