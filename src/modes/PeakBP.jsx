/**
 * @file PeakBP.jsx
 * @description 巅峰赛模式 (终极、完整、修正版)
 */

import { useState, useMemo } from 'react';
import { heroes } from '../data/heroes.js';
import TeamPanel from '../components/TeamPanel.jsx';
import HeroFilter from '../components/HeroFilter.jsx';

const PEAK_STEPS = [
  { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },
  { phase: 'PICK', side: 'blue' },
  { phase: 'PICK', side: 'red' },  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'blue' }, { phase: 'PICK', side: 'blue' },
  { phase: 'PICK', side: 'red' },  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'blue' }, { phase: 'PICK', side: 'blue' },
  { phase: 'PICK', side: 'red' },
];

const INITIAL_STATE = { bans: [], picks: [] };

export default function PeakBP({ onBack }) {
  const [filteredHeroes, setFilteredHeroes] = useState(heroes);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [blueState, setBlueState] = useState(INITIAL_STATE);
  const [redState, setRedState] = useState(INITIAL_STATE);
  const [tempHero, setTempHero] = useState(null);

  const currentStep = PEAK_STEPS[currentStepIndex];
  const isFinished = currentStepIndex >= PEAK_STEPS.length;
  const isBanPhase = currentStep?.phase === 'BAN';

  const isUnavailable = (heroId) => {
    if (isBanPhase) return currentStep.side === 'blue' ? blueState.bans.includes(heroId) : redState.bans.includes(heroId);
    return [...blueState.bans, ...blueState.picks, ...redState.bans, ...redState.picks].includes(heroId);
  };

  const executeLock = (hero) => {
    if (!hero || isFinished) return;
    const isBlue = currentStep.side === 'blue';
    const key = isBanPhase ? 'bans' : 'picks';
    (isBlue ? setBlueState : setRedState)(prev => ({ ...prev, [key]: [...prev[key], hero.id] }));
    setTempHero(null);
    setCurrentStepIndex(p => p + 1);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setBlueState(INITIAL_STATE);
    setRedState(INITIAL_STATE);
    setTempHero(null);
    setFilteredHeroes(heroes); // 确保重置时列表也刷新
  };
  
  const handleHeroClick = (hero) => {
    if (isUnavailable(hero.id) || isFinished) return;
    setTempHero(hero);
  };

  return (
    <div className="w-screen h-screen bg-[#0A101A] text-slate-200 flex flex-col overflow-hidden select-none font-sans">
      
      {/* === 顶部控制栏 (已恢复) === */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 relative z-20">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onBack} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold text-xs sm:text-sm transition-colors">⬅ 退出</button>
          <button onClick={handleReset} className="px-3 py-2 bg-red-800/50 hover:bg-red-700/50 text-red-300 rounded font-bold text-xs sm:text-sm transition-colors">🔄 重置</button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          {isFinished ? <span className="text-2xl sm:text-3xl font-black text-green-400">BP 结束</span> : (
            <div className="flex flex-col items-center">
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest">PEAK TOURNAMENT</span>
              <div className={`px-4 sm:px-6 py-1 rounded text-lg sm:text-2xl font-black skew-x-[-10deg] shadow-lg ${currentStep.side === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`}>
                <span className="inline-block skew-x-12">{currentStep.side === 'blue' ? '蓝方' : '红方'} {isBanPhase ? '禁用' : '选择'}</span>
              </div>
            </div>
          )}
        </div>
        <button onClick={() => executeLock(tempHero)} disabled={!tempHero || isFinished} className="px-6 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 disabled:opacity-40 disabled:shadow-none transition-all">锁定</button>
      </header>

      {/* === 主体内容 (已恢复) === */}
      <main className="flex-1 flex overflow-hidden">
        <TeamPanel side="blue" state={blueState} heroes={heroes} active={currentStep?.side === 'blue' && !isFinished} isBanPhase={isBanPhase} banCount={5} />
        
        <div className="flex-1 bg-slate-900 flex flex-col border-x border-slate-800 z-10">
          <HeroFilter onFilterChange={setFilteredHeroes} />
          
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-10 gap-2 sm:gap-3 content-start">
              {filteredHeroes.map(hero => {
                const disabled = isUnavailable(hero.id);
                const isTemp = tempHero?.id === hero.id;
                return (
                  <div key={hero.id} 
                    onClick={() => handleHeroClick(hero)}
                    onDoubleClick={() => !disabled && !isFinished && executeLock(hero)}
                    className={`relative aspect-square rounded-md sm:rounded-lg overflow-hidden border transition-all duration-200 group ${disabled ? 'border-transparent' : 'cursor-pointer border-slate-700 hover:border-slate-500 hover:scale-105'} ${isTemp ? 'ring-2 ring-yellow-400 border-yellow-400 scale-110 z-10' : ''}`}
                  >
                    <img src={`/heroes/${hero.pinyin}.jpg`} className="w-full h-full object-cover" loading="lazy"/>
                    {disabled && <div className="absolute inset-0 bg-black/70 backdrop-grayscale-[0.5] backdrop-brightness-50"></div>}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-3 pb-1 text-center"><span className="text-[10px] sm:text-xs text-slate-200 font-semibold">{hero.name}</span></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <TeamPanel side="red" state={redState} heroes={heroes} active={currentStep?.side === 'red' && !isFinished} isBanPhase={isBanPhase} banCount={5} />
      </main>
    </div>
  );
}