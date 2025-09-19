import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/app.css';

interface JungleState {
  redSideJungle: {
    krugs: { respawnTime: number | null };
    raptors: { respawnTime: number | null };
    red: { respawnTime: number | null };
    wolves: { respawnTime: number | null };
    blue: { respawnTime: number | null };
    gromp: { respawnTime: number | null };
  };
  blueSideJungle: {
    krugs: { respawnTime: number | null };
    raptors: { respawnTime: number | null };
    red: { respawnTime: number | null };
    wolves: { respawnTime: number | null };
    blue: { respawnTime: number | null };
    gromp: { respawnTime: number | null };
  };
}

const App: React.FC = () => {
  const [jungleState, setJungleState] = React.useState<JungleState | null>(null);
  const [gameConnected, setGameConnected] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Check if we're in electron environment
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      // Setup IPC listeners
      (window as any).electronAPI.onJungleUpdate((data: any) => {
        setJungleState(data.state);
        setGameConnected(true);
      });

      // Check initial game state
      (window as any).electronAPI.getJungleState().then((state: JungleState) => {
        if (state) {
          setJungleState(state);
          setGameConnected(true);
        }
      }).catch((err: Error) => {
        console.error('Failed to get initial jungle state:', err);
        setError('Failed to connect to game');
      });
    }
  }, []);

  const formatTime = (time: number | null): string => {
    if (!time) return 'Available';
    const now = Date.now();
    const remaining = Math.max(0, time - now);
    if (remaining === 0) return 'Available';
    return `${Math.ceil(remaining / 1000)}s`;
  };

  const renderCamp = (name: string, camp: { respawnTime: number | null }) => (
    <div key={name} className="camp">
      <span className="camp-name">{name}</span>
      <span className={`camp-timer ${!camp.respawnTime ? 'available' : ''}`}>
        {formatTime(camp.respawnTime)}
      </span>
    </div>
  );

  if (error) {
    return (
      <div className="app error">
        <h1>🌲 LoL Jungle Assistant</h1>
        <div className="error-message">{error}</div>
        <div className="status disconnected">Disconnected</div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>🌲 LoL Jungle Assistant</h1>
      
      <div className="status-bar">
        <div className={`status ${gameConnected ? 'connected' : 'disconnected'}`}>
          {gameConnected ? 'Connected to LoL' : 'Waiting for game...'}
        </div>
      </div>

      {jungleState ? (
        <div className="jungle-tracker">
          <div className="team-jungle">
            <h3>Your Jungle</h3>
            <div className="camps">
              {Object.entries(jungleState.blueSideJungle).map(([name, camp]) =>
                renderCamp(name, camp)
              )}
            </div>
          </div>

          <div className="team-jungle">
            <h3>Enemy Jungle</h3>
            <div className="camps">
              {Object.entries(jungleState.redSideJungle).map(([name, camp]) =>
                renderCamp(name, camp)
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="loading">
          <div>Loading jungle data...</div>
          <div className="help-text">
            Make sure League of Legends is running and you're in a game.
          </div>
        </div>
      )}
    </div>
  );
};

// Render the app using React 18+ createRoot
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}