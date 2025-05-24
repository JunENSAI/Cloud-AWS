import React from 'react';
import './Navbar.css';

function Navbar({ username, onLogout, setActiveTab, activeTab }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Mon Application</div>
      <div className="navbar-tabs">
        <button
          className={`nav-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Déposer Fichier
        </button>
        <button
          className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistiques Descriptives
        </button>
        <button
          className={`nav-button ${activeTab === 'graphs' ? 'active' : ''}`}
          onClick={() => setActiveTab('graphs')}
        >
          Graphiques
        </button>
      </div>
      <div className="navbar-user">
        <span>Bonjour, {username}</span>
        <button onClick={onLogout} className="logout-button">Déconnexion</button>
      </div>
    </nav>
  );
}

export default Navbar;