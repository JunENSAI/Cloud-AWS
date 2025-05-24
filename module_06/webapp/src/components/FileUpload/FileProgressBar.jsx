import React from 'react';
import './FileProgressBar.css';

function FileProgressBar({ progress }) {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
      >
        {progress > 0 && `${progress}%`}
      </div>
    </div>
  );
}

export default FileProgressBar;