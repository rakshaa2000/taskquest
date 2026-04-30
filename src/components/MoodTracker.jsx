import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Activity, Smile, Frown, Battery, BatteryCharging, Zap } from 'lucide-react';
import './MoodTracker.css';

export default function MoodTracker() {
  const { moodTracker, logMood } = useGame();

  const handleSelect = (energy) => {
    logMood(energy);
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
              className={`btn btn-sm ${moodTracker.energyLevel === 'hyper' ? 'active-mood' : ''}`} 
              onClick={() => handleSelect('hyper')}
              title="Hyper-focused"
            >
              <Zap size={16} color="#fbbf24" /> Hyper
            </button>
            <button 
              className={`btn btn-sm ${moodTracker.energyLevel === 'high' ? 'active-mood' : ''}`} 
              onClick={() => handleSelect('high')}
              title="High Energy"
            >
              <Zap size={16}/> High
            </button>
            <button 
              className={`btn btn-sm ${moodTracker.energyLevel === 'balanced' ? 'active-mood' : ''}`} 
              onClick={() => handleSelect('balanced')}
              title="Balanced"
            >
              <Activity size={16}/> Mid
            </button>
            <button 
              className={`btn btn-sm ${moodTracker.energyLevel === 'low' ? 'active-mood' : ''}`} 
              onClick={() => handleSelect('low')}
              title="Low Energy"
            >
              <Battery size={16}/> Low
            </button>
            <button 
              className={`btn btn-sm ${moodTracker.energyLevel === 'burned' ? 'active-mood' : ''}`} 
              onClick={() => handleSelect('burned')}
              title="Burned Out"
            >
              <Battery size={16} color="#ef4444" /> Exhausted
            </button>
          </div>
        </div>
      </div>

      {moodTracker.insight && (
        <div className="insight-box compact-insight">
          <p><BatteryCharging size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} /> {moodTracker.insight}</p>
        </div>
      )}
    </div>
  );
}
