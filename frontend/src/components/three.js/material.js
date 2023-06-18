import * as THREE from 'three';

export const material = new THREE.ShaderMaterial({
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