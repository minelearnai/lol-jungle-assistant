import React, { useEffect, useState } from 'react';

interface OverlayData {
  nextCamp: string;
  scuttlePriority: string;
  nextAction: string;
  dragonTimer: string;
  baronTimer: string;
}

export const Overlay: React.FC = () => {
  const [data, setData] = useState<OverlayData>({
    nextCamp: '—',
    scuttlePriority: '—',
    nextAction: 'Analyzing...',
    dragonTimer: '--:--',
    baronTimer: '--:--'
  });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleJungleUpdate = (event: any, updateData: any) => {
      const state = updateData.state;
      const recommendations = updateData.recommendations || [];

      // Update next camp
      const availableCamps = state?.ownCamps
        ?.filter((camp: any) => camp.isAlive)
        ?.sort((a: any, b: any) => b.efficiency - a.efficiency);
      
      if (availableCamps && availableCamps.length > 0) {
        const nextCamp = availableCamps[0];
        const timeToOptimal = Math.max(0, nextCamp.nextOptimal - state.gameTime);
        setData(prev => ({
          ...prev,
          nextCamp: `${nextCamp.name} (${formatTime(timeToOptimal)})`
        }));
      }

      // Update scuttle priority
      const topPriority = state?.scuttleTimers?.topRiver?.priority || 0;
      const bottomPriority = state?.scuttleTimers?.bottomRiver?.priority || 0;
      const highestPriority = Math.max(topPriority, bottomPriority);
      
      setData(prev => ({
        ...prev,
        scuttlePriority: highestPriority > 0.7 ? 'High' : 
                        highestPriority > 0.4 ? 'Medium' : 'Low'
      }));

      // Update next action
      if (recommendations.length > 0) {
        const topRecommendation = recommendations[0];
        setData(prev => ({
          ...prev,
          nextAction: `${topRecommendation.action} — ${Math.round(topRecommendation.confidence * 100)}% — ${topRecommendation.reason}`
        }));
      }

      // Update objective timers
      const dragonObj = state?.objectiveTimers?.find((obj: any) => obj.name === 'Dragon');
      const baronObj = state?.objectiveTimers?.find((obj: any) => obj.name === 'Baron');
      
      setData(prev => ({
        ...prev,
        dragonTimer: dragonObj ? formatTime(Math.max(0, dragonObj.respawnTime - state.gameTime)) : '--:--',
        baronTimer: baronObj ? formatTime(Math.max(0, baronObj.respawnTime - state.gameTime)) : '--:--'
      }));
    };

    // In Electron, listen for IPC messages
    if ((window as any).electronAPI) {
      (window as any).electronAPI.on('jungle-update', handleJungleUpdate);
    }

    // Cleanup
    return () => {
      if ((window as any).electronAPI) {
        (window as any).electronAPI.removeListener('jungle-update', handleJungleUpdate);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'High': return '#ff4444';
      case 'Medium': return '#ffaa44';  
      case 'Low': return '#44ff44';
      default: return '#cccccc';
    }
  };

  if (!visible) return null;

  return (
    <div className="overlay">
      <div className="overlay-header">
        <div>
          Next Camp: <span style={{ color: '#7fb8ff' }}>{data.nextCamp}</span>
        </div>
        <div style={{ fontSize: '11px' }}>
          Scuttle: <span style={{ color: getPriorityColor(data.scuttlePriority) }}>
            {data.scuttlePriority}
          </span>
        </div>
        <button 
          onClick={() => setVisible(false)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#888', 
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ✕
        </button>
      </div>

      <div className="overlay-action">
        <div style={{ color: '#7CFC00', fontWeight: 'bold', fontSize: '12px' }}>
          {data.nextAction}
        </div>
      </div>

      <div className="overlay-timers">
        <div>Dragon: <span style={{ color: '#ff6b35' }}>{data.dragonTimer}</span></div>
        <div>Baron: <span style={{ color: '#9c59d1' }}>{data.baronTimer}</span></div>
        <div style={{ marginLeft: 'auto', opacity: 0.6 }}>
          {new Date().toLocaleTimeString().slice(0, 5)}
        </div>
      </div>
    </div>
  );
};
