import React, { useState, useCallback } from 'react';
import FileProgressBar from './FileProgressBar';
import FileListTable from './FileListTable';
import './FileUploadPage.css';

function FileUploadPage({ onFileUploaded, uploadedFiles }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "text/csv" || file.name.endsWith('.csv') || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.name.endsWith('.xlsx'))) {
      setSelectedFile(file);
      setMessage('');
      setUploadProgress(0); // Réinitialiser la progression si un nouveau fichier est sélectionné
    } else {
      setSelectedFile(null);
      setMessage('Veuillez sélectionner un fichier CSV ou Excel (.csv, .xlsx).');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Veuillez d\'abord sélectionner un fichier.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setMessage(`Téléversement de ${selectedFile.name}...`);

    // Simulation de téléversement
    // Dans une vraie application, ici vous feriez l'appel vers votre backend/S3
    // et vous mettriez à jour la progression en fonction des événements de l'upload.
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        setUploadProgress(progress);
      } else {
        clearInterval(interval);
        setIsUploading(false);
        setMessage(`${selectedFile.name} a été déposé avec succès !`);
        // Simuler un ID de base ou un nom unique pour la "base"
        const fileInfo = {
          id: `base-${Date.now()}`, // Identifiant unique pour la base
          name: selectedFile.name,
          uploadedAt: new Date().toLocaleString(),
          status: 'Terminé',
          // Plus tard, vous pourriez ajouter des métadonnées ici (nombre de lignes, colonnes, etc.)
        };
        onFileUploaded(fileInfo); // Notifier le parent que le fichier est "déposé"
        setSelectedFile(null); // Réinitialiser le champ de fichier
        // setUploadProgress(0); // Laisser la barre à 100% ou la cacher
      }
    }, 200); // Simule une progression toutes les 200ms
  };

  return (
    <div className="file-upload-container">
      <h3>Déposer un nouveau fichier (CSV ou Excel)</h3>
      <div className="upload-form">
        <input type="file" accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? 'Téléversement...' : 'Déposer le fichier'}
        </button>
      </div>

      {isUploading && <FileProgressBar progress={uploadProgress} />}
      {message && <p className={`upload-message ${message.includes('succès') ? 'success' : 'error'}`}>{message}</p>}

      <hr className="separator" />

      <FileListTable files={uploadedFiles} />
    </div>
  );
}

export default FileUploadPage;