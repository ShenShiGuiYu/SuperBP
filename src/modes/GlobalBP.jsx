// src/modes/GlobalBP.jsx
import { useState, useMemo } from 'react';
import { heroes } from '../heroes';
import TeamPanel from '../components/TeamPanel.jsx'; // 🔥 核心修复

// (其余代码保持不变...)
// ...
// ...
// 为了确保万无一失，请用下面的完整代码覆盖
const GLOBAL_STEPS = [
  { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },
  { phase: 'PICK', side: 'blue' }, { phase: 'PICK', side: 'red' },  { phase: 'PICK', side: 'red' }, { phase: 'PICK', side: 'blue' }, { phase: 'PICK', side: 'blue' }, { phase: 'PICK', side: 'red' },  { phase: 'PICK', side: 'red' }, { phase: 'PICK', side: 'blue' }, { phase: 'PICK', side: 'blue' }, { phase: 'PICK', side: 'red' }
];
const INITIAL_STATE = { bans: [], picks: [] };
export default function GlobalBP({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [blueState, setBlueState] = useState(INITIAL_STATE);
  const [redState, setRedState] = useState(INITIAL_STATE);
  const [tempHero, setTempHero] = useState(null);
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState({ blue: [], red: [] });
  const currentStep = GLOBAL_STEPS[currentStepIndex];
  const isFinished = currentStepIndex >= GLOBAL_STEPS.length;
  const isBanPhase = currentStep?.phase === 'BAN';
  const getAvatar = (hero) => `/heroes/${hero.pinyin}.jpg`;
  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero => hero.name.includes(searchTerm) || hero.pinyin.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);
  const getHeroStatus = (heroId) => {
    if ([...blueState.bans, ...blueState.picks, ...redState.bans, ...redState.picks].includes(heroId)) return 'USED_CURRENT';
    if (!isBanPhase && !isFinished) {
      if (currentStep.side === 'blue' && history.blue.includes(heroId)) return 'USED_GLOBAL_BLUE';
      if (currentStep.side === 'red' && history.red.includes(heroId)) return 'USED_GLOBAL_RED';
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
  const handleNextGame = () => {
    setHistory(prev => ({ blue: [...prev.blue, ...blueState.picks], red: [...prev.red, ...redState.picks] }));
    setBlueState(INITIAL_STATE);
    setRedState(INITIAL_STATE);
    setCurrentStepIndex(0);
    setRound(r => r + 1);
  };
  return (
    <div className="w-screen h-screen bg-[#0A101A] text-slate-200 flex flex-col overflow-hidden select-none">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 relative">
        <div className="flex items-center gap-4 z-10">
          <button onClick={onBack} className="text-slate-400 font-bold">⬅ 退出</button>
          <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700 text-yellow-500 font-bold">BO5 - 第 {round} 局</div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">{isFinished ? <button onClick={handleNextGame} className="px-6 py-2 bg-green-600 text-white rounded font-bold">下一局 →</button> : <div className={`px-6 py-1 rounded text-2xl font-black skew-x-[-10deg] ${currentStep.side === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`}>{currentStep.side === 'blue' ? '蓝方' : '红方'} {isBanPhase ? '禁用' : '选择'}</div>}</div>
        <button onClick={() => executeLock(tempHero)} disabled={!tempHero || isFinished} className="px-6 py-2 bg-yellow-500 text-black font-bold rounded z-10 disabled:opacity-50">锁定</button>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <TeamPanel side="blue" state={blueState} heroes={heroes} active={currentStep?.side === 'blue'} />
        <div className="flex-1 bg-slate-900 flex flex-col border-x border-slate-800 z-10">
          <div className="p-4 border-b border-slate-800"><input type="text" placeholder="搜索..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full bg-slate-800 rounded px-4 py-2"/></div>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-6 gap-2 content-start">
            {filteredHeroes.map(hero => {
              const status = getHeroStatus(hero.id);
              const isTemp = tempHero?.id === hero.id;
              let style = `cursor-pointer ${isTemp ? 'ring-2 ring-yellow-400' : ''}`;
              if (status !== 'AVAILABLE') style = 'grayscale opacity-30 cursor-not-allowed';
              return <div key={hero.id} onClick={() => status === 'AVAILABLE' && !isFinished && setTempHero(hero)} onDoubleClick={() => status === 'AVAILABLE' && !isFinished && executeLock(hero)} className={`relative aspect-square rounded overflow-hidden ${style}`}><img src={getAvatar(hero)} className="w-full h-full object-cover" /><div className="absolute bottom-0 w-full bg-black/60 text-[10px] text-center">{hero.name}</div>{status === 'USED_GLOBAL_BLUE' && <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50 text-[10px] text-blue-100">蓝方已用</div>}{status === 'USED_GLOBAL_RED' && <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 text-[10px] text-red-100">红方已用</div>}</div>
            })}
          </div>
        </div>
        <TeamPanel side="red" state={redState} heroes={heroes} active={currentStep?.side === 'red'} />
      </main>
    </div>
  );
}