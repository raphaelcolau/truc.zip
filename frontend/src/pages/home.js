import React, { useState} from 'react';
import CanvasBackground from '../components/three.js/backgrounds.js';
import Logo from '../components/logo/logo.js';
import ButtonBar from '../components/button/ButtonBar.js';
import UploadContainer from '../components/input/InputFile.js';

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