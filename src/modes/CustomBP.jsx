/**
 * @file CustomBP.jsx
 * @description 自定义模式 (战术沙盘终极版)
 */

import { useState } from 'react';
import { heroes } from '../data/heroes.js';
import TeamPanel from '../components/TeamPanel.jsx';
import HeroFilter from '../components/HeroFilter.jsx';

const INITIAL_STATE = { bans: [], picks: [] };

export default function CustomBP({ onBack }) {
  const [filteredHeroes, setFilteredHeroes] = useState(heroes);
  const [blueState, setBlueState] = useState(INITIAL_STATE);
  const [redState, setRedState] = useState(INITIAL_STATE);
  
  // 🔥 核心：自由控制台的状态
  const [currentSide, setCurrentSide] = useState('blue'); // 'blue' or 'red'
  const [currentAction, setCurrentAction] = useState('PICK'); // 'PICK' or 'BAN'

  // 判断英雄是否已被任何一方使用
  const isUsed = (heroId) => {
    return [...blueState.bans, ...blueState.picks, ...redState.bans, ...redState.picks].includes(heroId);
  };
  
  // 点击英雄池：添加英雄
  const handleHeroClick = (hero) => {
    if (isUsed(hero.id)) return; // 已用英雄不可重复添加

    const isBlue = currentSide === 'blue';
    const key = currentAction === 'BAN' ? 'bans' : 'picks';
    const limit = currentAction === 'BAN' ? 5 : 5; // Ban和Pick最多5个
    
    const setter = isBlue ? setBlueState : setRedState;
    setter(prev => {
      if (prev[key].length >= limit) return prev; // 如果满了就不加
      return { ...prev, [key]: [...prev[key], hero.id] };
    });
  };
  
  // 🔥 新增：点击侧边栏英雄，将其移除
  const handleRemoveHero = (side, type, heroIdToRemove) => {
    const setter = side === 'blue' ? setBlueState : setRedState;
    setter(prev => ({
      ...prev,
      [type]: prev[type].filter(id => id !== heroIdToRemove)
    }));
  };
  
  // 重置
  const handleReset = () => {
    setBlueState(INITIAL_STATE);
    setRedState(INITIAL_STATE);
    setCurrentSide('blue');
    setCurrentAction('PICK');
  };

  return (
    <div className="w-screen h-screen bg-[#0A101A] text-slate-200 flex flex-col overflow-hidden select-none font-sans">
      <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 shrink-0 relative z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-bold text-sm">⬅ 退出</button>
          <button onClick={handleReset} className="px-4 py-2 bg-red-800/50 text-red-300 rounded font-bold text-sm">🔄 重置</button>
        </div>
        
        {/* 🔥 核心：自由控制台 */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-6 items-center">
          {/* 队伍选择 */}
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            <button onClick={() => setCurrentSide('blue')} className={`px-6 py-2 font-bold text-sm transition-colors ${currentSide === 'blue' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>蓝方 BLUE</button>
            <button onClick={() => setCurrentSide('red')} className={`px-6 py-2 font-bold text-sm transition-colors ${currentSide === 'red' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>红方 RED</button>
          </div>
          {/* 操作选择 */}
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            <button onClick={() => setCurrentAction('BAN')} className={`px-6 py-2 font-bold text-sm transition-colors ${currentAction === 'BAN' ? 'bg-gray-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>禁用 (Ban)</button>
            <button onClick={() => setCurrentAction('PICK')} className={`px-6 py-2 font-bold text-sm transition-colors ${currentAction === 'PICK' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>选择 (Pick)</button>
          </div>
        </div>
        
        <div className="w-40"></div> {/* 占位，保持布局平衡 */}
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* 传入 onRemove 回调 */}
        <TeamPanel side="blue" state={blueState} heroes={heroes} active={currentSide === 'blue'} onRemove={handleRemoveHero} isCustomMode={true} />
        
        <div className="flex-1 bg-slate-900 flex flex-col border-x border-slate-800 z-10">
          <HeroFilter onFilterChange={setFilteredHeroes} />
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-10 gap-3 content-start">
              {filteredHeroes.map(hero => {
                const disabled = isUsed(hero.id);
                return (
                  <div key={hero.id} 
                    onClick={() => handleHeroClick(hero)}
                    className={`relative aspect-square rounded-lg overflow-hidden border transition-all group ${disabled ? 'border-transparent' : 'cursor-pointer border-slate-700 hover:border-slate-500'}`}
                  >
                    <img src={`/heroes/${hero.pinyin}.jpg`} className="w-full h-full object-cover" />
                    {disabled && <div className="absolute inset-0 bg-black/70 backdrop-grayscale-[0.5] backdrop-brightness-50"></div>}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-3 pb-1 text-center text-xs font-semibold">{hero.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <TeamPanel side="red" state={redState} heroes={heroes} active={currentSide === 'red'} onRemove={handleRemoveHero} isCustomMode={true} />
      </main>
    </div>
  );
}