import React, { createContext, useState, useContext, useEffect } from 'react';
import { STORE_ITEMS } from '../components/EquipmentStore';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading localStorage', e);
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export const GameProvider = ({ children }) => {
  const [level, setLevel] = usePersistedState('tq_level', 5);
  const [xp, setXp] = usePersistedState('tq_xp', 450);
  const [maxXp, setMaxXp] = usePersistedState('tq_maxXp', 1000);
  const [hp, setHp] = usePersistedState('tq_hp', 100);
  const [maxHp, setMaxHp] = usePersistedState('tq_maxHp', 100);
  const [gold, setGold] = usePersistedState('tq_gold', 320);
  const [focusShards, setFocusShards] = usePersistedState('tq_focusShards', 12);
  const [streak, setStreak] = usePersistedState('tq_streak', 5);

  const [stats, setStats] = usePersistedState('tq_stats', {
    questsCompleted: 0,
    bossesDefeated: 0,
    focusSessionsCompleted: 0,
    dailyChallengesCompleted: 0
  });

  const [profile, setProfile] = usePersistedState('tq_profile', {
    name: 'You',
    archetype: 'Coder',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TaskQuestYou&backgroundColor=transparent'
  });

  const [moodTracker, setMoodTracker] = usePersistedState('tq_moodTracker', {
    energyLevel: 'balanced',
    insight: 'You are in a stable state. A good time for steady progress.'
  });

  const [quests, setQuests] = usePersistedState('tq_quests', [
    { id: 1, title: 'Review PRs', difficulty: 'Medium', xp: 50, gold: 20, completed: false, source: 'jira', estimatedTime: '30m' },
    { id: 2, title: 'Write Daily Report', difficulty: 'Easy', xp: 20, gold: 10, completed: false, source: null, estimatedTime: '15m' },
    { id: 3, title: 'Client Meeting', difficulty: 'Hard', xp: 100, gold: 50, completed: false, source: 'calendar', estimatedTime: '1h' },
  ]);

  const [dailyChallenges, setDailyChallenges] = usePersistedState('tq_dailyChallenges', [
    { id: 201, title: 'Complete 3 tasks before noon', rewardXp: 100, rewardGold: 50, completed: false },
    { id: 202, title: 'Focus for 60 minutes without distractions', rewardXp: 80, rewardGold: 30, completed: false }
  ]);

  const [achievements, setAchievements] = usePersistedState('tq_achievements', [
    { id: 'first_blood', title: 'First Blood', description: "Defeat your first boss", unlocked: false, icon: '🗡️', color: 'var(--hp-color)' },
    { id: 'dragon_slayer', title: 'Dragon Slayer', description: "Defeat 5 bosses", unlocked: false, icon: '🐉', color: 'var(--hp-color)' },
    { id: 'boss_slayer', title: 'Boss Slayer', description: "Defeat 15 bosses", unlocked: false, icon: '👑', color: 'var(--hp-color)' },
    { id: 'focus_master', title: 'Focus Master', description: "Complete 10 focus sessions", unlocked: false, icon: '🔥', color: 'var(--gold-color)' },
    { id: 'focused', title: 'Zen State', description: "Complete 25 focus sessions", unlocked: false, icon: '🧘', color: 'var(--gold-color)' },
    { id: 'task_apprentice', title: 'Task Apprentice', description: "Complete 10 quests", unlocked: false, icon: '📜', color: 'var(--accent-purple)' },
    { id: 'task_master', title: 'Task Master', description: "Complete 50 quests", unlocked: false, icon: '🎓', color: 'var(--accent-purple)' },
    { id: 'daily_champ', title: 'Daily Champ', description: "Complete 10 daily challenges", unlocked: false, icon: '🎯', color: 'var(--accent-neon)' },
    { id: 'level_10', title: 'Rising Star', description: "Reach Level 10", unlocked: false, icon: '⭐', color: 'var(--gold-color)' },
    { id: 'veteran', title: 'Veteran', description: "Reach Level 20", unlocked: false, icon: '🎖️', color: 'var(--gold-color)' },
    { id: 'shopaholic', title: 'Shopaholic', description: "Buy 3 items from the store", unlocked: false, icon: '🛍️', color: 'var(--accent-neon)' },
    { id: 'rich', title: 'Treasure Hoarder', description: "Hoard 1000 Gold", unlocked: false, icon: '💰', color: 'var(--gold-color)' },
  ]);

  const [bosses, setBosses] = usePersistedState('tq_bosses', [
    {
      id: Date.now(),
      name: 'The Architectural Refactor',
      maxHp: 500,
      currentHp: 500,
      defeated: false,
      tasks: [
        { id: 101, title: 'Define new data models', damage: 150, completed: false },
        { id: 102, title: 'Migrate legacy user data', damage: 200, completed: false },
        { id: 103, title: 'Update API endpoints', damage: 150, completed: false },
      ]
    }
  ]);

  const [inventory, setInventory] = usePersistedState('tq_inventory', []);

  const [checkInData, setCheckInData] = usePersistedState('tq_checkins', {
    dates: [],
    lastCheckIn: null
  });

  useEffect(() => {
    let unlockedAny = false;
    const newAchievements = achievements.map(ach => {
      if (ach.unlocked) return ach;
      
      let shouldUnlock = false;
      switch (ach.id) {
        case 'first_blood': shouldUnlock = stats.bossesDefeated >= 1; break;
        case 'dragon_slayer': shouldUnlock = stats.bossesDefeated >= 5; break;
        case 'boss_slayer': shouldUnlock = stats.bossesDefeated >= 15; break;
        case 'focus_master': shouldUnlock = stats.focusSessionsCompleted >= 10; break;
        case 'focused': shouldUnlock = stats.focusSessionsCompleted >= 25; break;
        case 'task_apprentice': shouldUnlock = stats.questsCompleted >= 10; break;
        case 'task_master': shouldUnlock = stats.questsCompleted >= 50; break;
        case 'daily_champ': shouldUnlock = stats.dailyChallengesCompleted >= 10; break;
        case 'level_10': shouldUnlock = level >= 10; break;
        case 'veteran': shouldUnlock = level >= 20; break;
        case 'shopaholic': shouldUnlock = inventory.length >= 3; break;
        case 'rich': shouldUnlock = gold >= 1000; break;
        default: break;
      }
      
      if (shouldUnlock) {
        unlockedAny = true;
        return { ...ach, unlocked: true };
      }
      return ach;
    });

    if (unlockedAny) {
      setAchievements(newAchievements);
    }
  }, [stats, level, inventory, gold]); 

  const updateProfile = (updates) => setProfile(prev => ({ ...prev, ...updates }));

  const logMood = (energyLevel) => {
    let insight = "Keep going!";
    switch(energyLevel) {
      case 'hyper': insight = "Hyper-focus engaged! Slay those Hard bosses now."; break;
      case 'high': insight = "Energy is high! Perfect time for challenging quests."; break;
      case 'balanced': insight = "Balanced state. Great for consistent, quality work."; break;
      case 'low': insight = "Energy is dipping. Focus on Easy tasks or quick wins."; break;
      case 'burned': insight = "Burnout alert! Stop everything and take a real break."; break;
    }
    setMoodTracker({ energyLevel, insight });
  };

  const addQuest = (title, difficulty, estimatedTime) => {
    let xpReward = 20;
    let goldReward = 10;
    if (difficulty === 'Medium') { xpReward = 50; goldReward = 20; }
    if (difficulty === 'Hard') { xpReward = 100; goldReward = 50; }

    const newQuest = {
      id: Date.now(),
      title,
      difficulty,
      xp: xpReward,
      gold: goldReward,
      completed: false,
      source: null,
      estimatedTime
    };
    setQuests(prev => [...prev, newQuest]);
  };

  const addBoss = (name, maxHp, tasks) => {
    const newBoss = {
      id: Date.now(),
      name,
      maxHp,
      currentHp: maxHp,
      defeated: false,
      tasks: tasks.map((t, idx) => ({ 
        id: Date.now() + idx + 1, 
        title: t.title, 
        damage: t.damage, 
        completed: false 
      }))
    };
    setBosses(prev => [...prev, newBoss]);
  };

  const completeQuest = (id) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) {
        gainRewards(q.xp, q.gold);
        setStats(s => ({ ...s, questsCompleted: s.questsCompleted + 1 }));
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  const completeDailyChallenge = (id) => {
    setDailyChallenges(prev => prev.map(c => {
      if (c.id === id && !c.completed) {
        gainRewards(c.rewardXp, c.rewardGold);
        setStats(s => ({ ...s, dailyChallengesCompleted: s.dailyChallengesCompleted + 1 }));
        return { ...c, completed: true };
      }
      return c;
    }));
  };

  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const completeBossTask = (bossId, taskId) => {
    setBosses(prev => prev.map(b => {
      if (b.id !== bossId || b.defeated) return b;

      const updatedTasks = b.tasks.map(t => {
        if (t.id === taskId && !t.completed) {
          return { ...t, completed: true };
        }
        return t;
      });
      
      const task = b.tasks.find(t => t.id === taskId);
      if (task && !task.completed) {
        const newHp = Math.max(0, b.currentHp - task.damage);
        const isDefeated = newHp === 0;

        if (isDefeated) {
          gainRewards(500, 200); // Boss defeat base bonus
          
          // Generate extra loot
          const roll = Math.floor(Math.random() * 3);
          setTimeout(() => {
            if (roll === 0) {
              const items = STORE_ITEMS[profile.archetype] || STORE_ITEMS.Coder;
              const unowned = items.filter(i => !inventory.includes(i.id));
              if (unowned.length > 0) {
                const randomItem = unowned[Math.floor(Math.random() * unowned.length)];
                setInventory(inv => [...inv, randomItem.id]);
                showToast(`Epic Boss Loot! You found an item: ${randomItem.name} ${randomItem.icon}!`);
              } else {
                setMaxHp(h => h + 10);
                setHp(h => h + 10);
                showToast(`Epic Boss Loot! You feel much hardier. Max HP +10!`);
              }
            } else if (roll === 1) {
              setMaxHp(h => h + 5);
              setHp(h => h + 5);
              showToast(`Epic Boss Loot! Your resolve strengthens. Max HP +5!`);
            } else {
              setGold(g => g + 300);
              showToast(`Epic Boss Loot! You found a hoard of 300 Gold!`);
            }
          }, 500);

          setStats(s => ({ ...s, bossesDefeated: s.bossesDefeated + 1 }));
        }
        return { ...b, tasks: updatedTasks, currentHp: newHp, defeated: isDefeated };
      }
      return b;
    }));
  };

  const editQuest = (id, updates) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id) {
        let xpReward = 20;
        let goldReward = 10;
        const diff = updates.difficulty || q.difficulty;
        if (diff === 'Medium') { xpReward = 50; goldReward = 20; }
        if (diff === 'Hard') { xpReward = 100; goldReward = 50; }
        return { ...q, ...updates, xp: xpReward, gold: goldReward };
      }
      return q;
    }));
  };

  const gainRewards = (gainedXp, gainedGold) => {
    setGold(prev => prev + gainedGold);
    setXp(prev => prev + gainedXp);
  };

  useEffect(() => {
    if (xp >= maxXp) {
      setLevel(l => l + 1);
      setXp(x => x - maxXp);
      setMaxXp(m => Math.floor(m * 1.5));
      setHp(maxHp); // Heal on level up
    }
  }, [xp, maxXp, maxHp]);

  const takeDamage = (amount) => {
    setHp(prev => Math.max(0, prev - amount));
  };

  const addFocusShard = () => {
    setFocusShards(prev => prev + 1);
    gainRewards(10, 5); // Mini reward for focus
    setStats(s => ({ ...s, focusSessionsCompleted: s.focusSessionsCompleted + 1 }));
  };

  const buyItem = (item) => {
    if (gold >= item.price && !inventory.includes(item.id)) {
      setGold(prev => prev - item.price);
      setInventory(prev => [...prev, item.id]);
      
      // Bonus logic for buying
      if (item.id === 'c3' || item.id === 's3' || item.id === 'a3') {
        setMaxHp(prev => prev + 10);
        setHp(prev => prev + 10);
      }
    }
  };

  const performCheckIn = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    if (checkInData.dates.includes(todayStr)) return;

    // Calculate streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    
    const isConsecutive = checkInData.lastCheckIn === yesterdayStr;
    const newStreak = isConsecutive ? streak + 1 : 1;
    setStreak(newStreak);

    // Base reward: 50 gold
    let bonusGold = 50;
    let bonusXp = 0;
    let toastMessages = [`Daily check-in! +50 Gold 🪙`];

    // Streak milestone rewards
    if (newStreak === 3) {
      bonusGold += 50;
      toastMessages.push(`🔥 3-Day Streak! Bonus +50 Gold!`);
    }
    if (newStreak === 7) {
      bonusGold += 150;
      bonusXp += 50;
      toastMessages.push(`🔥 7-Day Streak! +150 Gold & +50 XP!`);
    }
    if (newStreak === 14) {
      bonusGold += 300;
      // Grant a random free upgrade
      const items = STORE_ITEMS[profile.archetype] || STORE_ITEMS.Coder;
      const unowned = items.filter(i => !inventory.includes(i.id));
      if (unowned.length > 0) {
        const freeItem = unowned[Math.floor(Math.random() * unowned.length)];
        setInventory(inv => [...inv, freeItem.id]);
        toastMessages.push(`🎁 14-Day Streak! +300 Gold & Free ${freeItem.name} ${freeItem.icon}!`);
      } else {
        bonusGold += 200;
        toastMessages.push(`🎁 14-Day Streak! +500 Gold total (all items owned)!`);
      }
    }
    if (newStreak === 30) {
      bonusGold += 500;
      setMaxHp(h => h + 20);
      setHp(h => h + 20);
      toastMessages.push(`👑 30-Day Streak! +500 Gold & Max HP +20!`);
    }

    gainRewards(bonusXp, bonusGold);
    showToast(toastMessages[toastMessages.length - 1]);

    setCheckInData(prev => ({
      dates: [...prev.dates, todayStr],
      lastCheckIn: todayStr
    }));
  };

  return (
    <GameContext.Provider value={{
      level, xp, maxXp, hp, maxHp, gold, focusShards, streak,
      quests, bosses, profile, moodTracker, dailyChallenges, achievements, stats, inventory, toastMsg, checkInData,
      completeQuest, completeBossTask, takeDamage, addFocusShard,
      addQuest, editQuest, addBoss, updateProfile, logMood, completeDailyChallenge, buyItem, performCheckIn
    }}>
      {children}
    </GameContext.Provider>
  );
};


