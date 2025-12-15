// src/modes/CustomBP.jsx
import { useState, useMemo } from 'react';
import { heroes } from '../data/heroes.js';
import TeamPanel from '../components/TeamPanel.jsx'; // 🔥 核心修复

// (其余代码保持不变...)
// ...
// ...
// 完整代码
export default function CustomBP({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [blueState, setBlueState] = useState({ bans: [], picks: [] });
  const [redState, setRedState] = useState({ bans: [], picks: [] });
  const [currentSide, setCurrentSide] = useState('blue');
  const [currentAction, setCurrentAction] = useState('PICK');
  const getAvatar = (hero) => `/heroes/${hero.pinyin}.jpg`;
  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero => hero.name.includes(searchTerm) || hero.pinyin.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);
  const handleHeroClick = (hero) => {
    const isBlue = currentSide === 'blue';
    const key = currentAction === 'BAN' ? 'bans' : 'picks';
    const setter = isBlue ? setBlueState : setRedState;
    setter(prev => {
      if (prev[key].length >= 5) return prev;
      return { ...prev, [key]: [...prev[key], hero.id] };
    });
  };
  return (
    <div className="w-screen h-screen bg-[#0f172a] text-slate-200 flex flex-col overflow-hidden select-none">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <button onClick={onBack} className="text-slate-400 font-bold">⬅ 退出自定义</button>
        <div className="flex gap-4 items-center bg-slate-800 p-1 rounded-lg">
          <div className="flex rounded overflow-hidden"><button onClick={() => setCurrentSide('blue')} className={`px-4 py-1 font-bold ${currentSide==='blue' ? 'bg-blue-600' : 'bg-slate-700'}`}>蓝方</button><button onClick={() => setCurrentSide('red')} className={`px-4 py-1 font-bold ${currentSide==='red' ? 'bg-red-600' : 'bg-slate-700'}`}>红方</button></div>
          <div className="w-px h-6 bg-slate-600"></div>
          <div className="flex rounded overflow-hidden"><button onClick={() => setCurrentAction('BAN')} className={`px-4 py-1 font-bold ${currentAction==='BAN' ? 'bg-gray-600' : 'bg-slate-700'}`}>禁用</button><button onClick={() => setCurrentAction('PICK')} className={`px-4 py-1 font-bold ${currentAction==='PICK' ? 'bg-yellow-600' : 'bg-slate-700'}`}>选择</button></div>
        </div>
        <div className="w-20"></div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <TeamPanel side="blue" state={blueState} heroes={heroes} active={currentSide === 'blue'} />
        <div className="flex-1 bg-slate-900 flex flex-col border-x border-slate-800 z-10">
          <div className="p-4"><input type="text" placeholder="搜索..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full bg-slate-800 rounded px-4 py-2"/></div>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-6 gap-2 content-start">
            {filteredHeroes.map(hero => <div key={hero.id} onClick={() => handleHeroClick(hero)} className="relative aspect-square rounded overflow-hidden border border-slate-700 hover:border-white cursor-pointer"><img src={getAvatar(hero)} className="w-full h-full object-cover" /><div className="absolute bottom-0 w-full bg-black/60 text-[10px] text-center">{hero.name}</div></div>)}
          </div>
        </div>
        <TeamPanel side="red" state={redState} heroes={heroes} active={currentSide === 'red'} />
      </main>
    </div>
  );
}import { useState } from 'react';
import { heroes } from '../data/heroes.js';
import TeamPanel from '../components/TeamPanel.jsx';
import HeroFilter from '../components/HeroFilter.jsx';

const INITIAL_STATE = { bans: [], picks: [] };

export default function CustomBP({ onBack }) {
  const [filteredHeroes, setFilteredHeroes] = useState(heroes);
  const [blueState, setBlueState] = useState(INITIAL_STATE);
  const [redState, setRedState] = useState(INITIAL_STATE);
  
  // 自定义模式的状态
  const [currentSide, setCurrentSide] = useState('blue'); 
  const [currentAction, setCurrentAction] = useState('PICK');

  const handleHeroClick = (hero) => {
    const isBlue = currentSide === 'blue';
    const key = currentAction === 'BAN' ? 'bans' : 'picks';
    const setter = isBlue ? setBlueState : setRedState;
    
    // 防止重复添加
    const isAlreadyIn = (isBlue ? blueState : redState)[key].includes(hero.id);
    if (isAlreadyIn) return;

    setter(prev => {
      if (prev[key].length >= 5) return prev;
      return { ...prev, [key]: [...prev[key], hero.id] };
    });
  };

  const handleReset = () => {
    setBlueState(INITIAL_STATE);
    setRedState(INITIAL_STATE);
  };

  return (
    <div className="w-screen h-screen bg-[#0A101A] text-slate-200 flex flex-col overflow-hidden select-none">
      <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 shrink-0 relative z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-bold text-sm">⬅ 退出</button>
          <button onClick={handleReset} className="px-4 py-2 bg-red-800/50 text-red-300 rounded font-bold text-sm">🔄 重置</button>
        </div>
        
        {/* 控制台 */}
        <div className="flex gap-4 items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700">
          <div className="flex rounded overflow-hidden">
            <button onClick={() => setCurrentSide('blue')} className={`px-4 py-1.5 font-bold text-sm ${currentSide==='blue' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>蓝方</button>
            <button onClick={() => setCurrentSide('red')} className={`px-4 py-1.5 font-bold text-sm ${currentSide==='red' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400'}`}>红方</button>
          </div>
          <div className="w-px h-6 bg-slate-600"></div>
          <div className="flex rounded overflow-hidden">
            <button onClick={() => setCurrentAction('BAN')} className={`px-4 py-1.5 font-bold text-sm ${currentAction==='BAN' ? 'bg-gray-600 text-white' : 'bg-slate-700 text-slate-400'}`}>禁用</button>
            <button onClick={() => setCurrentAction('PICK')} className={`px-4 py-1.5 font-bold text-sm ${currentAction==='PICK' ? 'bg-yellow-600 text-black' : 'bg-slate-700 text-slate-400'}`}>选择</button>
          </div>
        </div>
        <div className="w-40"></div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* 🔥 终极修正：传入 isBanPhase */}
        <TeamPanel 
          side="blue" 
          state={blueState} 
          heroes={heroes} 
          active={currentSide === 'blue'}
          isBanPhase={currentAction === 'BAN'}
          banCount={5}
        />
        
        <div className="flex-1 bg-slate-900 flex flex-col border-x border-slate-800 z-10">
          <HeroFilter onFilterChange={setFilteredHeroes} />
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-10 gap-3">
              {filteredHeroes.map(hero => (
                <div key={hero.id} onClick={() => handleHeroClick(hero)} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 hover:border-white cursor-pointer hover:scale-105 transition-all">
                  <img src={`/heroes/${hero.pinyin}.jpg`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 w-full bg-black/60 text-[10px] text-center">{hero.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <TeamPanel 
          side="red" 
          state={redState} 
          heroes={heroes} 
          active={currentSide === 'red'}
          isBanPhase={currentAction === 'BAN'}
          banCount={5}
        />
      </main>
    </div>
  );
}```

#### 2. 检查 `PeakBP.jsx` (确保它也没问题)

打开 `src/modes/PeakBP.jsx`，找到调用 `TeamPanel` 的地方，**确保**它也长这样：

```jsx
<TeamPanel 
  side="blue" 
  state={blueState} 
  heroes={heroes} 
  active={currentStep?.side === 'blue' && !isFinished} 
  isBanPhase={isBanPhase} // <--- 必须有这一行
  banCount={5} 
/>