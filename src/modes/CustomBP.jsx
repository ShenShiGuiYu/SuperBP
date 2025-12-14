import { useState, useMemo } from 'react';
import { heroes } from '../heroes';
import TeamPanel from '../components/TeamPanel.jsx'; // <-- 加上 .jsx

export default function CustomBP({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [blueState, setBlueState] = useState({ bans: [], picks: [] });
  const [redState, setRedState] = useState({ bans: [], picks: [] });
  
  // 简单的切换控制
  const [currentSide, setCurrentSide] = useState('blue'); // 'blue' or 'red'
  const [currentAction, setCurrentAction] = useState('PICK'); // 'PICK' or 'BAN'

  const getAvatar = (hero) => `/heroes/${hero.pinyin}.jpg`;
  
  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero => hero.name.includes(searchTerm) || hero.pinyin.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const handleHeroClick = (hero) => {
    // 简单的添加逻辑：直接往当前选中的状态里塞
    const isBlue = currentSide === 'blue';
    const key = currentAction === 'BAN' ? 'bans' : 'picks';
    const setter = isBlue ? setBlueState : setRedState;
    
    setter(prev => {
      // 如果满了就移除第一个，或者你可以做个弹窗，这里简单处理：只允许加5个
      if (prev[key].length >= 5) return prev;
      return { ...prev, [key]: [...prev[key], hero.id] };
    });
  };

  // 点击面板上的头像移除
  const handleRemove = (side, type, index) => {
    const setter = side === 'blue' ? setBlueState : setRedState;
    setter(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-screen h-screen bg-[#0f172a] text-slate-200 flex flex-col overflow-hidden select-none">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 relative">
        <button onClick={onBack} className="text-slate-400 hover:text-white font-bold">⬅ 退出自定义</button>
        
        {/* 控制台 */}
        <div className="flex gap-4 items-center bg-slate-800 p-1 rounded-lg">
          <div className="flex rounded overflow-hidden">
            <button onClick={() => setCurrentSide('blue')} className={`px-4 py-1 font-bold ${currentSide==='blue' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>蓝方</button>
            <button onClick={() => setCurrentSide('red')} className={`px-4 py-1 font-bold ${currentSide==='red' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400'}`}>红方</button>
          </div>
          <div className="w-px h-6 bg-slate-600"></div>
          <div className="flex rounded overflow-hidden">
            <button onClick={() => setCurrentAction('BAN')} className={`px-4 py-1 font-bold ${currentAction==='BAN' ? 'bg-gray-600 text-white' : 'bg-slate-700 text-slate-400'}`}>禁用 (Ban)</button>
            <button onClick={() => setCurrentAction('PICK')} className={`px-4 py-1 font-bold ${currentAction==='PICK' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-400'}`}>选择 (Pick)</button>
          </div>
        </div>
        <div className="w-20"></div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* 传入 remove 回调需要在 TeamPanel 扩展，这里为了演示简单暂时只展示 */}
        <TeamPanel side="blue" state={blueState} heroes={heroes} active={currentSide === 'blue'} />
        
        <div className="flex-1 bg-slate-900 flex flex-col border-x border-slate-800 z-10">
          <div className="p-4"><input type="text" placeholder="搜索..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full bg-slate-800 text-white rounded px-4 py-2 outline-none"/></div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar grid grid-cols-6 gap-2 content-start">
            {filteredHeroes.map(hero => (
              <div key={hero.id} onClick={() => handleHeroClick(hero)} className="relative aspect-square rounded overflow-hidden border border-slate-700 hover:border-white cursor-pointer hover:scale-105 transition-all">
                <img src={getAvatar(hero)} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 w-full bg-black/60 text-[10px] text-center">{hero.name}</div>
              </div>
            ))}
          </div>
        </div>

        <TeamPanel side="red" state={redState} heroes={heroes} active={currentSide === 'red'} />
      </main>
    </div>
  );
}