import React, { useState } from 'react';
import FileUploadPage from '../components/FileUpload/FileUploadPage';
import DescriptiveStatsPage from '../components/Statistics/DescriptiveStatsPage';
import GraphsPage from '../components/Graphs/GraphsPage';
import Navbar from '../components/Layout/Navbar'; 
import './HomePage.css';

function HomePage({ username, onLogout }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'stats', 'graphs'
  const [uploadedFiles, setUploadedFiles] = useState([]); // Pour stocker les infos des fichiers

  // Cette fonction sera appelée par FileUploadPage après un dépôt "réussi"
  const handleFileUploaded = (fileInfo) => {
    setUploadedFiles(prevFiles => [...prevFiles, fileInfo]);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'upload':
        return <FileUploadPage onFileUploaded={handleFileUploaded} uploadedFiles={uploadedFiles} />;
      case 'stats':
        return <DescriptiveStatsPage uploadedFiles={uploadedFiles} />;
      case 'graphs':
        return <GraphsPage uploadedFiles={uploadedFiles} />;
      default:
        return <FileUploadPage onFileUploaded={handleFileUploaded} uploadedFiles={uploadedFiles} />;
    }
  };

  return (
    <div className="homepage-container">
      <Navbar username={username} onLogout={onLogout} setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="content-area">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default HomePage;