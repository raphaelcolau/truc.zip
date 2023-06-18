import React from 'react';
import CanvasBackground from '../components/three.js/backgrounds.js';
import Logo from '../components/logo/logo.js';

function ButtonBar() {
  return (
    <div className="button-bar">
      <button className="button">
        <div className="button-text">Raphaël C.</div>
      </button>
      <button className="button">
        <div className="button-text">About</div>
      </button>
      <button className="button">
        <div className="button-text">Github</div>
      </button>
    </div>
  )
}

export default function PageHome() {
  return (
    <div className="page">
      <Logo />
      <ButtonBar />
      <CanvasBackground />
    </div>
  )
};
