/**
 * @file TeamPanel.jsx
 * @description 通用队伍面板组件 (终极版)
 */

import React from 'react';

export default function TeamPanel({ side, state, heroes, active, isBanPhase, banCount = 5 }) {
  const isBlue = side === 'blue';
  
  const getAvatar = (hero) => `/heroes/${hero.pinyin}.jpg`;

  const displayBans = [...state.bans, ...Array(banCount - state.bans.length).fill(null)].slice(0, banCount);
  const displayPicks = [...state.picks, ...Array(5 - state.picks.length).fill(null)].slice(0, 5);

  return (
    <div className={`
      w-24 md:w-36 flex flex-col shrink-0 relative
      ${isBlue ? 'bg-gradient-to-r from-slate-900/50 to-transparent' : 'bg-gradient-to-l from-slate-900/50 to-transparent'}
    `}>
      <div className={`py-3 text-center font-black tracking-widest text-lg z-10 ${isBlue ? 'text-blue-400' : 'text-red-400'} bg-black/30`}>
        {isBlue ? 'BLUE' : 'RED'}
      </div>

      {/* === Ban 禁用区 === */}
      <div className="flex flex-wrap justify-center gap-1.5 p-2 bg-black/20 border-y border-white/5">
        {displayBans.map((heroId, i) => {
          const hero = heroId ? heroes.find(h => h.id === heroId) : null;
          const isCurrentBanSlot = active && isBanPhase && (state.bans.length === i);

          return (
            <div key={`ban-${i}`} className={`
              relative w-8 h-8 rounded-full border transition-all duration-300 overflow-hidden shadow-inner flex items-center justify-center
              ${isCurrentBanSlot 
                ? `border-transparent ring-2 ring-offset-1 ring-offset-[#0A101A] ${isBlue ? 'ring-blue-500' : 'ring-red-500'} animate-pulse bg-slate-800` 
                : 'border-slate-800 bg-slate-950/50'
              }
            `}>
               {hero ? (
                 <>
                   <img src={getAvatar(hero)} className="w-full h-full object-cover grayscale opacity-60" />
                   <div className="absolute inset-0 bg-black/40"></div>
                 </>
               ) : (
                 <span className={`text-xs font-mono transition-colors ${isCurrentBanSlot ? 'text-white' : 'text-slate-700'}`}>X</span>
               )}
            </div>
          )
        })}
      </div>

      {/* === Pick 选择区 === */}
      <div className="flex-1 flex flex-col p-2 gap-2 overflow-y-auto no-scrollbar">
        {displayPicks.map((heroId, index) => {
          const hero = heroId ? heroes.find(h => h.id === heroId) : null;
          // 🔥 最终高亮逻辑
          const isCurrentPickSlot = active && !isBanPhase && (state.picks.length === index);
          
          return (
            <div key={`pick-${index}`} className={`
              flex-1 relative rounded-lg border overflow-hidden flex items-center justify-center transition-all duration-500
              ${hero 
                ? 'border-slate-600 bg-slate-800' 
                : isCurrentPickSlot 
                  ? `border-transparent ring-2 ring-offset-2 ring-offset-[#0A101A] ${isBlue ? 'ring-blue-500' : 'ring-red-500'} bg-slate-800 animate-pulse` 
                  : 'border-white/5 bg-slate-800/20'
              }
            `}>
              {hero ? (
                <>
                   <img src={getAvatar(hero)} className="absolute inset-0 w-full h-full object-cover" />
                   <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-center pb-2">
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