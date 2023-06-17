import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function Square(props) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [velocity, setVelocity] = useState(Math.random() * 0.2 + 0.1); // Vitesse de chute aléatoire
  const [rotationVelocity, setRotationVelocity] = useState(
    (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.2 + 0.1)
  ); // Vitesse de rotation aléatoire avec direction aléatoire
  const repulsionForce = props.repulsionForce || 0.1;
  const [forceDuration, setForceDuration] = useState(40); // Durée de la force de répulsion
  const bezierCurve = [.63,.11,.29,.73];

  useFrame((state, delta) => {
    mesh.current.position.y -= velocity * delta; // Utilisation de la vitesse de chute
    mesh.current.rotation.z += rotationVelocity * delta; // Rotation sur l'axe Z

    // Rebondissement lorsque le carré atteint le bas de la scène
    if (mesh.current.position.y < -7 || mesh.current.position.x < -7 || mesh.current.position.x > 7) {
      mesh.current.position.y = 7; // Réinitialisation de la position en haut de la scène
      setVelocity(Math.random() * 0.2 + 0.1); // Nouvelle vitesse de chute aléatoire
      setRotationVelocity(
        (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.2 + 0.1)
      ); // Nouvelle vitesse de rotation aléatoire avec direction aléatoire
    }

    // Détection de collision avec les autres carrés
    const squares = state.scene.children.filter(
      (child) => child.type === 'Mesh' && child !== mesh.current
    );

    squares.forEach((square) => {
        const dx = mesh.current.position.x - square.position.x;
        const dy = mesh.current.position.y - square.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        const sizeFactor = (mesh.current.scale.x - square.scale.x) * 0.5;
        const force = sizeFactor / (distance * distance) * repulsionForce; // Calcul de la force de répulsion avec le paramètre repulsionForce
  
        if (distance < mesh.current.scale.x + square.scale.x && forceDuration > 0) {
            const t = THREE.MathUtils.clamp(distance / (mesh.current.scale.x + square.scale.x), 0, 1); // Paramètre t pour l'interpolation cubique
            const curveInterpolation = THREE.CubicBezierCurve3.prototype.getPointAt.bind(
              new THREE.CubicBezierCurve3(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(bezierCurve[0], bezierCurve[1], 0),
                new THREE.Vector3(bezierCurve[2], bezierCurve[3], 0),
                new THREE.Vector3(1, 1, 0)
              )
            );
    
            const forceX = (curveInterpolation(t).x - t) * force * repulsionForce * delta;
            const forceY = (curveInterpolation(t).y - t) * force * repulsionForce * delta;
    
            mesh.current.position.x += forceX;
            mesh.current.position.y += forceY;
    
            square.position.x -= forceX;
            square.position.y -= forceY;
    
            setForceDuration((prevDuration) => prevDuration - delta);
          }
      });
    });

  useEffect(() => {
    const scale = Math.random() * 0.2 + 0.35; // Taille aléatoire entre 0.35 et 0.55
    mesh.current.scale.set(scale, scale, 1); // Z échelle à 1 pour obtenir une surface plane

    const pixelWidth = window.innerWidth / scale; // Largeur en pixels de la bordure en fonction de l'échelle
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = screenWidth / screenHeight;

    const borderWidth = pixelWidth / Math.max(screenWidth, screenHeight) * aspectRatio;

    const material = mesh.current.material;
    material.uniforms.borderWidth.value = borderWidth;
  }, []);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      borderWidth: { value: 0 }, // Initialiser la largeur de la bordure à 0
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float borderWidth;

      void main() {
        float border = 0.05; // Largeur de la bordure en proportion de la taille du carré

        vec2 innerSize = vec2(1.0 - borderWidth * 2.0, 1.0 - borderWidth * 2.0);
        vec2 innerUv = (vUv - border) / innerSize;

        bool isBorder = any(lessThan(vUv, vec2(border))) ||
                        any(greaterThan(vUv, vec2(1.0 - border)));

        if (isBorder) {
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Couleur de la bordure
        } else {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Couleur intérieure
        }
      }
    `,
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
      {mesh.current && (
        <Html position={[0, 0, 0.1]}>
          <div className="text">{props.truc}</div>
        </Html>
      )}
    </mesh>
  );
}

export default function PageHome() {
    return (
      <div className="page">
        <Canvas className="three__Canvas">
          {Array.from({ length: 100 }).map((_, index) => (
            <Square
              key={index}
              truc={index}
              position={[
                Math.floor(Math.random() * 14 - 7),
                Math.floor(Math.random() * 14 - 7),
                Math.random() * 4 - 2,
              ]}
              repulsionForce={10} // Valeur de la force de répulsion, ajustez-la selon vos besoins
            />
          ))}
        </Canvas>
      </div>
    );
  }