import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Skull, Target, Plus, Ghost, Heart, List } from 'lucide-react';
import './BossBattle.css';

export default function BossBattle() {
  const { boss, completeBossTask, addBoss } = useGame();
  const [isShaking, setIsShaking] = useState(false);
  
  const [isAdding, setIsAdding] = useState(false);
  const [bossName, setBossName] = useState('');
  const [bossHp, setBossHp] = useState(500);
  const [tasksText, setTasksText] = useState('');

  const activeTasks = boss.tasks.filter(t => !t.completed);
  const hpPercent = (boss.currentHp / boss.maxHp) * 100;

  const handleAttack = (taskId) => {
    setIsShaking(true);
    completeBossTask(taskId);
    setTimeout(() => setIsShaking(false), 400); // match animation duration
  };

  const handleAddBoss = (e) => {
    e.preventDefault();
    if (!bossName.trim() || !tasksText.trim()) return;
    
    // Parse tasks
    const parsedTasks = tasksText.split(',').map(t => {
      const title = t.trim();
      return { title, damage: Math.floor(bossHp / tasksText.split(',').length) || 100 };
    });

    addBoss(bossName, Number(bossHp), parsedTasks);
    setIsAdding(false);
    setBossName('');
    setBossHp(500);
    setTasksText('');
  };

  return (
    <div className="glass-panel boss-battle">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="section-title" style={{ marginBottom: 0 }}>
          <Skull size={24} className="boss-icon" /> Boss Battle
        </h3>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={16} /> New Boss
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddBoss} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Ghost size={16} /> Boss Name</label>
            <input type="text" value={bossName} onChange={e => setBossName(e.target.value)} placeholder="E.g. The Deployment Dragon" required style={{ width: '100%' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Heart size={16} /> Total HP</label>
            <input type="number" value={bossHp} onChange={e => setBossHp(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><List size={16} /> Sub-tasks (comma separated)</label>
            <input type="text" value={tasksText} onChange={e => setTasksText(e.target.value)} placeholder="Setup CI, Write tests, Deploy to staging" required style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Summon Boss</button>
          </div>
        </form>
      )}
      
      <div className={`boss-arena ${isShaking ? 'shake' : ''}`}>
        <div className="boss-avatar">
          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${boss.name.replace(/\s+/g, '')}&backgroundColor=transparent`} alt="Boss Monster" />
        </div>
        
        <div className="boss-info">
          <h4>{boss.name}</h4>
          <div className="boss-hp-container">
            <div className="boss-hp-label">
              <span>HP</span>
              <span>{boss.currentHp} / {boss.maxHp}</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill boss-hp-bar" 
                style={{ width: `${hpPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="boss-subtasks">
        <h5><Target size={16} /> Weak Points (Sub-tasks)</h5>
        <div className="subtask-list">
          {activeTasks.length === 0 ? (
            <div className="boss-defeated">
              <p>🎉 Boss Defeated! The project is complete.</p>
            </div>
          ) : (
            activeTasks.map(task => (
              <div key={task.id} className="subtask-item">
                <span className="subtask-title">{task.title}</span>
                <button 
                  className="btn btn-attack"
                  onClick={() => handleAttack(task.id)}
                >
                  Strike (-{task.damage} HP)
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
