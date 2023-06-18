import React from 'react';

export default function ButtonBar() {
    return (
      <div className="button-bar">
        <a href="https://raphael.colau.fr" target="_blank" rel="noreferrer">
          <button className="button">
            <div className="button-text">CRD</div>
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