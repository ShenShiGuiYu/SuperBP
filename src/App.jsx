// src/App.jsx
import { useState } from 'react';
import StartScreen from './StartScreen.jsx'; // StartScreen.jsx 是同级文件

// === 核心修正：明确告诉 Vite 文件的完整路径和后缀 ===
import PeakBP from './modes/PeakBP.jsx';
import GlobalBP from './modes/GlobalBP.jsx';
import CustomBP from './modes/CustomBP.jsx';

// App 组件现在是项目的总调度中心
function App() {
  // 1. 定义状态：currentMode 记录了用户当前选择了哪个模式
  // null 表示用户还在主菜单 (StartScreen)
  const [currentMode, setCurrentMode] = useState(null);

  // 2. 如果用户还没选模式，就显示主菜单
  if (!currentMode) {
    // onSelectMode 是一个回调函数，当用户在 StartScreen 点击按钮时
    // 它会把模式名 ('PEAK', 'GLOBAL', 'CUSTOM') 传回来，更新状态
    return <StartScreen onSelectMode={setCurrentMode} />;
  }

  // 3. 如果用户已经选择了模式，就根据模式名显示对应的组件
  // onBack 回调函数用于从具体模式返回主菜单
  switch (currentMode) {
    case 'PEAK':
      return <PeakBP onBack={() => setCurrentMode(null)} />;
    
    case 'GLOBAL':
      return <GlobalBP onBack={() => setCurrentMode(null)} />;
    
    case 'CUSTOM':
      return <CustomBP onBack={() => setCurrentMode(null)} />;
    
    // 默认情况，以防万一
    default:
      console.error("未知的模式:", currentMode);
      // 如果出错，也返回主菜单
      return <StartScreen onSelectMode={setCurrentMode} />;
  }
}

export default App;