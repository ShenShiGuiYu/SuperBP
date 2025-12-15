import React from 'react';

// 这个组件接收一个 onSetupComplete 回调，把用户选择的局数传回去
export default function GlobalBPSetup({ onSetupComplete }) {
  return (
    <div className="w-screen h-screen bg-[#0A101A] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-black mb-4 tracking-wider">全局BP模式 (Fearless Draft)</h1>
      <p className="text-slate-400 mb-12">请选择对局模式</p>
      
      <div className="flex gap-8">
        <button 
          onClick={() => onSetupComplete(3)}
          className="w-48 h-64 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-300 border border-slate-700 hover:border-purple-500 hover:text-white hover:-translate-y-2 transition-all duration-300"
        >
          <span className="text-6xl font-black">BO3</span>
          <span className="text-sm mt-2">三局两胜</span>
        </button>
        <button 
          onClick={() => onSetupComplete(5)}
          className="w-48 h-64 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-300 border border-slate-700 hover:border-purple-500 hover:text-white hover:-translate-y-2 transition-all duration-300"
        >
          <span className="text-6xl font-black">BO5</span>
          <span className="text-sm mt-2">五局三胜</span>
        </button>
        <button 
          onClick={() => onSetupComplete(7)}
          className="w-48 h-64 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-300 border border-slate-700 hover:border-purple-500 hover:text-white hover:-translate-y-2 transition-all duration-300"
        >
          <span className="text-6xl font-black">BO7</span>
          <span className="text-sm mt-2">七局四胜 (含巅峰对决)</span>
        </button>
      </div>
    </div>
  );
}