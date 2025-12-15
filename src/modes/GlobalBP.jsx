import { useState } from 'react';
import { heroes } from '../data/heroes.js';
import TeamPanel from '../components/TeamPanel.jsx';
import HeroFilter from '../components/HeroFilter.jsx';

// 🔥 核心修正：替换为正确的 KPL 全局BP剧本 (4 Ban + 5 Pick)
const GLOBAL_STEPS = [
  // --- 第一轮 Ban (各2) ---
  { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },
  { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },

  // --- 第一轮 Pick (蓝1, 红2, 蓝1) ---
  { phase: 'PICK', side: 'blue' },
  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'blue' },

  // --- 第二轮 Ban (各2) ---
  { phase: 'BAN', side: 'red' },
  { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },
  { phase: 'BAN', side: 'blue' },

  // --- 第二轮 Pick (红1, 蓝1, 红1, 蓝1) ---
  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'blue' },
  { phase: 'PICK', side: 'red' },
  { phase: 'PICK', side: 'blue' },
];

const INITIAL_STATE = { bans: [], picks: [] };

export default function GlobalBP({ onBack, totalRounds }) {
  const [filteredHeroes, setFilteredHeroes] = useState(heroes);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [blueState, setBlueState] = useState(INITIAL_STATE);
  const [redState, setRedState] = useState(INITIAL_STATE);
  const [tempHero, setTempHero] = useState(null);
  
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState({ blue: [], red: [] });

  const currentStep = GLOBAL_STEPS[currentStepIndex]; // 使用正确的剧本
  const isFinished = currentStepIndex >= GLOBAL_STEPS.length;
  const isBanPhase = currentStep?.phase === 'BAN';

  // 全局BP核心逻辑 (保持不变)
  const getHeroStatus = (heroId) => {
    if ([...blueState.bans, ...blueState.picks, ...redState.bans, ...redState.picks].includes(heroId)) return 'USED_CURRENT';
    if (!isFinished && !isBanPhase) {
      if (currentStep.side === 'blue' && history.blue.includes(heroId)) return 'USED_GLOBAL';
      if (currentStep.side === 'red' && history.red.includes(heroId)) return 'USED_GLOBAL';
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
  
  // 下一局逻辑 (保持不变)
  const handleNextGame = () => {
    if (round === totalRounds && totalRounds === 7) {
      alert('即将进入巅峰对决！英雄池已解锁！');
      setHistory({ blue: [], red: [] });
    } else {
      setHistory(prev => ({ blue: [...prev.blue, ...blueState.picks], red: [...prev.red, ...redState.picks] }));
    }
    setCurrentStepIndex(0);
    setBlueState(INITIAL_STATE);
    setRedState(INITIAL_STATE);
    setTempHero(null);
    setRound(r => r + 1);
  };

  const handleHeroClick = (hero) => {
    if (getHeroStatus(hero.id) !== 'AVAILABLE' || isFinished) return;
    setTempHero(hero);
  };
  
  // 重置函数
  const handleReset = () => {
    setCurrentStepIndex(0);
    setBlueState(INITIAL_STATE);
    setRedState(INITIAL_STATE);
    setTempHero(null);
    setRound(1);
    setHistory({ blue: [], red: [] });
  };

  return (
    <div className="w-screen h-screen bg-[#0A101A] text-slate-200 flex flex-col overflow-hidden select-none font-sans">
      {/* 顶部 */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 shrink-0 relative z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-bold text-sm">⬅ 退出</button>
          <button onClick={handleReset} className="px-4 py-2 bg-red-800/50 text-red-300 rounded font-bold text-sm">🔄 重置</button>
          <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700 text-yellow-500 font-bold">BO{totalRounds} - 第 {round} 局</div>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          {isFinished ? (
            <button onClick={handleNextGame} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold shadow-lg animate-pulse">{round === totalRounds ? '结束对局' : `进入第 ${round + 1} 局`}</button>
          ) : (
            <div className={`px-6 py-1 rounded text-2xl font-black skew-x-[-10deg] ${currentStep.side === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`}>{currentStep.side === 'blue' ? '蓝方' : '红方'} {isBanPhase ? '禁用' : '选择'}</div>
          )}
        </div>
        
        <button onClick={() => executeLock(tempHero)} disabled={!tempHero || isFinished} className="px-8 py-2 bg-yellow-500 text-black font-bold rounded disabled:opacity-40">锁定</button>
      </header>

      {/* 主体 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 🔥 传入正确的 Ban 位数量 */}
        <TeamPanel side="blue" state={blueState} heroes={heroes} active={currentStep?.side === 'blue' && !isFinished} banCount={4} />
        
        <div className="flex-1 bg-slate-900 flex flex-col border-x border-slate-800 z-10">
          <HeroFilter onFilterChange={setFilteredHeroes} />
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-10 gap-3 content-start">
              {filteredHeroes.map(hero => {
                const status = getHeroStatus(hero.id);
                const isTemp = tempHero?.id === hero.id;
                const disabled = status !== 'AVAILABLE';
                return (
                  <div key={hero.id} onClick={() => handleHeroClick(hero)} onDoubleClick={() => !disabled && !isFinished && executeLock(hero)} className={`relative aspect-square rounded-lg overflow-hidden border transition-all group ${disabled ? 'border-slate-800' : 'cursor-pointer border-slate-700 hover:border-slate-500'} ${isTemp ? 'ring-2 ring-yellow-400 border-yellow-400' : ''}`}>
                    <img src={`/heroes/${hero.pinyin}.jpg`} className="w-full h-full object-cover" />
                    {disabled && <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${status === 'USED_CURRENT' ? 'bg-black/70 text-red-500' : 'bg-black/60 text-slate-400'}`}>{status === 'USED_CURRENT' ? '本局已用' : '历史已用'}</div>}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-3 pb-1 text-center text-xs font-semibold">{hero.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 🔥 传入正确的 Ban 位数量 */}
        <TeamPanel side="red" state={redState} heroes={heroes} active={currentStep?.side === 'red' && !isFinished} banCount={4} />
      </main>
    </div>
  );
}