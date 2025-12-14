// src/modes/CustomBP.jsx
import { useState, useMemo } from 'react';
import { heroes } from '../heroes';
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
}