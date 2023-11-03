import React from 'react';
import CanvasBackground from '../components/three.js/backgrounds.js';
import Logo from '../components/logo/logo.js';
import ButtonBar from '../components/button/ButtonBar.js';
import UploadContainer from '../components/input/InputFile.js';
import { useParams } from 'react-router-dom';
import FileInfo from '../components/fileInfo/FileInfo.js';
import { Provider } from 'react-redux';
import { threeStore } from '../store/three-store.js';

export default function PageHome() {
  const fileId = useParams().id;

  return (
    <div className="page">
      <Provider store={threeStore}>
        <Logo />
        <ButtonBar />
        {fileId ? <FileInfo fileId={fileId} /> : <UploadContainer />}
        <CanvasBackground />
      </Provider>
    </div>
  )
};