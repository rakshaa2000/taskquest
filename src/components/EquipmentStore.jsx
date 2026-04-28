import React from 'react';
import { useGame } from '../context/GameContext';
import { ShoppingCart, Lock } from 'lucide-react';
import './EquipmentStore.css';

export const STORE_ITEMS = {
  Coder: [
    { id: 'c1', name: 'Mechanical Keyboard', price: 100, reqLevel: 1, icon: '⌨️', description: 'Click-clack! Motivation boost.' },
    { id: 'c4', name: 'Coffee Maker', price: 200, reqLevel: 3, icon: '☕', description: 'Keeps the energy flowing.' },
    { id: 'c2', name: 'Noise Cancelling Headphones', price: 350, reqLevel: 5, icon: '🎧', description: 'Blocks distractions entirely.' },
    { id: 'c5', name: 'Standing Desk', price: 600, reqLevel: 7, icon: '🪑', description: 'Better posture, better code.' },
    { id: 'c3', name: 'Dual Monitors', price: 1000, reqLevel: 10, icon: '🖥️', description: 'Double the workspace, double the fun.' },
    { id: 'c6', name: 'AI Assistant', price: 2500, reqLevel: 15, icon: '🤖', description: 'Automates the boring stuff.' }
  ],
  Scientist: [
    { id: 's1', name: 'Erlenmeyer Flask', price: 100, reqLevel: 1, icon: '🧪', description: 'Mix solutions perfectly.' },
    { id: 's4', name: 'Safety Goggles', price: 200, reqLevel: 3, icon: '🥽', description: 'Safety first in the lab!' },
    { id: 's2', name: 'High-Tech Microscope', price: 350, reqLevel: 5, icon: '🔬', description: 'See fine details in your bugs.' },
    { id: 's5', name: 'Centrifuge', price: 600, reqLevel: 7, icon: '🌀', description: 'Separate the signal from noise.' },
    { id: 's3', name: 'Lead-lined Lab Coat', price: 1000, reqLevel: 10, icon: '🥼', description: 'Protects against toxic radiation.' },
    { id: 's6', name: 'Quantum Computer', price: 2500, reqLevel: 15, icon: '⚛️', description: 'Solve problems in parallel universes.' }
  ],
  Adventurer: [
    { id: 'a1', name: 'Sturdy Boots', price: 100, reqLevel: 1, icon: '👢', description: 'Made for walking the extra mile.' },
    { id: 'a4', name: 'Travel Rations', price: 200, reqLevel: 3, icon: '🥪', description: 'Keeps you going on long treks.' },
    { id: 'a2', name: 'Golden Compass', price: 350, reqLevel: 5, icon: '🧭', description: 'Never lose your way.' },
    { id: 'a5', name: 'Enchanted Map', price: 600, reqLevel: 7, icon: '🗺️', description: 'Reveals hidden shortcuts.' },
    { id: 'a3', name: 'Grappling Hook', price: 1000, reqLevel: 10, icon: '🪝', description: 'Scaling the highest mountains.' },
    { id: 'a6', name: 'Excalibur', price: 2500, reqLevel: 15, icon: '⚔️', description: 'Slay dragons with a single strike.' }
  ]
};

export default function EquipmentStore() {
  const { profile, gold, level, inventory, buyItem } = useGame();
  const items = STORE_ITEMS[profile.archetype] || STORE_ITEMS.Coder;

  return (
    <div className="glass-panel equipment-store">
      <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>
        <ShoppingCart size={24} /> Upgrades Store
      </h3>
      <div className="store-grid">
        {items.map(item => {
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
