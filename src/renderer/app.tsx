import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Overlay } from './components/Overlay';
import { Dashboard } from './components/Dashboard';
import './styles/main.css';

function App() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');

  return (
    <div>
      {/* Main Application */}
      <div style={{ padding: '16px' }}>
        <header style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 8px 0', color: '#f0e6d2' }}>
            🌲 LoL Jungle Assistant
          </h1>
          <p style={{ margin: '0', opacity: 0.8, fontSize: '14px' }}>
            Master the jungle with intelligent recommendations
          </p>
        </header>

        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <button 
            className="btn"
            onClick={() => setShowOverlay(!showOverlay)}
            style={{ marginRight: '8px' }}
          >
            {showOverlay ? 'Hide' : 'Show'} Overlay
          </button>
          
          <button 
            className={`btn ${activeTab === 'dashboard' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ marginRight: '8px' }}
          >
            Dashboard
          </button>
          
          <button 
            className={`btn ${activeTab === 'settings' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {activeTab === 'dashboard' && <Dashboard />}
        
        {activeTab === 'settings' && (
          <div className="card">
            <h3>Settings</h3>
            <p>Settings panel coming soon. For now, edit config.yaml directly.</p>
            <div className="badge">Config location: %APPDATA%/lol-jungle-assistant/config.yaml</div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {showOverlay && <Overlay />}
    </div>
  );
}

// Mount the app
const mountElement = document.getElementById('root') || 
                   document.getElementById('overlay-root') || 
                   document.getElementById('dashboard-root');

if (mountElement) {
  const root = createRoot(mountElement);
  root.render(<App />);
}
