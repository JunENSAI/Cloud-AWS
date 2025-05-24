import React, { useState } from 'react';
import LoginPage from './components/Auth/LoginPage';
import HomePage from './pages/HomePage';
import './App.css'; // Fichier CSS global

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    // Dans une vraie application, vous vérifieriez les identifiants ici
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <HomePage username={username} onLogout={handleLogout} />;
}

export default App;