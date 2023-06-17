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
  const [forceDuration, setForceDuration] = useState(0); // Durée de la force de répulsion
  const bezierCurve = [0.16, 0.88, 0.46, 0.89];
  const maxForceDuration = props.maxForceDuration || 1000; // Durée maximale de la force de répulsion (par défaut 1000 millisecondes)

  useFrame((state, delta) => {
    mesh.current.position.y -= velocity * delta; // Utilisation de la vitesse de chute
    mesh.current.rotation.z += rotationVelocity * delta; // Rotation sur l'axe Z

    // Rebondissement lorsque le carré atteint le bas de la scène
    if (mesh.current.position.y < -7) {
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

      const combinedScale = mesh.current.scale.x + square.scale.x;
      const minDistance = combinedScale * 0.1; // Distance minimale pour détecter la collision

      if (distance < minDistance && forceDuration > 0) {
        console.log(minDistance, distance)
        const t = THREE.MathUtils.clamp(
          distance / minDistance,
          0,
          1
        ); // Paramètre t pour l'interpolation cubique

        const curveInterpolation = new THREE.CubicBezierCurve3(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(bezierCurve[0], bezierCurve[1], 0),
          new THREE.Vector3(bezierCurve[2], bezierCurve[3], 0),
          new THREE.Vector3(1, 1, 0)
        );

        const force = repulsionForce * delta; // Force de répulsion constante

        const forceX = (curveInterpolation.getPointAt(t).x - t) * force;
        const forceY = (curveInterpolation.getPointAt(t).y - t) * force;

        mesh.current.position.x += forceX;
        mesh.current.position.y += forceY;

        square.position.x -= forceX;
        square.position.y -= forceY;

        setForceDuration((prevDuration) => prevDuration - delta);
        mesh.current.material.color = new THREE.Color(0xff0000); // Changement de couleur lors de la collision
      }
    });

    if (forceDuration <= 0) {
      mesh.current.material.color = new THREE.Color(0xffffff); // Réinitialisation de la couleur lorsque la force de répulsion se termine
    }
  });

  useEffect(() => {
    const scale = Math.random() * 0.2 + 0.35; // Taille aléatoire entre 0.35 et 0.55
    mesh.current.scale.set(scale, scale, 1); // Z échelle à 1 pour obtenir une surface plane

    const pixelWidth = window.innerWidth / scale; // Largeur en pixels de la bordure en fonction de l'échelle
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = screenWidth / screenHeight;

    const borderWidth =
      pixelWidth / Math.max(screenWidth, screenHeight) * aspectRatio;

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
          <div className="text">
            {mesh.current.scale.x.toFixed(2)}
            {forceDuration > 0 && (
              <div className="collision-message">Collision détectée !</div>
            )}
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default function PageHome() {
  return (
    <div className="page">
      <Canvas className="three__Canvas">
        {Array.from({ length: 70 }).map((_, index) => (
          <Square
            key={index}
            position={[
              Math.floor(Math.random() * 10 - 5),
              Math.floor(Math.random() * 14 - 7),
              Math.random() * 4 - 2,
            ]}
            repulsionForce={300} // Valeur de la force de répulsion, ajustez-la selon vos besoins
            maxForceDuration={1000} // Durée maximale de la force de répulsion (en millisecondes)
          />
        ))}
      </Canvas>
    </div>
  );
}