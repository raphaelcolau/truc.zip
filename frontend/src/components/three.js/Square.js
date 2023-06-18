import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { material } from './material.js';

export default function Square(props) {
    const mesh = useRef();
    // eslint-disable-next-line no-unused-vars
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    const originalVelocity = Math.random() * 0.2 + 0.1; // Vitesse de chute aléatoire
    const [velocity, setVelocity] = useState(originalVelocity); // Vitesse de chute aléatoire
    const [targetVelocity, setTargetVelocity] = useState(velocity); // Vitesse de chute cible pour l'animation de changement de vitesse
    const [rotationVelocity, setRotationVelocity] = useState(
      (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.2 + 0.1)
    ); // Vitesse de rotation aléatoire avec direction aléatoire
    const repulsionForce = props.repulsionForce || 0.1;
    const bezierCurve = [.63,.11,.29,.73];
    const transitionDuration = 1; // Durée de la transition de vitesse en secondes
  
    useEffect(() => {
      setTargetVelocity(props.isSpeedUp ? 1 : originalVelocity);
    }, [props.isSpeedUp, originalVelocity]);
  
    useFrame((state, delta) => {
      setVelocity((currentVelocity) => {
        const deltaVelocity = (targetVelocity - currentVelocity) / (transitionDuration * 60);
        const newVelocity = currentVelocity + deltaVelocity;
        return Math.abs(targetVelocity - newVelocity) < 0.001 ? targetVelocity : newVelocity;
      });
  
      mesh.current.position.y -= (velocity * (props.isSpeedUp ? 3 : 1)) * delta;
      mesh.current.rotation.z += rotationVelocity * delta;
  
      // Rebondissement lorsque le carré atteint le bas de la scène
      if (mesh.current.position.y < -7 || mesh.current.position.x < -7 || mesh.current.position.x > 7) {
        mesh.current.position.y = 7; // Réinitialisation de la position en haut de la scène
        mesh.current.position.x = Math.random() * 14 - 7; // Nouvelle position aléatoire sur l'axe X
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
    
          const sizeFactor = (mesh.current.scale.x - square.scale.x) * 0.99;
          const force = sizeFactor / (distance * distance) * repulsionForce; // Calcul de la force de répulsion avec le paramètre repulsionForce
    
          if (distance < mesh.current.scale.x + square.scale.x) {
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
          {/* <Html position={[0, 0, 0.1]}>
            <div className="text">{props.index}</div>
          </Html> */}
      </mesh>
    );
  }