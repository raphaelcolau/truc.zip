import React, { useState, useRef } from 'react';

export default function UploadContainer(props) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState([]);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
  
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
        setFile(e.target.files[0]);
    };
  
    return (
      <div 
        className="upload-container"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
      >
        <input
          type="file"
          accept="*"
          className='upload-container__inputfile'
          onChange={onFileSelect}
          ref={inputRef}
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