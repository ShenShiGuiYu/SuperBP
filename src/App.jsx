import { useState } from 'react';
import StartScreen from './StartScreen';
import PeakBP from './modes/PeakBP.jsx';
import GlobalBP from './modes/GlobalBP.jsx';
import GlobalBPSetup from './modes/GlobalBPSetup.jsx'; // 引入新组件
import CustomBP from './modes/CustomBP.jsx';

function App() {
  const [currentMode, setCurrentMode] = useState(null);
  const [globalBPRounds, setGlobalBPRounds] = useState(0); // 记录BO几

  // 返回主菜单的函数
  const goHome = () => {
    setCurrentMode(null);
    setGlobalBPRounds(0); // 重置BO局数
  };

  // 如果没有选模式，显示主菜单
  if (!currentMode) {
    return <StartScreen onSelectMode={setCurrentMode} />;
  }

  // 🔥 全局BP的特殊调度逻辑
  if (currentMode === 'GLOBAL') {
    // 如果还没设置BO几，就先显示设置页面
    if (globalBPRounds === 0) {
      return <GlobalBPSetup onSetupComplete={setGlobalBPRounds} />;
    }
    // 如果设置好了，就显示BP界面，并把总局数传进去
    return <GlobalBP onBack={goHome} totalRounds={globalBPRounds} />;
  }

  // 其他模式的渲染
  switch (currentMode) {
    case 'PEAK':
      return <PeakBP onBack={goHome} />;
    case 'CUSTOM':
      return <CustomBP onBack={goHome} />;
    default:
      return <StartScreen onSelectMode={setCurrentMode} />;
  }
}

export default App;