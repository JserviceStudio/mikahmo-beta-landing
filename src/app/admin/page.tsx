'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');

  const handleDownload = () => {
    if (!password) {
      alert("Veuillez entrer le mot de passe d'administration.");
      return;
    }
    
    // Rediriger vers l'endpoint d'exportation avec le mot de passe
    window.location.href = `/api/export?pwd=${encodeURIComponent(password)}`;
  };

  return (
    <main style={{ width: '100%', padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
      <div className="bento-container" style={{ maxWidth: '600px' }}>
        <div className="bento-card col-span-12">
          
          <div className="bento-icon-wrapper" style={{ margin: '0 auto 1.5rem auto' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Administration</h1>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Exportez la liste des bêta-testeurs au format CSV.
          </p>

          <div className="m3-input-group">
            <input
              type="password"
              className="m3-input"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleDownload}
            className="m3-btn"
          >
            Télécharger le CSV
          </button>
        </div>
      </div>
    </main>
  );
}
