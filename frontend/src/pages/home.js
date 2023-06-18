import React from 'react';
import CanvasBackground from '../components/three.js/backgrounds.js';
import Logo from '../components/logo/logo.js';

function ButtonBar() {
  return (
    <div className="button-bar">
      <a href="https://raphael.colau.fr" target="_blank" rel="noreferrer">
        <button className="button">
          <div className="button-text">Raphaël C.</div>
        </button>
      </a>
      <button className="button">
        <div className="button-text">About</div>
      </button>
      <a href="https://github.com/raphaelcolau" target="_blank" rel="noreferrer">
        <button className="button">
          <div className="button-text">Github</div>
        </button>
      </a>
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
