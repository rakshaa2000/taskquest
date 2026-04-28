import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Flame, Play, Square } from 'lucide-react';
import './PomodoroForge.css';

export default function PomodoroForge() {
  const { addFocusShard, takeDamage } = useGame();
  
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [mode, setMode] = useState('focus'); // focus, break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        addFocusShard();
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  // Simulate "interacted with phone/distracted"
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive && mode === 'focus') {
        takeDamage(10); // Lose HP for leaving the tab!
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel pomodoro-forge">
      <h3 className="section-title">
        <Flame size={24} className="forge-icon" /> The Pomodoro Forge
      </h3>
      
      <div className="forge-container">
        <div className="forge-mode">
          <span className={mode === 'focus' ? 'active focus' : ''} onClick={() => { setMode('focus'); setTimeLeft(25*60); setIsActive(false); }}>Focus</span>
          <span className={mode === 'break' ? 'active break' : ''} onClick={() => { setMode('break'); setTimeLeft(5*60); setIsActive(false); }}>Rest</span>
        </div>

        <div className={`timer-display ${isActive ? 'glow-effect' : ''}`}>
          {formatTime(timeLeft)}
        </div>
        
        <p className="forge-warning">
          {mode === 'focus' 
            ? "Stay on this tab! Leaving will cost you 10 HP." 
            : "Rest well, warrior. Your HP is safe."}
        </p>

        <div className="forge-controls">
          <button className="btn btn-primary" onClick={toggleTimer}>
            {isActive ? <Square size={18} /> : <Play size={18} />} 
            {isActive ? 'Stop' : 'Forge!'}
          </button>
          <button className="btn" onClick={resetTimer}>Reset</button>
        </div>
      </div>
    </div>
  );
}
