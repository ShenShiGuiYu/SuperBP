/**
 * @file GlobalBP.jsx
 * @description 全局BP模式 (KPL终极版 - 5 Ban / 5 Pick)
 */

import { useState } from 'react';
import { heroes } from '../data/heroes.js';
import TeamPanel from '../components/TeamPanel.jsx';
import HeroFilter from '../components/HeroFilter.jsx';

// 🔥 核心修正：升级为 KPL 5 Ban / 5 Pick 标准剧本
const KPL_STEPS_5BAN = [
  // --- 第一轮 Ban (蓝1, 红1, 蓝1, 红1) ---
  { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },
  { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },
  // --- 第一轮 Pick (蓝1, 红2, 蓝1) ---
  { phase: 'PICK', side: 'blue' },
  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'blue' },
  // --- 第二轮 Ban (蓝1, 红1, 蓝1, 红1) ---
  { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },
  { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },
  // --- 第二轮 Pick (红1, 蓝1, 红1, 蓝1, 蓝1) ---
  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'blue' },
  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'blue' },
  { phase: 'PICK', side: 'blue' },
  { phase: 'PICK', side: 'red' },
];

const INITIAL_STATE = { bans: [], picks: [] };

export default function GlobalBP({ onBack, totalRounds }) {
  const [filteredHeroes, setFilteredHeroes] = useState(heroes);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [blueState, setBlueState] = useState(INITIAL_STATE);
  const [redState, setRedState] = useState(INITIAL_STATE);
  const [tempHero, setTempHero] = useState(null);
  
  const [round, setRound] = useState(1);
  const [pickHistory, setPickHistory] = useState({ blue: [], red: [] });
  const [globalUsedHistory, setGlobalUsedHistory] = useState([]);

  const currentStep = KPL_STEPS_5BAN[currentStepIndex]; // 使用 5 Ban 剧本
  const isFinished = currentStepIndex >= KPL_STEPS_5BAN.length;
  const isBanPhase = currentStep?.phase === 'BAN';

  // 核心规则判断 (保持不变)
  const getHeroStatus = (heroId) => {
    if ([...blueState.bans, ...blueState.picks, ...redState.bans, ...redState.picks].includes(heroId)) return 'USED_CURRENT';
    if (isBanPhase) {
      if (globalUsedHistory.includes(heroId)) return 'USED_GLOBAL';
    }
    if (!isBanPhase && !isFinished) {
      if (currentStep.side === 'blue' && pickHistory.blue.includes(heroId)) return 'USED_BY_ME';
      if (currentStep.side === 'red' && pickHistory.red.includes(heroId)) return 'USED_BY_ME';
    }
    return 'AVAILABLE';
  };

  const executeLock = (hero) => {
    if (!hero || isFinished) return;
    const isBlue = currentStep.side === 'blue';
    (isBlue ? setBlueState : setRedState)(prev => ({...prev, [isBanPhase ? 'bans' : 'picks']: [...prev[isBanPhase ? 'bans' : 'picks'], hero.id]}));
    setTempHero(null);
    setCurrentStepIndex(p => p + 1);
  };
  
  const handleNextGame = () => { /* ... 保持不变 ... */ };
  const handleReset = () => { /* ... 保持不变 ... */ };
  const handleHeroClick = (hero) => { /* ... 保持不变 ... */ };

  return (
    <div className="w-screen h-screen bg-[#0A101A] text-slate-200 flex flex-col overflow-hidden select-none font-sans">
      <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 shrink-0 relative z-20">
        {/* ... 顶部UI保持不变 ... */}
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* 🔥 核心修正：传入 banCount={5} */}
        <TeamPanel side="blue" state={blueState} heroes={heroes} active={currentStep?.side === 'blue' && !isFinished} isBanPhase={isBanPhase} banCount={5} />
        
        <div className="flex-1 bg-slate-900 flex flex-col border-x border-slate-800 z-10">
          <HeroFilter onFilterChange={setFilteredHeroes} />
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-10 gap-3 content-start">
              {/* ... 英雄列表UI保持不变 ... */}
            </div>
          </div>
        </div>

        {/* 🔥 核心修正：传入 banCount={5} */}
        <TeamPanel side="red" state={redState} heroes={heroes} active={currentStep?.side === 'red' && !isFinished} isBanPhase={isBanPhase} banCount={5} />
      </main>
    </div>
  );
}