'use client';

import { useState } from 'react';

type Subscriber = {
  id: string;
  email: string;
  whatsapp: string;
  date: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [error, setError] = useState('');

  const WHATSAPP_MESSAGE = "Vous etes bien enrgeitrez comme Beta testeu Pour lapliction MikhmonPro telechargez vias ce lien direct , Nb: Si vous aviez lancien version vous devriez peut rte le desinstelz pour profitez de la nouvele version fournit via playstore. https://play.google.com/store/apps/details?id=com.moailte.mikhmonproai";

  const loadData = async () => {
    if (!password) {
      alert("Veuillez entrer le mot de passe d'administration.");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/export?pwd=${encodeURIComponent(password)}`);
      if (!res.ok) {
        throw new Error("Mot de passe incorrect ou erreur serveur.");
      }
      
      const csvContent = await res.text();
      const lines = csvContent.split('\n').filter(line => line.trim() !== '');
      
      // Skip header line
      const dataLines = lines.slice(1);
      
      const parsedSubscribers: Subscriber[] = dataLines.map(line => {
        const [id, email, whatsapp, ...dateParts] = line.split(',');
        const date = dateParts.join(','); // In case date has commas
        return { id, email, whatsapp, date };
      });
      
      setSubscribers(parsedSubscribers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportPlayConsole = () => {
    if (subscribers.length === 0) return;
    
    // Play Console expects a simple CSV with emails
    const csvContent = "Email\n" + subscribers.map(s => s.email).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'play-console-emails.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatWhatsAppNumber = (num: string) => {
    // Remove anything that is not a digit or plus sign
    let cleaned = num.replace(/[^0-9+]/g, '');
    // Remove the plus sign for the wa.me link
    return cleaned.replace('+', '');
  };

  return (
    <main style={{ width: '100%', padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
      <div className="bento-container" style={{ width: '100%', maxWidth: '1000px' }}>
        <div className="bento-card col-span-12">
          
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Administration Bêta</h1>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Gérez les inscriptions, exportez pour Play Console et contactez les testeurs via WhatsApp.
          </p>

          {subscribers.length === 0 ? (
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div className="m3-input-group">
                <input
                  type="password"
                  className="m3-input"
                  placeholder="Mot de passe admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {error && <p style={{ color: '#ef4444', margin: '1rem 0', textAlign: 'center' }}>{error}</p>}
              
              <button 
                onClick={loadData}
                disabled={loading}
                className="m3-btn"
                style={{ width: '100%' }}
              >
                {loading ? 'Chargement...' : 'Charger les données'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{subscribers.length} Bêta-testeurs</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={exportPlayConsole} className="m3-btn">
                    Télécharger CSV (Play Console)
                  </button>
                  <button 
                    onClick={() => window.location.href = `/api/export?pwd=${encodeURIComponent(password)}`} 
                    className="m3-btn"
                    style={{ background: 'transparent', color: 'var(--md-sys-color-primary)', border: '1px solid var(--md-sys-color-primary)' }}
                  >
                    CSV Complet (Original)
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>WhatsApp</th>
                      <th style={{ padding: '1rem' }}>Date d'inscription</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, idx) => (
                      <tr key={sub.id || idx} style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                        <td style={{ padding: '1rem' }}>{sub.email}</td>
                        <td style={{ padding: '1rem' }}>{sub.whatsapp}</td>
                        <td style={{ padding: '1rem' }}>
                          {new Date(sub.date).toLocaleString('fr-FR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <a 
                            href={`https://wa.me/${formatWhatsAppNumber(sub.whatsapp)}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="m3-btn"
                            style={{ 
                              padding: '0.5rem 1rem', 
                              fontSize: '0.9rem',
                              backgroundColor: '#25D366',
                              color: '#fff',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
