import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { User, List, Skull, ShoppingCart, Flame } from 'lucide-react';
import HeroStatus from './components/HeroStatus';
import QuestBoard from './components/QuestBoard';
import BossBattle from './components/BossBattle';
import PomodoroForge from './components/PomodoroForge';
import DailyChallenges from './components/DailyChallenges';
import MoodTracker from './components/MoodTracker';
import EquipmentStore from './components/EquipmentStore';
import CheckInCalendar from './components/CheckInCalendar';

function GameDashboard() {
  const { achievements, stats, level, inventory, gold, toastMsg } = useGame();
  const [activeTab, setActiveTab] = useState('hero');

  return (
    <div className={`app-container active-tab-${activeTab}`}>
      {/* Mobile Nav */}
      <nav className="mobile-nav">
        <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => setActiveTab('hero')}>
          <User size={20} /><span>Hero</span>
        </button>
        <button className={activeTab === 'quests' ? 'active' : ''} onClick={() => setActiveTab('quests')}>
          <List size={20} /><span>Quests</span>
        </button>
        <button className={activeTab === 'bosses' ? 'active' : ''} onClick={() => setActiveTab('bosses')}>
          <Skull size={20} /><span>Bosses</span>
        </button>
        <button className={activeTab === 'store' ? 'active' : ''} onClick={() => setActiveTab('store')}>
          <ShoppingCart size={20} /><span>Store</span>
        </button>
        <button className={activeTab === 'forge' ? 'active' : ''} onClick={() => setActiveTab('forge')}>
          <Flame size={20} /><span>Forge</span>
        </button>
      </nav>

      {/* Full-width Hero Banner */}
      <div className="tab-section section-hero full-width-section">
        <HeroStatus />
      </div>

      {/* Two-Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="col-left">
          <div className="tab-section section-hero">
            <CheckInCalendar />
          </div>

          <div className="tab-section section-quests" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <DailyChallenges />
            <QuestBoard />
          </div>

          <div className="tab-section section-store">
            <EquipmentStore />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-right">
          <div className="tab-section section-hero">
            <div className="glass-panel achievements-panel">
              <h3 className="section-title" style={{ fontSize: '1.1rem' }}>🏆 Achievements</h3>
              <div className="achievements-grid">
                {achievements.map(ach => {
                  let progressStr = '';
                  switch(ach.id) {
                    case 'first_blood': progressStr = `${stats.bossesDefeated} / 1`; break;
                    case 'dragon_slayer': progressStr = `${stats.bossesDefeated} / 5`; break;
                    case 'boss_slayer': progressStr = `${stats.bossesDefeated} / 15`; break;
                    case 'focus_master': progressStr = `${stats.focusSessionsCompleted} / 10`; break;
                    case 'focused': progressStr = `${stats.focusSessionsCompleted} / 25`; break;
                    case 'task_apprentice': progressStr = `${stats.questsCompleted} / 10`; break;
                    case 'task_master': progressStr = `${stats.questsCompleted} / 50`; break;
                    case 'daily_champ': progressStr = `${stats.dailyChallengesCompleted} / 10`; break;
                    case 'level_10': progressStr = `${level} / 10`; break;
                    case 'veteran': progressStr = `${level} / 20`; break;
                    case 'shopaholic': progressStr = `${inventory ? inventory.length : 0} / 3`; break;
                    case 'rich': progressStr = `${gold} / 1000`; break;
                    default: break;
                  }

                  return (
                    <div 
                      key={ach.id} 
                      className="achievement-badge tooltip-container"
                      style={{ textAlign: 'center', opacity: ach.unlocked ? 1 : 0.4, filter: ach.unlocked ? 'none' : 'grayscale(100%)' }}
                    >
                      <div className="achievement-icon-circle" style={{ 
                        background: `rgba(${ach.color.replace('var(', '').replace(')', '') === '--gold-color' ? '251, 191, 36' : ach.color.replace('var(', '').replace(')', '') === '--accent-purple' ? '139, 92, 246' : '16, 185, 129'}, 0.15)`, 
                        border: `1px solid ${ach.color}`,
                      }}>
                        {ach.icon}
                      </div>
                      <span className="achievement-label">{ach.title}</span>
                      
                      <div className="tooltip-content">
                        <h4>{ach.title}</h4>
                        <p>{ach.description}</p>
                        <p className="tooltip-progress">{ach.unlocked ? 'Unlocked!' : `Progress: ${progressStr}`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="tab-section section-bosses">
            <BossBattle />
          </div>

          <div className="tab-section section-forge" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <PomodoroForge />
            <MoodTracker />
          </div>
        </div>
      </div>
      
      {toastMsg && (
        <div className="toast-notification">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

function ThemeWrapper() {
  const { profile } = useGame();
  
  useEffect(() => {
    document.body.className = `theme-${profile.archetype.toLowerCase()}`;
  }, [profile.archetype]);

  return <GameDashboard />;
}

function App() {
  return (
    <GameProvider>
      <ThemeWrapper />
    </GameProvider>
  );
}

export default App;
