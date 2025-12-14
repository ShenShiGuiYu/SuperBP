import { useState, useMemo } from 'react';
import { heroes } from '../heroes';
import TeamPanel from '../components/TeamPanel';

// ... (剧本STEPS保持不变)

const INITIAL_STATE = { bans: [], picks: [] };

export default function GlobalBP({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [blueState, setBlueState] = useState(INITIAL_STATE);
  const [redState, setRedState] = useState(INITIAL_STATE);
  const [tempHero, setTempHero] = useState(null);
  
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState({ blue: [], red: [] });

  const currentStep = STEPS[currentStepIndex]; // 使用通用剧本
  const isFinished = currentStepIndex >= STEPS.length;
  const isBanPhase = currentStep?.phase === 'BAN';

  // ... (getHeroStatus, executeLock 等逻辑保持不变)

  const handleNextGame = () => {
    setHistory(prev => ({ blue: [...prev.blue, ...blueState.picks], red: [...prev.red, ...redState.picks] }));
    handleReset(true); // 调用重置并进入下一局
  };
  
  // 🔥 新增：重置函数
  const handleReset = (isNextGame = false) => {
    setCurrentStepIndex(0);
    setBlueState(INITIAL_STATE);
    setRedState(INITIAL_STATE);
    setTempHero(null);
    if (!isNextGame) {
      setRound(1);
      setHistory({ blue: [], red: [] });
    } else {
      setRound(r => r + 1);
    }
  };

  // ... (返回的 JSX 和 PeakBP 类似，只是顶部UI不同)
  // 为了简洁，这里只提供核心逻辑。UI部分你可以参考PeakBP进行修改或保持原样。
  // 主要就是把 handleReset 绑定到一个新的“重置”按钮上。
}