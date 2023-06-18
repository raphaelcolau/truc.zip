import React, { useState, useEffect } from 'react';
import { getFile } from '../../adapters/getFile.js';
import { apiAddress } from '../../config/config.js';

export default function FileInfo(props) {
    const fileId = props.fileId;
    const [info, setInfo] = useState(null);
  
    useEffect(() => {
      getFile(fileId).then((data) => {
        setInfo(data);
      });
    }, [fileId]);
  
    const sizeToText = (size) => {
      if (size < 1024) {
        return size + " B";
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + " KB";
      } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + " MB";
      } else {
        return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
      }
    };
  
    return (
      <div className="file-info">
        <button className="file-info__button button">
          <div className='button__text'>{info ? info.download_count + " DL" : "0"}</div>
        </button>
        <button className="file-info__button button">
          <div className='button__text'>{info ? info.name : "Loading..."}</div>
        </button>
        <a href={`${apiAddress}files/download/${fileId}`} download>
          <button className="file-info__button button">
            <div className='button__text'>Download</div>
          </button>
        </a>
        <button className="file-info__button button">
          <div className='button__text'>{info ? sizeToText(info.size) : "Loading..."}</div>
        </button>
      </div>
    )
  }