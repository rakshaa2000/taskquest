import React, { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { ShoppingCart, Lock, RefreshCw } from 'lucide-react';
import './EquipmentStore.css';

export const STORE_ITEMS = {
  Coder: [
    { id: 'c1', name: 'Mechanical Keyboard', price: 100, reqLevel: 1, icon: '⌨️', description: 'Click-clack! Motivation boost.' },
    { id: 'c9', name: 'Blue Light Glasses', price: 150, reqLevel: 2, icon: '👓', description: 'Save your eyes, code longer.' },
    { id: 'c4', name: 'Coffee Maker', price: 200, reqLevel: 3, icon: '☕', description: 'Keeps the energy flowing.' },
    { id: 'c10', name: 'Ergonomic Mouse', price: 250, reqLevel: 4, icon: '🖱️', description: 'Wrist health is wealth.' },
    { id: 'c2', name: 'Noise Cancelling Headphones', price: 350, reqLevel: 5, icon: '🎧', description: 'Blocks distractions entirely.' },
    { id: 'c11', name: 'Rubber Duck', price: 450, reqLevel: 6, icon: '🦆', description: 'Explaining code to a duck actually works.' },
    { id: 'c5', name: 'Standing Desk', price: 600, reqLevel: 7, icon: '🪑', description: 'Better posture, better code.' },
    { id: 'c12', name: 'Ultra-Wide Monitor', price: 800, reqLevel: 9, icon: '🖥️', description: 'See all the columns at once.' },
    { id: 'c3', name: 'Dual Monitors', price: 1000, reqLevel: 10, icon: '📺', description: 'Double the workspace, double the fun.' },
    { id: 'c13', name: 'Fiber Optic Line', price: 1500, reqLevel: 12, icon: '🌐', description: 'Zero lag, maximum flow.' },
    { id: 'c6', name: 'AI Assistant', price: 2500, reqLevel: 15, icon: '🤖', description: 'Automates the boring stuff.' },
    { id: 'c14', name: 'Server Rack', price: 3500, reqLevel: 18, icon: '🗄️', description: 'Host your own reality.' },
    { id: 'c7', name: 'Cloud Cluster', price: 5000, reqLevel: 20, icon: '☁️', description: 'Infinite scalability at your fingertips.' },
    { id: 'c15', name: 'Quantum Core', price: 7500, reqLevel: 25, icon: '⚛️', description: 'Process tasks before they even exist.' },
    { id: 'c8', name: 'Neural Link', price: 10000, reqLevel: 30, icon: '🧠', description: 'Think code directly into the compiler.' }
  ],
  Scientist: [
    { id: 's1', name: 'Erlenmeyer Flask', price: 100, reqLevel: 1, icon: '🧪', description: 'Mix solutions perfectly.' },
    { id: 's9', name: 'Lab Notebook', price: 150, reqLevel: 2, icon: '📓', description: 'Record every failure as a discovery.' },
    { id: 's4', name: 'Safety Goggles', price: 200, reqLevel: 3, icon: '🥽', description: 'Safety first in the lab!' },
    { id: 's10', name: 'Bunsen Burner', price: 250, reqLevel: 4, icon: '🔥', description: 'Apply heat where it is needed.' },
    { id: 's2', name: 'High-Tech Microscope', price: 350, reqLevel: 5, icon: '🔬', description: 'See fine details in your bugs.' },
    { id: 's11', name: 'Hazmat Suit', price: 450, reqLevel: 6, icon: '🧥', description: 'Protection against toxic code.' },
    { id: 's5', name: 'Centrifuge', price: 600, reqLevel: 7, icon: '🌀', description: 'Separate the signal from noise.' },
    { id: 's12', name: 'Telescope', price: 800, reqLevel: 9, icon: '🔭', description: 'Look for distant solutions.' },
    { id: 's3', name: 'Lead-lined Lab Coat', price: 1000, reqLevel: 10, icon: '🥼', description: 'Protects against toxic radiation.' },
    { id: 's13', name: 'DNA Sequencer', price: 1500, reqLevel: 12, icon: '🧬', description: 'Rewrite your own productivity.' },
    { id: 's6', name: 'Quantum Computer', price: 2500, reqLevel: 15, icon: '💎', description: 'Solve problems in parallel universes.' },
    { id: 's14', name: 'Nuclear Reactor', price: 3500, reqLevel: 18, icon: '☢️', description: 'Unlimited power for your sessions.' },
    { id: 's7', name: 'Hadron Collider', price: 5000, reqLevel: 20, icon: '🛰️', description: 'Smash tasks together at light speed.' },
    { id: 's15', name: 'Antimatter Battery', price: 7500, reqLevel: 25, icon: '🔋', description: 'Concentrated energy for all-nighters.' },
    { id: 's8', name: 'Dyson Sphere', price: 10000, reqLevel: 30, icon: '☀️', description: 'Harness the power of a star for focus.' }
  ],
  Adventurer: [
    { id: 'a1', name: 'Sturdy Boots', price: 100, reqLevel: 1, icon: '👢', description: 'Made for walking the extra mile.' },
    { id: 'a9', name: 'Leather Satchel', price: 150, reqLevel: 2, icon: '👜', description: 'Carry more ideas with you.' },
    { id: 'a4', name: 'Travel Rations', price: 200, reqLevel: 3, icon: '🥪', description: 'Keeps you going on long treks.' },
    { id: 'a10', name: 'Iron Shield', price: 250, reqLevel: 4, icon: '🛡️', description: 'Deflect distractions like arrows.' },
    { id: 'a2', name: 'Golden Compass', price: 350, reqLevel: 5, icon: '🧭', description: 'Never lose your way.' },
    { id: 'a11', name: 'Climbing Rope', price: 450, reqLevel: 6, icon: '➰', description: 'Scale the steepest deadlines.' },
    { id: 'a5', name: 'Enchanted Map', price: 600, reqLevel: 7, icon: '🗺️', description: 'Reveals hidden shortcuts.' },
    { id: 'a12', name: 'Magic Lantern', price: 800, reqLevel: 9, icon: '🏮', description: 'Light up the darkest projects.' },
    { id: 'a3', name: 'Grappling Hook', price: 1000, reqLevel: 10, icon: '🪝', description: 'Scaling the highest mountains.' },
    { id: 'a13', name: 'Mithril Mail', price: 1500, reqLevel: 12, icon: '👕', description: 'Light but indestructible focus.' },
    { id: 'a6', name: 'Excalibur', price: 2500, reqLevel: 15, icon: '⚔️', description: 'Slay dragons with a single strike.' },
    { id: 'a14', name: 'Flying Carpet', price: 3500, reqLevel: 18, icon: '🪁', description: 'Soar above the mundane tasks.' },
    { id: 'a7', name: 'Pegasus Mount', price: 5000, reqLevel: 20, icon: '🦄', description: 'Fly over obstacles effortlessly.' },
    { id: 'a15', name: 'Phoenix Feather', price: 7500, reqLevel: 25, icon: '🪶', description: 'Resurrect your motivation from the ashes.' },
    { id: 'a8', name: 'Holy Grail', price: 10000, reqLevel: 30, icon: '🏆', description: 'Ultimate productivity and eternal life.' }
  ]
};

export default function EquipmentStore() {
  const { profile, gold, level, inventory, buyItem } = useGame();
  const allItems = STORE_ITEMS[profile.archetype] || STORE_ITEMS.Coder;

  // Select 3 items based on daily rotation and user progress
  const displayItems = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    // Filter items: prioritize unowned ones close to user level
    const unowned = allItems.filter(item => !inventory.includes(item.id));
    
    if (unowned.length === 0) return allItems.slice(0, 3); // Fallback if all owned

    // Use date to shuffle or pick a window
    // We'll pick 3 items that rotate based on the day
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Simple rotation: start index moves every day
    const startIndex = dayOfYear % unowned.length;
    let selected = [];
    for (let i = 0; i < 3; i++) {
      selected.push(unowned[(startIndex + i) % unowned.length]);
    }
    
    return selected;
  }, [allItems, inventory]);

  return (
    <div className="glass-panel equipment-store">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="section-title" style={{ marginBottom: 0 }}>
          <ShoppingCart size={24} /> Daily Deals
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
          <RefreshCw size={14} /> Rotates Daily
        </div>
      </div>
      
      <div className="store-grid">
        {displayItems.map(item => {
          const owned = inventory.includes(item.id);
          const canAfford = gold >= item.price;
          const levelMeets = level >= item.reqLevel;
          
          return (
            <div key={item.id} className={`store-item ${owned ? 'owned' : ''} ${(!canAfford || !levelMeets) && !owned ? 'locked' : ''}`}>
              <div className="item-icon" style={{ position: 'relative' }}>
                {item.icon}
                {!levelMeets && !owned && (
                  <div className="level-lock-overlay">
                    <Lock size={16} />
                  </div>
                )}
              </div>
              <div className="item-details">
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                  {item.name}
                  {!levelMeets && !owned && <span className="level-req-badge">Lvl {item.reqLevel}</span>}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.8rem' }}>{item.description}</p>
                <button 
                  className="btn btn-primary buy-btn" 
                  disabled={owned || !canAfford || !levelMeets}
                  onClick={() => buyItem(item)}
                  style={{ width: '100%' }}
                >
                  {owned ? 'Equipped' : !levelMeets ? `Unlocks at Level ${item.reqLevel}` : `Buy for ${item.price} Gold`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

