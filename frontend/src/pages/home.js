import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function Square(props) {
    const mesh = useRef();
    const [originalPositions, setOriginalPositions] = useState([]);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    const [velocity, setVelocity] = useState(Math.random() * 0.2 + 0.1);
    const [rotationVelocity, setRotationVelocity] = useState(
      (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.2 + 0.1)
    );
    const repulsionForce = props.repulsionForce || 0.1;
    const [forceDuration, setForceDuration] = useState(40);
    const bezierCurve = [0.63, 0.11, 0.29, 0.73];


  useFrame((state, delta) => {
    mesh.current.position.y -= velocity * delta;
    mesh.current.rotation.z += rotationVelocity * delta;


    if (props.isCircleActive) {
        // Formation d'un cercle
        const radius = 2;
        const angle = (Math.PI * 2) / props.numberOfSquares;
        const index = props.index;
        const theta = index * angle;
  
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
  
        mesh.current.position.x = x;
        mesh.current.position.y = y;
      } else {
        // Retour aux positions et vélocités d'origine
        mesh.current.rotation.z += rotationVelocity * delta;
  
        // Rebondissement lorsque le carré atteint le bas de la scène
        if (mesh.current.position.y < -7 || mesh.current.position.x < -7 || mesh.current.position.x > 7) {
          mesh.current.position.y = 7;
          setVelocity(Math.random() * 0.2 + 0.1);
          setRotationVelocity((Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.2 + 0.1));
        } else {
          mesh.current.position.y -= velocity * delta;
        }
      }
  


    // Détection de collision avec les autres carrés
    const squares = props.squares.filter((square) => square !== mesh.current);

    squares.forEach((square) => {
      const dx = mesh.current.position.x - square.position.x;
      const dy = mesh.current.position.y - square.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const sizeFactor = (mesh.current.scale.x - square.scale.x) * 0.5;
      const force = sizeFactor / (distance * distance) * repulsionForce;

      if (distance < mesh.current.scale.x + square.scale.x && forceDuration > 0) {
        const t = THREE.MathUtils.clamp(distance / (mesh.current.scale.x + square.scale.x), 0, 1);
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

        setForceDuration((prevDuration) => prevDuration - 1);
      }
    });
  });

  useEffect(() => {
    const scale = Math.random() * 0.2 + 0.35;
    mesh.current.scale.set(scale, scale, 1);
    const pixelWidth = window.innerWidth / scale;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = screenWidth / screenHeight;
    const borderWidth = pixelWidth / Math.max(screenWidth, screenHeight) * aspectRatio;
    const material = mesh.current.material;
    material.uniforms.borderWidth.value = borderWidth;

    // Enregistrer les positions d'origine des carrés
    setOriginalPositions([props.position[0], props.position[1]]);
  }, [props.position]);

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

  });

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
        <Html position={[0, 0, 0]}>
          <div className="text">{props.index}</div>
        </Html>
      )}
    </mesh>
  );
}

export default function PageHome() {
    const [isCircleActive, setIsCircleActive] = useState(false);
    const [squares, setSquares] = useState([]);
  
    useEffect(() => {
      const handleMouseDown = () => {
        setIsCircleActive(true);
      };
  
      const handleMouseUp = () => {
        setIsCircleActive(false);
      };
  
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
  
      return () => {
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, []);
  
    return (
      <div className="page">
        <Canvas className="three__Canvas">
          {Array.from({ length: 100 }).map((_, index) => (
            <Square
              key={index}
              index={index}
              numberOfSquares={100}
              position={[
                Math.floor(Math.random() * 14 - 7),
                Math.floor(Math.random() * 14 - 7),
                Math.random() * 4 - 2,
              ]}
              squares={squares}
              repulsionForce={10}
              isCircleActive={isCircleActive}
            />
          ))}
        </Canvas>
      </div>
    );
  }