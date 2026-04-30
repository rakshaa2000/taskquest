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
import { Download } from 'lucide-react';

function GameDashboard() {
  const { achievements, stats, level, inventory, gold, toastMsg } = useGame();
  const [activeTab, setActiveTab] = useState('bosses');
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  return (
    <div className={`app-container active-tab-${activeTab}`}>
      {/* Mobile Nav */}
      <nav className="mobile-nav">
        <button className={activeTab === 'you' ? 'active' : ''} onClick={() => setActiveTab('you')}>
          <User size={20} /><span>You</span>
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

      {/* Full-width You Banner */}
      <div className="tab-section section-you full-width-section">
        {installPrompt && (
          <div className="glass-panel" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--accent-purple)', background: 'rgba(139, 92, 246, 0.1)' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Install TaskQuest</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Add to your home screen for quick access!</p>
            </div>
            <button className="btn btn-primary" onClick={handleInstall} style={{ gap: '0.5rem' }}>
              <Download size={18} /> Install
            </button>
          </div>
        )}
        <HeroStatus />
      </div>

      {/* Two-Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column: Tasks / Bosses / Actionables */}
        <div className="col-left">
          <div className="tab-section section-quests" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <DailyChallenges />
            <QuestBoard />
          </div>

          <div className="tab-section section-bosses">
            <BossBattle />
          </div>
        </div>

        {/* Right Column: Achievements / Upgrades / Sync */}
        <div className="col-right">
          <div className="tab-section section-you" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <MoodTracker />
            
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

            <div className="tab-section section-store">
              <EquipmentStore />
            </div>
            
            <PomodoroForge />
            <CheckInCalendar />
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
