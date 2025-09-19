import React, { useState, useEffect } from 'react';

export const Dashboard: React.FC = () => {
  const [jungleState, setJungleState] = useState<any>(null);
  const [gameState, setGameState] = useState<'not_detected' | 'detected' | 'monitoring'>('not_detected');

  useEffect(() => {
    const checkGameState = async () => {
      if ((window as any).electronAPI) {
        try {
          const inGame = await (window as any).electronAPI.invoke('check-game-state');
          setGameState(inGame ? 'detected' : 'not_detected');
        } catch (error) {
          setGameState('not_detected');
        }
      }
    };

    checkGameState();
    const interval = setInterval(checkGameState, 5000);

    return () => clearInterval(interval);
  }, []);

  const getGameStateBadge = () => {
    switch (gameState) {
      case 'detected':
        return <div className="badge success">League Detected</div>;
      case 'monitoring':
        return <div className="badge success">Monitoring Active</div>;
      default:
        return <div className="badge error">League Not Detected</div>;
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h3>🌲 Jungle Assistant Status</h3>
        <div style={{ marginBottom: '16px' }}>
          {getGameStateBadge()}
          <div className="badge">Overwolf Integration Ready</div>
          <div className="badge">Config Loaded</div>
        </div>

        <div className="jungle-metrics">
          <div className="metric-card">
            <div className="metric-value">
              {jungleState?.ownCamps?.length || 0}
            </div>
            <div className="metric-label">Camps Tracked</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">
              {jungleState?.enemyCampEstimation?.length || 0}
            </div>
            <div className="metric-label">Enemy Camps</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">
              {jungleState?.objectiveTimers?.length || 0}
            </div>
            <div className="metric-label">Objectives</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">
              {jungleState?.lanePriorities?.length || 0}
            </div>
            <div className="metric-label">Lane States</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>⚙️ Features</h3>
        <div>
          <div className="badge success">✓ Camp Timer Tracking</div>
          <div className="badge success">✓ Enemy Jungle Estimation</div>
          <div className="badge success">✓ Scuttle Priority Alerts</div>
          <div className="badge success">✓ Gank Recommendations</div>
          <div className="badge success">✓ Objective Timing</div>
          <div className="badge warning">⏳ Per-Player Gold Diffs (WIP)</div>
        </div>
        
        <div style={{ marginTop: '16px', fontSize: '14px', opacity: 0.8 }}>
          <strong>Configuration:</strong> Edit <code>config.yaml</code> in your app data folder to customize settings:
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>summoner_name: Your League username</li>
            <li>region: Server region (EUW1, NA1, etc.)</li>
            <li>tts_enabled: Voice announcements</li>
            <li>telemetry_enabled: Anonymous usage stats (opt-in)</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3>🛡️ Compliance</h3>
        <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
          <p>
            <strong>Riot-Compliant:</strong> Uses only Overwolf Game Events and Live Client Data API. 
            No automation, no enemy ability tracking, no hidden data scraping.
          </p>
          <p>
            <strong>Privacy-First:</strong> Telemetry disabled by default. No Riot credentials collected.
            All data stored locally on your device.
          </p>
        </div>
      </div>
    </div>
  );
};
