import React from 'react';
import './FileListTable.css';

function FileListTable({ files }) {
  if (!files || files.length === 0) {
    return <p>Aucune base de données déposée pour le moment.</p>;
  }

  // On prend les N dernières bases pour l'affichage, par exemple les 5 dernières.
  // Ou on les organise en colonnes si le style le permet.
  // Pour un affichage simple en "colonnes" (plutôt des cartes côte à côte):
  return (
    <div className="file-list-container">
      <h4>Mes Bases de Données Déposées</h4>
      <div className="bases-grid">
        {files.map((file, index) => (
          <div key={file.id || index} className="base-card">
            <h5>{file.name}</h5>
            <p><strong>ID Base:</strong> {file.id}</p>
            <p><strong>Déposé le:</strong> {file.uploadedAt}</p>
            <p><strong>Statut:</strong> <span className={`status ${file.status?.toLowerCase()}`}>{file.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileListTable;