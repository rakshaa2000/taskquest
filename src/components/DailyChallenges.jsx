import React from 'react';
import { useGame } from '../context/GameContext';
import { Target, Gift, CheckCircle } from 'lucide-react';
import './DailyChallenges.css';

export default function DailyChallenges() {
  const { dailyChallenges, completeDailyChallenge } = useGame();

  return (
    <div className="glass-panel daily-challenges">
      <h3 className="section-title">
        <Target size={24} /> Daily Challenges
      </h3>
      <div className="challenges-list">
        {dailyChallenges.map(challenge => (
          <div key={challenge.id} className={`challenge-card ${challenge.completed ? 'completed' : ''}`}>
            <div className="challenge-info">
              <h4>{challenge.title}</h4>
              <div className="challenge-rewards">
                <span className="reward xp">+{challenge.rewardXp} XP</span>
                <span className="reward gold">+{challenge.rewardGold} Gold</span>
              </div>
            </div>
            {!challenge.completed ? (
              <button className="btn btn-primary" onClick={() => completeDailyChallenge(challenge.id)}>
                <CheckCircle size={16} /> Claim
              </button>
            ) : (
              <span className="challenge-done"><Gift size={16}/> Completed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
