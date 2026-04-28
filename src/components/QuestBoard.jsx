import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Scroll, CheckCircle, Calendar, Layout, Coins, Zap, Plus, Edit2, Save, X } from 'lucide-react';
import './QuestBoard.css';

export default function QuestBoard() {
  const { quests, completeQuest, addQuest, editQuest } = useGame();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('Easy');
  const [newTime, setNewTime] = useState('30m');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('Easy');
  const [editTime, setEditTime] = useState('30m');

  const handleStartEdit = (quest) => {
    setEditingId(quest.id);
    setEditTitle(quest.title);
    setEditDifficulty(quest.difficulty);
    setEditTime(quest.estimatedTime);
  };

  const handleSaveEdit = (id) => {
    editQuest(id, { title: editTitle, difficulty: editDifficulty, estimatedTime: editTime });
    setEditingId(null);
  };

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuestsCount = quests.filter(q => q.completed).length;

  const handleAddQuest = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addQuest(newTitle, newDifficulty, newTime);
    setNewTitle('');
    setNewDifficulty('Easy');
    setNewTime('30m');
    setIsAdding(false);
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'jira': return <Layout size={14} />;
      case 'calendar': return <Calendar size={14} />;
      default: return null;
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'var(--accent-neon)';
      case 'Medium': return 'var(--gold-color)';
      case 'Hard': return 'var(--hp-color)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="glass-panel quest-board">
      <div className="quest-board-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="section-title" style={{ marginBottom: 0 }}>
          <Scroll size={24} /> Daily Quests
        </h3>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={16} /> Add Quest
        </button>
      </div>
      
      <div className="quest-stats" style={{ marginBottom: '1.5rem' }}>
        <span>{completedQuestsCount} / {quests.length} Completed</span>
        <div className="progress-bar-container" style={{ height: '4px', marginTop: '0.5rem' }}>
          <div 
            className="progress-bar-fill xp-bar" 
            style={{ width: `${(completedQuestsCount / quests.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {isAdding && (
        <form className="add-quest-form" onSubmit={handleAddQuest} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Quest Title (e.g. Defeat the Documentation Dragon)" 
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--panel-border)', color: 'white', borderRadius: '4px' }}
          />
          <div className="add-quest-inputs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <select value={newDifficulty} onChange={e => setNewDifficulty(e.target.value)} style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--panel-border)', color: 'white', borderRadius: '4px' }}>
              <option value="Easy" style={{color: 'black'}}>Easy</option>
              <option value="Medium" style={{color: 'black'}}>Medium</option>
              <option value="Hard" style={{color: 'black'}}>Hard</option>
            </select>
            <input 
              type="text" 
              placeholder="Est. Time (e.g. 1h)" 
              value={newTime} 
              onChange={e => setNewTime(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--panel-border)', color: 'white', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Accept Quest</button>
          </div>
        </form>
      )}

      <div className="quest-list">
        {activeQuests.length === 0 ? (
          <div className="empty-state">All daily quests complete! The realm is safe... for now.</div>
        ) : (
          activeQuests.map(quest => (
            <div key={quest.id} className="quest-card">
              {editingId === quest.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--panel-border)', color: 'white', borderRadius: '4px' }}
                  />
                  <div className="add-quest-inputs" style={{ display: 'flex', gap: '0.5rem' }}>
                    <select value={editDifficulty} onChange={e => setEditDifficulty(e.target.value)} style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--panel-border)', color: 'black', borderRadius: '4px' }}>
                      <option value="Easy" style={{color: 'black'}}>Easy</option>
                      <option value="Medium" style={{color: 'black'}}>Medium</option>
                      <option value="Hard" style={{color: 'black'}}>Hard</option>
                    </select>
                    <input 
                      type="text" 
                      value={editTime} 
                      onChange={e => setEditTime(e.target.value)}
                      style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--panel-border)', color: 'white', borderRadius: '4px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button className="btn" onClick={() => setEditingId(null)}><X size={16}/></button>
                    <button className="btn btn-primary" onClick={() => handleSaveEdit(quest.id)}><Save size={16}/></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="quest-header">
                    <div className="quest-title-container">
                      <span className="quest-source" title={quest.source || 'Manual'}>
                        {getSourceIcon(quest.source)}
                      </span>
                      <h4>{quest.title}</h4>
                      <button className="btn-icon" onClick={() => handleStartEdit(quest)} style={{ marginLeft: '0.5rem' }} title="Edit Quest">
                        <Edit2 size={14} />
                      </button>
                    </div>
                    <span 
                      className="difficulty-badge" 
                      style={{ borderColor: getDifficultyColor(quest.difficulty), color: getDifficultyColor(quest.difficulty) }}
                    >
                      {quest.difficulty}
                    </span>
                  </div>
                  
                  <div className="quest-footer">
                    <div className="rewards">
                      <span className="reward time" style={{ color: 'var(--text-secondary)', marginRight: '1rem', fontSize: '0.8rem' }}>⏱ {quest.estimatedTime}</span>
                      <span className="reward xp"><Zap size={14} /> +{quest.xp}</span>
                      <span className="reward gold"><Coins size={14} /> +{quest.gold}</span>
                    </div>
                    <button 
                      className="btn btn-primary complete-btn"
                      onClick={() => completeQuest(quest.id)}
                    >
                      <CheckCircle size={16} /> Complete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
