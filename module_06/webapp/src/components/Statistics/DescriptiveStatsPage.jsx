import React, { useState, useEffect } from 'react';
import './DescriptiveStatsPage.css';
// Pour parser les fichiers, vous aurez besoin de bibliothèques comme PapaParse pour CSV et SheetJS (xlsx) pour Excel.
// npm install papaparse xlsx
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

function DescriptiveStatsPage({ uploadedFiles }) {
  const [selectedBaseId, setSelectedBaseId] = useState('');
  const [variables, setVariables] = useState([]);
  const [stats, setStats] = useState(null); // Pour stocker les statistiques calculées

  useEffect(() => {
    // Réinitialiser si les fichiers changent
    setSelectedBaseId('');
    setVariables([]);
    setStats(null);
  }, [uploadedFiles]);

  const handleBaseSelection = async (event) => {
    const baseId = event.target.value;
    setSelectedBaseId(baseId);
    setVariables([]); // Réinitialiser les variables affichées
    setStats(null); // Réinitialiser les stats affichées

    if (!baseId) return;

    const selectedFile = uploadedFiles.find(f => f.id === baseId);
    if (selectedFile) {
      // ICI, dans une vraie application, vous récupéreriez le contenu du fichier
      // (par exemple depuis S3 ou un état local si vous l'avez stocké après le faux upload)
      // et le parseriez pour en extraire les noms des colonnes (variables).
      // Pour la DÉMO, nous allons simuler des variables.
      alert(`Simulation: Vous avez sélectionné la base "${selectedFile.name}".\nNormalement, on lirait et analyserait le fichier ici.`);

      // Simulation de l'extraction des variables (noms de colonnes)
      // Dans un vrai cas, vous utiliseriez PapaParse ou SheetJS pour lire l'en-tête du fichier
      const mockVariables = ['Variable_A', 'Variable_B_Numérique', 'Variable_C_Catégorielle', 'Date_Observation'];
      setVariables(mockVariables);
    }
  };

  const calculateAndShowStats = (variableName) => {
    // ICI, vous calculeriez les statistiques descriptives pour la variable sélectionnée.
    // Ex: moyenne, médiane, min, max, écart-type pour les numériques.
    // Ex: fréquences pour les catégorielles.
    // Pour la DÉMO, nous allons simuler des statistiques.
    alert(`Simulation: Calcul des statistiques pour "${variableName}" de la base "${selectedBaseId}".`);
    const mockStatData = {
      variable: variableName,
      type: Math.random() > 0.5 ? 'Numérique' : 'Catégorielle',
      mean: (Math.random() * 100).toFixed(2),
      median: (Math.random() * 100).toFixed(2),
      min: (Math.random() * 10).toFixed(2),
      max: (Math.random() * 200).toFixed(2),
      stddev: (Math.random() * 20).toFixed(2),
      categories: {
        'Cat1': Math.floor(Math.random() * 50),
        'Cat2': Math.floor(Math.random() * 50),
        'Cat3': Math.floor(Math.random() * 50),
      }
    };
    setStats(mockStatData);
  };


  if (uploadedFiles.length === 0) {
    return <p>Veuillez d'abord déposer une base de données dans l'onglet "Déposer Fichier".</p>;
  }

  return (
    <div className="stats-page-container">
      <h3>Statistiques Descriptives</h3>
      <div className="controls">
        <label htmlFor="base-select">Sélectionner une base de données :</label>
        <select id="base-select" value={selectedBaseId} onChange={handleBaseSelection}>
          <option value="">-- Choisir une base --</option>
          {uploadedFiles.map(file => (
            <option key={file.id} value={file.id}>{file.name} (ID: {file.id})</option>
          ))}
        </select>
      </div>

      {selectedBaseId && variables.length > 0 && (
        <div className="variables-section">
          <h4>Variables disponibles pour la base "{uploadedFiles.find(f => f.id === selectedBaseId)?.name}" :</h4>
          <ul className="variables-list">
            {variables.map(variable => (
              <li key={variable}>
                {variable}
                <button onClick={() => calculateAndShowStats(variable)} className="stats-button">Voir Stats</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats && (
        <div className="stats-results">
          <h4>Statistiques pour "{stats.variable}"</h4>
          {stats.type === 'Numérique' ? (
            <>
              <p><strong>Type:</strong> Numérique</p>
              <p><strong>Moyenne:</strong> {stats.mean}</p>
              <p><strong>Médiane:</strong> {stats.median}</p>
              <p><strong>Min:</strong> {stats.min}</p>
              <p><strong>Max:</strong> {stats.max}</p>
              <p><strong>Écart-type:</strong> {stats.stddev}</p>
            </>
          ) : (
            <>
              <p><strong>Type:</strong> Catégorielle</p>
              <p><strong>Fréquences:</strong></p>
              <ul>
                {Object.entries(stats.categories).map(([cat, count]) => (
                  <li key={cat}>{cat}: {count}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
       {!selectedBaseId && <p>Sélectionnez une base pour voir ses variables.</p>}
    </div>
  );
}

export default DescriptiveStatsPage;