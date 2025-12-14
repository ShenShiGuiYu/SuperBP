import { useState, useMemo } from 'react';
import { heroes } from './heroes';

// === 1. 剧本定义 ===
// 巅峰赛/全局BP通用流程：先各Ban 5个 -> 然后按顺序选
const STEPS = [
  // Ban 阶段 (0-9)
  { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' }, { phase: 'BAN', side: 'blue' },
  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },  { phase: 'BAN', side: 'red' },
  
  // Pick 阶段 (10-19)
  { phase: 'PICK', side: 'blue' }, // 蓝1
  { phase: 'PICK', side: 'red' },  { phase: 'PICK', side: 'red' }, // 红2
  { phase: 'PICK', side: 'blue' }, { phase: 'PICK', side: 'blue' }, // 蓝2
  { phase: 'PICK', side: 'red' },  { phase: 'PICK', side: 'red' }, // 红2
  { phase: 'PICK', side: 'blue' }, { phase: 'PICK', side: 'blue' }, // 蓝2
  { phase: 'PICK', side: 'red' },  // 红1
];

// 分路配置
const TABS = [
  { key: 'ALL', label: '全部' },
  { key: 'clash', label: '对抗' },
  { key: 'jungle', label: '打野' },
  { key: 'mid', label: '中路' },
  { key: 'farm', label: '发育' },
  { key: 'roam', label: '游走' },
];

export default function BPBoard({ mode, onBack }) {
  // === 状态管理 ===
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  
  // 当前局状态
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [blueState, setBlueState] = useState({ bans: [], picks: [] });
  const [redState, setRedState] = useState({ bans: [], picks: [] });
  const [tempHero, setTempHero] = useState(null);

  // 🔥 全局BP新增：历史记录 & 局数
  const [round, setRound] = useState(1); // 第几局
  const [globalHistory, setGlobalHistory] = useState({ blue: [], red: [] }); // 记录双方用过的英雄ID

  // 计算当前信息
  const currentStep = STEPS[currentStepIndex];
  const isFinished = currentStepIndex >= STEPS.length;
  const isBanPhase = currentStep?.phase === 'BAN';
  const isGlobalMode = mode === 'GLOBAL'; // 是否开启全局BP逻辑

  const getAvatar = (hero) => `/heroes/${hero.pinyin}.jpg`;

  // 筛选英雄
  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero => {
      const matchSearch = hero.name.includes(searchTerm) || hero.pinyin.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTab = activeTab === 'ALL' || hero.positions.includes(activeTab);
      return matchSearch && matchTab;
    });
  }, [searchTerm, activeTab]);

  // === 🔥 核心逻辑：判断英雄是否可用 ===
  const getHeroStatus = (heroId) => {
    // 1. 本局是否已被占用 (Ban或Pick)
    const currentUsed = [...blueState.bans, ...blueState.picks, ...redState.bans, ...redState.picks];
    if (currentUsed.includes(heroId)) return 'USED_CURRENT';

    // 2. 全局BP逻辑：检查历史记录
    if (isGlobalMode && !isFinished) {
      // 只有在 Pick 阶段才限制 (Ban阶段可以Ban用过的)
      if (!isBanPhase) {
        const side = currentStep.side;
        // 如果我是蓝方，且蓝方历史里有用过这个英雄 -> 不可用
        if (side === 'blue' && globalHistory.blue.includes(heroId)) return 'USED_GLOBAL_BLUE';
        // 如果我是红方，且红方历史里有用过 -> 不可用
        if (side === 'red' && globalHistory.red.includes(heroId)) return 'USED_GLOBAL_RED';
      }
    }

    return 'AVAILABLE';
  };

  // === 执行锁定 ===
  const executeLock = (heroToLock) => {
    if (!heroToLock || isFinished) return;

    const isBlue = currentStep.side === 'blue';
    const targetListKey = isBanPhase ? 'bans' : 'picks';

    // 更新本局状态
    const updateTeam = isBlue ? setBlueState : setRedState;
    updateTeam(prev => ({
      ...prev,
      [targetListKey]: [...prev[targetListKey], heroToLock.id]
    }));

    setTempHero(null);
    setCurrentStepIndex(prev => prev + 1);
  };

  // === 🔥 下一局逻辑 ===
  const handleNextGame = () => {
    // 1. 把本局阵容加入历史记录
    setGlobalHistory(prev => ({
      blue: [...prev.blue, ...blueState.picks],
      red:  [...prev.red,  ...redState.picks]
    }));

    // 2. 清空本局状态
    setBlueState({ bans: [], picks: [] });
    setRedState({ bans: [], picks: [] });
    setCurrentStepIndex(0);
    setTempHero(null);

    // 3. 局数+1
    setRound(prev => prev + 1);
  };

  // 点击事件
  const handleHeroClick = (hero) => {
    const status = getHeroStatus(hero.id);
    if (isFinished || status !== 'AVAILABLE') return;
    setTempHero(hero);
  };

  const handleHeroDoubleClick = (hero) => {
    const status = getHeroStatus(hero.id);
    if (isFinished || status !== 'AVAILABLE') return;
    executeLock(hero);
  };

  return (
    <div className="w-screen h-screen bg-[#0f172a] text-slate-200 flex flex-col overflow-hidden font-sans select-none">
      
      {/* 顶部栏 */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 relative">
        <div className="flex items-center gap-4 z-10">
          <button onClick={onBack} className="text-slate-400 hover:text-white font-bold">⬅ 退出</button>
          
          {/* 局数显示 */}
          {isGlobalMode && (
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded border border-slate-700">
              <span className="text-yellow-500 font-black">BO5</span>
              <span className="text-white text-sm">第 <span className="text-xl font-bold">{round}</span> 局</span>
            </div>
          )}
        </div>
        
        {/* 中央状态 */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-0">
          {isFinished ? (
             <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-black text-green-400">本局结束</span>
                {/* 下一局按钮 */}
                {isGlobalMode && (
                  <button 
                    onClick={handleNextGame}
                    className="px-6 py-1 bg-green-600 hover:bg-green-500 text-white rounded-full text-sm font-bold shadow-lg animate-bounce"
                  >
                    保存并进入第 {round + 1} 局 →
                  </button>
                )}
             </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                {isGlobalMode ? 'FEARLESS DRAFT' : 'PEAK TOURNAMENT'}
              </span>
              <div className={`
                px-8 py-1 rounded text-2xl font-black shadow-lg transform -skew-x-12
                ${currentStep.side === 'blue' ? 'bg-blue-600' : 'bg-red-600'}
              `}>
                <span className="inline-block skew-x-12">
                  {currentStep.side === 'blue' ? '蓝方' : '红方'} 
                  {isBanPhase ? ' 禁用' : ' 选择'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 锁定按钮 */}
        <div className="z-10 w-32 flex justify-end">
          <button 
            onClick={() => executeLock(tempHero)}
            disabled={!tempHero || isFinished}
            className={`px-6 py-2 rounded font-bold transition-all ${!tempHero || isFinished ? 'bg-slate-800 text-slate-600' : 'bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-105'}`}
          >
            锁定
          </button>
        </div>
      </header>

      {/* 主区域 */}
      <main className="flex-1 flex overflow-hidden">
        <TeamPanel side="blue" state={blueState} heroes={heroes} getAvatar={getAvatar} active={currentStep?.side === 'blue'} />

        <div className="flex-1 bg-slate-900 flex flex-col border-x border-slate-800 relative z-10">
          {/* 筛选 */}
          <div className="p-4 bg-slate-900/95 backdrop-blur z-20 sticky top-0 border-b border-slate-800">
             <input type="text" placeholder="搜索..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full bg-slate-800 text-white rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"/>
             <div className="flex gap-2 justify-center flex-wrap">
               {TABS.map(tab => (
                 <button key={tab.key} onClick={()=>setActiveTab(tab.key)} className={`px-3 py-1 rounded text-xs font-bold transition-all ${activeTab===tab.key ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>
                   {tab.label}
                 </button>
               ))}
             </div>
          </div>

          {/* 英雄列表 */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 pb-10">
              {filteredHeroes.map(hero => {
                const status = getHeroStatus(hero.id);
                const isTemp = tempHero?.id === hero.id;
                
                // 状态样式映射
                let cardStyle = 'cursor-pointer hover:shadow-lg hover:z-10 border-slate-700';
                let overlay = null;

                if (status === 'USED_CURRENT') {
                   cardStyle = 'border-slate-800 grayscale opacity-20 cursor-not-allowed';
                } else if (status === 'USED_GLOBAL_BLUE') {
                   // 蓝方用过了
                   cardStyle = 'border-blue-900 opacity-40 cursor-not-allowed';
                   overlay = <div className="absolute inset-0 flex items-center justify-center bg-blue-900/40 text-[10px] font-bold text-blue-200">蓝方已用</div>;
                } else if (status === 'USED_GLOBAL_RED') {
                   // 红方用过了
                   cardStyle = 'border-red-900 opacity-40 cursor-not-allowed';
                   overlay = <div className="absolute inset-0 flex items-center justify-center bg-red-900/40 text-[10px] font-bold text-red-200">红方已用</div>;
                } else if (isTemp) {
                   cardStyle = 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105 z-10 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
                }

                return (
                  <div 
                    key={hero.id}
                    onClick={() => handleHeroClick(hero)}
                    onDoubleClick={() => handleHeroDoubleClick(hero)}
                    className={`relative aspect-square rounded-lg overflow-hidden border transition-all duration-150 group ${cardStyle}`}
                  >
                    <img src={getAvatar(hero)} className="w-full h-full object-cover" loading="lazy" />
                    
                    {/* 名字 */}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent pt-4 pb-1">
                      <p className="text-[10px] text-center text-slate-200 font-medium truncate px-1">{hero.name}</p>
                    </div>

                    {/* 状态蒙层 (全局BP已用提示) */}
                    {overlay}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <TeamPanel side="red" state={redState} heroes={heroes} getAvatar={getAvatar} active={currentStep?.side === 'red'} />
      </main>
    </div>
  );
}

// === 侧边面板 (保持不变) ===
function TeamPanel({ side, state, heroes, getAvatar, active }) {
  const isBlue = side === 'blue';
  const displayBans = [...state.bans, ...Array(5 - state.bans.length).fill(null)].slice(0, 5);
  const displayPicks = [...state.picks, ...Array(5 - state.picks.length).fill(null)].slice(0, 5);

  return (
    <div className={`w-24 md:w-36 flex flex-col transition-colors duration-500 ${isBlue ? 'bg-gradient-to-r from-blue-900/20 to-transparent' : 'bg-gradient-to-l from-red-900/20 to-transparent'} ${active ? (isBlue ? 'border-r-2 border-blue-500/30' : 'border-l-2 border-red-500/30') : ''}`}>
      <div className={`py-3 text-center font-black tracking-widest text-lg shadow-lg z-10 ${isBlue ? 'text-blue-400 bg-blue-950/80' : 'text-red-400 bg-red-950/80'}`}>{isBlue ? 'BLUE' : 'RED'}</div>
      
      {/* Bans */}
      <div className="flex flex-wrap justify-center gap-1.5 p-2 bg-black/20 border-b border-white/5">
        {displayBans.map((heroId, i) => {
          const hero = heroId ? heroes.find(h => h.id === heroId) : null;
          return (
            <div key={i} className="relative w-8 h-8 rounded border border-slate-700 bg-slate-900 overflow-hidden shadow-inner">
               {hero ? <><img src={getAvatar(hero)} className="w-full h-full object-cover grayscale opacity-60" /><div className="absolute inset-0 flex items-center justify-center"><svg className="w-6 h-6 text-red-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></div></> : <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-700 font-mono">BAN</div>}
            </div>
          )
        })}
      </div>

      {/* Picks */}
      <div className="flex-1 flex flex-col p-2 gap-2 overflow-y-auto no-scrollbar">
        {displayPicks.map((heroId, index) => {
          const hero = heroId ? heroes.find(h => h.id === heroId) : null;
          const isCurrentSlot = !hero && active && (state.picks.length === index);
          return (
            <div key={index} className={`flex-1 relative rounded-lg border overflow-hidden flex items-center justify-center transition-all duration-300 ${hero ? 'border-slate-600 bg-slate-800' : isCurrentSlot ? `border-${isBlue?'blue':'red'}-500/50 bg-${isBlue?'blue':'red'}-500/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]` : 'border-white/5 bg-slate-800/30'}`}>
              {hero ? <><img src={getAvatar(hero)} className="absolute inset-0 w-full h-full object-cover" /><div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-2"><span className="text-sm font-bold text-white tracking-wide shadow-black drop-shadow-md">{hero.name}</span></div><div className={`absolute top-0 bottom-0 w-1 ${isBlue ? 'left-0 bg-blue-500' : 'right-0 bg-red-500'}`}></div></> : <div className="flex flex-col items-center opacity-30"><span className="text-xs font-mono">{index + 1}L</span>{isCurrentSlot && <span className="text-[10px] animate-pulse font-bold text-white">Pick</span>}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}