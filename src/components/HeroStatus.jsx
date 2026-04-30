import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../context/GameContext';
import { Shield, Swords, Coins, Zap, Edit3, Flame, Image, User, Briefcase } from 'lucide-react';
import { STORE_ITEMS } from './EquipmentStore';
import './HeroStatus.css';

const AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=TaskQuestYou&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/micah/svg?seed=Max&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Destiny&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Mimi&backgroundColor=transparent'
];

export default function HeroStatus() {
  const { level, xp, maxXp, hp, maxHp, gold, focusShards, streak, profile, updateProfile, inventory } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editArchetype, setEditArchetype] = useState(profile.archetype);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);

  const xpPercent = (xp / maxXp) * 100;
  const hpPercent = (hp / maxHp) * 100;

  const equippedItems = (STORE_ITEMS[profile.archetype] || STORE_ITEMS.Coder).filter(item => inventory && inventory.includes(item.id));

  const handleSave = () => {
    updateProfile({ name: editName, archetype: editArchetype, avatar: editAvatar });
    setIsEditing(false);
  };

  return (
    <div className="glass-panel hero-status">
      <div className="hero-profile">
        <div className="avatar-placeholder">
          <img src={profile.avatar} alt="Your Avatar" />
        </div>
        <div className="hero-info">
          <h2>
            Level {level} <span>{profile.archetype}</span>
            <button className="btn-icon" onClick={() => setIsEditing(true)}>
              <Edit3 size={14} />
            </button>
          </h2>
          <div className="hero-name">{profile.name}</div>
          
          {equippedItems.length > 0 && (
            <div className="equipped-items" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              {equippedItems.map(item => (
                <span key={item.id} title={item.name} style={{ fontSize: '1.2rem', background: 'rgba(255,255,255,0.1)', padding: '0.3rem', borderRadius: '4px' }}>
                  {item.icon}
                </span>
              ))}
            </div>
          )}
          
          <div className="stats-row">
            <div className="stat" title="Health Points">
              <Shield size={16} className="stat-icon hp-icon" />
              <div className="progress-bar-container">
                <div className="progress-bar-fill hp-bar" style={{ width: `${hpPercent}%` }}></div>
              </div>
              <span className="stat-text">{hp}/{maxHp}</span>
            </div>
            
            <div className="stat" title="Experience Points">
              <Zap size={16} className="stat-icon xp-icon" />
              <div className="progress-bar-container">
                <div className="progress-bar-fill xp-bar" style={{ width: `${xpPercent}%` }}></div>
              </div>
              <span className="stat-text">{xp}/{maxXp}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="currencies">
        <div className="currency-badge gold" title="Gold">
          <Coins size={20} />
          <span>{gold}</span>
        </div>
        <div className="currency-badge shards" title="Focus Shards">
          <Swords size={20} />
          <span>{focusShards}</span>
        </div>
        <div className="currency-badge streak" title="Day Streak">
          <Flame size={20} color="var(--hp-color)" />
          <span>{streak}</span>
        </div>
      </div>

      {isEditing && createPortal(
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h3>Character Creation</h3>
            
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Image size={16} /> Avatar</label>
              <div className="avatar-selection">
                {AVATARS.map((url, i) => (
                  <div 
                    key={i} 
                    className={`avatar-option ${editAvatar === url ? 'selected' : ''}`}
                    onClick={() => setEditAvatar(url)}
                  >
                    <img src={url} alt={`Avatar option ${i}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={16} /> Archetype</label>
              <select value={editArchetype} onChange={(e) => setEditArchetype(e.target.value)}>
                <option value="Coder">Coder</option>
                <option value="Scientist">Scientist</option>
                <option value="Adventurer">Adventurer</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              <button className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
