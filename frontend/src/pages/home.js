import React, {useRef, useEffect, useState} from 'react';
import CanvasBackground from '../components/three.js/backgrounds.js';
import Logo from '../components/logo/logo.js';
import ButtonBar from '../components/button/ButtonBar.js';
import axios from 'axios';

function UploadContainer(props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState([]);
  const [error, setError] = useState(null);

  const onDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
  };

  const onDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
  };

  const onDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
  };


    const onDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          setError(null);
          setFile(e.dataTransfer.files[0]);
          e.dataTransfer.clearData();
      }
  };

  const onFileSelect = (e) => {
      setError(null);
      console.log(e.target.files[0])
      setFile(e.target.files[0]);
  };


  return (
    <div 
      className="upload-container"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}  
    >
      <input
        type="file"
        accept="*"
        className='upload-container__inputfile'
        onChange={onFileSelect}
      >
      </input>
      <div className="upload-container__text">
          {error ? <p>{error}</p> : null}
          {dragging ? 
              "Drop here" : 
              `${(file && file.name) ? `${file.name}` : "Select a file"}`
          }
      </div>
    </div>
  )
}

export default function PageHome() {
  const [isSpeedUp, setIsSpeedUp] = useState(false);

  return (
    <div className="page">
      <Logo />
      <ButtonBar />
      <UploadContainer setIsSpeedUp={setIsSpeedUp} isSpeedUp={isSpeedUp} />
      <CanvasBackground setIsSpeedUp={setIsSpeedUp} isSpeedUp={isSpeedUp}/>
    </div>
  )
};