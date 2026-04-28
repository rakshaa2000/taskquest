import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Activity, Smile, Frown, Battery, BatteryCharging, Zap } from 'lucide-react';
import './MoodTracker.css';

export default function MoodTracker() {
  const { moodTracker, logMood } = useGame();
  const [selectedMood, setSelectedMood] = useState(moodTracker.mood);
  const [selectedEnergy, setSelectedEnergy] = useState(moodTracker.energyLevel);

  const handleLog = () => {
    logMood(selectedMood, selectedEnergy);
  };

  return (
    <div className="glass-panel mood-tracker compact">
      <h3 className="section-title compact-title">
        <Activity size={20} /> Bio-Sync
      </h3>
      
      <div className="mood-tracker-compact-row">
        <div className="tracker-group">
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${selectedMood === 'focused' ? 'active-mood' : ''}`} 
              onClick={() => setSelectedMood('focused')}
              title="Focused"
            >
              <Smile size={16}/>
            </button>
            <button 
              className={`btn btn-sm ${selectedMood === 'stressed' ? 'active-mood' : ''}`} 
              onClick={() => setSelectedMood('stressed')}
              title="Stressed"
            >
              <Frown size={16}/>
            </button>
          </div>
        </div>

        <div className="tracker-group">
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${selectedEnergy === 'high' ? 'active-mood' : ''}`} 
              onClick={() => setSelectedEnergy('high')}
              title="High Energy"
            >
              <Zap size={16}/>
            </button>
            <button 
              className={`btn btn-sm ${selectedEnergy === 'low' ? 'active-mood' : ''}`} 
              onClick={() => setSelectedEnergy('low')}
              title="Low Energy"
            >
              <Battery size={16}/>
            </button>
          </div>
        </div>

        <button className="btn btn-primary btn-sm sync-btn" onClick={handleLog}>Sync</button>
      </div>

      {moodTracker.insight && (
        <div className="insight-box compact-insight">
          <p><BatteryCharging size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} /> {moodTracker.insight}</p>
        </div>
      )}
    </div>
  );
}
