/**
 * @file StartScreen.jsx
 * @description 启动页/主菜单组件。
 *              通过 onSelectMode 回调函数，告诉 App.jsx 用户选择了哪个模式。
 */

import React from 'react';

// 小的UI组件，用于渲染每个菜单按钮
function MenuButton({ title, sub, icon, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`
        relative group w-full p-6 text-left 
        bg-slate-900/80 backdrop-blur-sm 
        border border-slate-700 rounded-xl
        transition-all duration-300 ease-in-out
        hover:-translate-y-1.5 hover:bg-slate-800
        hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/50
      `}
    >
      <div className="flex items-center">
        {/* 图标 */}
        <div className="text-xl mr-4">{icon}</div>
        
        {/* 文字 */}
        <div className="flex flex-col">
          <span className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
            {title}
          </span>
          <span className="text-xs text-slate-500 group-hover:text-slate-400 mt-1">
            {sub}
          </span>
        </div>
      </div>
      
      {/* 右侧的小箭头 */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 text-2xl font-thin">
        ›
      </div>
    </button>
  );
}

// 主组件
export default function StartScreen({ onSelectMode }) {
  return (
    <div className="w-screen h-screen bg-[#0A101A] text-white flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 背景光效 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>

      {/* 标题 */}
      <h1 className="text-5xl font-black mb-12 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 z-10 select-none">
        王者BP助手
      </h1>

      {/* 菜单容器 */}
      <div className="flex flex-col gap-6 z-10 w-96 max-w-[90%]">
        
        {/* 🔥 核心修复：给每个按钮都加上了 onClick 事件！ */}
        <MenuButton 
          title="巅峰赛模式" 
          sub="标准排位 / 盲Ban规则"
          icon="🏆"
          onClick={() => onSelectMode('PEAK')} 
        />

        <MenuButton 
          title="全局BP模式" 
          sub="BO3/BO5/BO7 赛事规则"
          icon="🌍"
          onClick={() => onSelectMode('GLOBAL')} 
        />

        <MenuButton 
          title="自定义模式" 
          sub="自由编辑 / 战术演练"
          icon="⚙️"
          onClick={() => onSelectMode('CUSTOM')} 
        />

      </div>
      
      <p className="absolute bottom-8 text-slate-700 text-xs font-mono">v1.0.0 Dev Build</p>
    </div>
  );
}