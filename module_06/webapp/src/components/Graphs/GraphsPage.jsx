import React, { useState, useEffect, useRef } from 'react';
import './GraphsPage.css';
import { Chart, registerables } from 'chart.js'; // Importer Chart et les éléments enregistrables
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot'; // Importer le contrôleur et l'élément boxplot

// Enregistrer les contrôleurs et éléments nécessaires pour Chart.js
// registerables inclut la plupart des types de graphiques communs.
// Nous ajoutons spécifiquement le contrôleur BoxPlot.
Chart.register(...registerables, BoxPlotController, BoxAndWiskers);

function GraphsPage({ uploadedFiles }) {
  const [selectedBaseIdG, setSelectedBaseIdG] = useState('');
  const [variablesG, setVariablesG] = useState([]);
  const [selectedVariableG, setSelectedVariableG] = useState('');
  // const [chartData, setChartData] = useState(null); // Utilisé pour la démo textuelle
  const chartRef = useRef(null); // Référence pour le canvas du graphique
  const chartInstanceRef = useRef(null); // Référence pour l'instance du graphique Chart.js

  useEffect(() => {
    setSelectedBaseIdG('');
    setVariablesG([]);
    setSelectedVariableG('');
    // setChartData(null);
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Détruire le graphique existant si les fichiers changent
      chartInstanceRef.current = null;
    }
  }, [uploadedFiles]);

  const handleBaseSelectionG = async (event) => {
    const baseId = event.target.value;
    setSelectedBaseIdG(baseId);
    setVariablesG([]);
    setSelectedVariableG('');
    // setChartData(null);
     if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (!baseId) return;

    const selectedFile = uploadedFiles.find(f => f.id === baseId);
    if (selectedFile) {
      alert(`Simulation (Graphiques): Vous avez sélectionné la base "${selectedFile.name}".\nNormalement, on lirait et analyserait le fichier ici pour trouver les variables numériques pour les boxplots.`);
      const mockVars = ['Revenu_Mensuel', 'Age_Client', 'Score_Satisfaction', 'Nombre_Achats'];
      setVariablesG(mockVars);
    }
  };

  const handleVariableSelectionG = (event) => {
    const varName = event.target.value;
    setSelectedVariableG(varName);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Détruire le graphique précédent
      chartInstanceRef.current = null;
    }

    if (varName && chartRef.current) {
      alert(`Simulation: Préparation des données pour le boxplot de "${varName}" de la base "${selectedBaseIdG}".`);

      // Simuler des données numériques pour le boxplot
      // Dans une vraie application, vous extrairiez ces données du fichier sélectionné
      // et calculerier les quartiles, la médiane, etc. ou la bibliothèque le ferait pour vous.
      const generateRandomData = (count) => Array.from({ length: count }, () => Math.random() * 100);

      const dataForBoxplot = generateRandomData(50); // Un tableau de nombres

      const chartConfig = {
        type: 'boxplot', // Spécifier le type de graphique
        data: {
          labels: [varName],
          datasets: [{
            label: `Boxplot de ${varName}`,
            data: [dataForBoxplot], // Le plugin s'attend à un tableau de tableaux de données brutes
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgb(0, 123, 255)',
            borderWidth: 1,
            // itemRadius: 0, // Dépend du plugin, vérifier la doc
            // outliers: [] // Le plugin peut les calculer
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true // Ajustez selon vos données
            }
          },
          plugins: {
            legend: {
              display: true,
            },
            title: {
                display: true,
                text: `Boxplot pour ${varName}`
            }
          }
        }
      };

      chartInstanceRef.current = new Chart(chartRef.current, chartConfig);
      // setChartData(chartConfig); // Plus besoin si on dessine directement

    } else {
      // setChartData(null);
    }
  };

  if (uploadedFiles.length === 0) {
    return <p>Veuillez d'abord déposer une base de données dans l'onglet "Déposer Fichier".</p>;
  }

  return (
    <div className="graphs-page-container">
      <h3>Graphiques</h3>
      <div className="controls-graph">
        <label htmlFor="base-select-graph">Sélectionner une base :</label>
        <select id="base-select-graph" value={selectedBaseIdG} onChange={handleBaseSelectionG}>
          <option value="">-- Choisir une base --</option>
          {uploadedFiles.map(file => (
            <option key={file.id} value={file.id}>{file.name} (ID: {file.id})</option>
          ))}
        </select>
      </div>

      {selectedBaseIdG && variablesG.length > 0 && (
        <div className="controls-graph">
          <label htmlFor="variable-select-graph">Sélectionner une variable pour le Boxplot :</label>
          <select id="variable-select-graph" value={selectedVariableG} onChange={handleVariableSelectionG}>
            <option value="">-- Choisir une variable --</option>
            {variablesG.map(variable => (
              <option key={variable} value={variable}>{variable}</option>
            ))}
          </select>
        </div>
      )}

      <div className="chart-display-area">
        {selectedVariableG ? (
          <div className="chart-container">
             <canvas ref={chartRef}></canvas>
          </div>
        ) : (
          <div className="boxplot-placeholder">
            <p>Sélectionnez une base et une variable pour afficher le graphique Boxplot.</p>
          </div>
        )}
      </div>
      {!selectedBaseIdG && <p>Sélectionnez une base pour voir ses variables et générer des graphiques.</p>}
    </div>
  );
}

export default GraphsPage;