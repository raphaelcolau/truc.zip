import React from 'react';
import CanvasBackground from '../components/three.js/backgrounds.js';
import Logo from '../components/logo/logo.js';

export default function PageHome() {
  return (
    <div className="page">
      <Logo />
      <CanvasBackground />
    </div>
  )
};