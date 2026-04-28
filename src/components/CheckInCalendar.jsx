import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CalendarDays, ChevronLeft, ChevronRight, Coins, Zap, Gift } from 'lucide-react';
import './CheckInCalendar.css';

const STREAK_REWARDS = [
  { days: 3, bonus: 50, label: '3-Day: +50 Gold' },
  { days: 7, bonus: 150, label: '7-Day: +150 Gold + 50 XP' },
  { days: 14, bonus: 300, label: '14-Day: +300 Gold + Free Upgrade' },
  { days: 30, bonus: 500, label: '30-Day: +500 Gold + Max HP +20' },
];

function getNextStreakReward(currentStreak) {
  for (const reward of STREAK_REWARDS) {
    if (currentStreak < reward.days) return reward;
  }
  return null;
}

export default function CheckInCalendar() {
  const { checkInData, performCheckIn, streak } = useGame();
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const hasCheckedInToday = checkInData.dates.includes(todayStr);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const nextReward = getNextStreakReward(streak);

  return (
    <div className="glass-panel checkin-calendar">
      <div className="checkin-header">
        <h3 className="section-title"><CalendarDays size={22} /> Daily Check-In</h3>
        <div className="month-nav">
          <button onClick={prevMonth}><ChevronLeft size={16} /></button>
          <span className="month-label">{monthNames[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth}><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Streak Banner */}
      <div className="streak-banner">
        <span className="streak-flame">🔥</span>
        <div className="streak-info">
          <span className="streak-count">{streak}</span>
          <span className="streak-label">Day Streak</span>
        </div>
        {nextReward && (
          <span className="next-reward">
            Next: {nextReward.label}
          </span>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar-day-label">{d}</div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isCheckedIn = checkInData.dates.includes(dateStr);
          const isToday = dateStr === todayStr;
          const isFuture = new Date(viewYear, viewMonth, day) > today;
          const canCheckIn = isToday && !hasCheckedInToday;
          
          return (
            <div
              key={day}
              className={`calendar-day ${isCheckedIn ? 'checked-in' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''} ${canCheckIn ? 'can-checkin' : ''}`}
              onClick={canCheckIn ? performCheckIn : undefined}
              title={isCheckedIn ? 'Checked in!' : isToday && !hasCheckedInToday ? 'Click to check in!' : ''}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Check-In Button */}
      <button
        className="btn btn-primary checkin-btn"
        disabled={hasCheckedInToday}
        onClick={performCheckIn}
      >
        {hasCheckedInToday ? (
          <><Gift size={18} /> Checked In Today ✓</>
        ) : (
          <><Coins size={18} /> Check In (+50 Gold)</>
        )}
      </button>

      {/* Reward Preview */}
      <div className="reward-preview">
        {STREAK_REWARDS.map(r => (
          <span key={r.days} className={`reward-tag ${streak >= r.days ? 'bonus-reward' : 'gold-reward'}`} style={{ opacity: streak >= r.days ? 1 : 0.5 }}>
            {streak >= r.days ? '✓' : '🔒'} {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}
