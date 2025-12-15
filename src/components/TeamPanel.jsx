// src/components/TeamPanel.jsx

import React from 'react';

export default function TeamPanel({ side, state, heroes, active }) {
  const isBlue = side === 'blue';
  
  const getAvatar = (hero) => `/heroes/${hero.pinyin}.jpg`;

  const displayBans = [...state.bans, ...Array(5 - state.bans.length).fill(null)].slice(0, 5);
  const displayPicks = [...state.picks, ...Array(5 - state.picks.length).fill(null)].slice(0, 5);

  return (
    <div className={`
      w-24 md:w-36 flex flex-col transition-all duration-500 shrink-0 relative
      ${isBlue ? 'bg-gradient-to-r from-blue-950/30 to-transparent' : 'bg-gradient-to-l from-red-950/30 to-transparent'}
    `}>
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${active ? 'opacity-100' : 'opacity-0'} ${isBlue ? 'bg-gradient-to-r from-blue-600/20 to-transparent' : 'bg-gradient-to-l from-red-600/20 to-transparent'}`}></div>

      <div className={`py-3 text-center font-black tracking-widest text-lg shadow-lg z-10 transition-colors ${active ? (isBlue ? 'text-blue-300' : 'text-red-300') : (isBlue ? 'text-blue-700' : 'text-red-700')} ${isBlue ? 'bg-blue-950/80' : 'bg-red-950/80'}`}>
        {isBlue ? 'BLUE' : 'RED'}
      </div>

      {/* Ban 区 */}
      <div className="flex flex-wrap justify-center gap-1.5 p-2 bg-black/20 border-y border-white/5">
        {displayBans.map((heroId, i) => {
          const hero = heroId ? heroes.find(h => h.id === heroId) : null;
          return (
            <div key={i} className="relative w-8 h-8 rounded border border-slate-700 bg-slate-900 overflow-hidden shadow-inner">
               {hero ? (
                 // ↓↓↓ Ban位的图片修复 ↓↓↓
                 <img src={getAvatar(hero)} className="w-full h-full object-cover grayscale opacity-60" /> 
                 // ↑↑↑ Ban位的图片修复 ↑↑↑
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-700 select-none font-mono">X</div>
               )}
            </div>
          )
        })}
      </div>

      {/* Pick 区 */}
      <div className="flex-1 flex flex-col p-2 gap-2 overflow-y-auto no-scrollbar">
        {displayPicks.map((heroId, index) => {
          const hero = heroId ? heroes.find(h => h.id === heroId) : null;
          const isCurrentSlot = !hero && active && (state.picks.length === index);
          
          return (
            <div key={index} className={`flex-1 relative rounded-lg border overflow-hidden flex items-center justify-center transition-all duration-300 ${hero ? 'border-slate-600 bg-slate-800' : isCurrentSlot ? `border-transparent ring-2 ring-offset-2 ring-offset-[#0A101A] ${isBlue ? 'ring-blue-500' : 'ring-red-500'} bg-slate-800 animate-pulse` : 'border-white/5 bg-slate-800/30'}`}>
              {hero ? (
                <>
                   {/* ↓↓↓ Pick位的图片修复 ↓↓↓ */}
                   <img src={getAvatar(hero)} className="absolute inset-0 w-full h-full object-cover" />
                   {/* ↑↑↑ Pick位的图片修复 ↑↑↑ */}
                   
                   <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-2">
                     <span className="text-sm font-bold text-white tracking-wide shadow-black drop-shadow-md">{hero.name}</span>
                   </div>
                   <div className={`absolute top-0 bottom-0 w-1 ${isBlue ? 'left-0 bg-blue-500' : 'right-0 bg-red-500'}`}></div>
                </>
              ) : (
                <div className="text-xs font-mono opacity-30">{index + 1}L</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}