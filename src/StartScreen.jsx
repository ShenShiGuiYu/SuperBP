// src/StartScreen.jsx
export default function StartScreen({ onSelectMode }) {
  return (
    <div className="w-screen h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 背景光效 */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>

      {/* 标题 */}
      <h1 className="text-5xl font-black mb-12 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 z-10 select-none">
        王者BP助手
      </h1>

      {/* 菜单容器：改成了 flex-col (竖排)，宽度限制为 w-96 */}
      <div className="flex flex-col gap-6 z-10 w-96">
        
        <MenuButton 
          title="🏆 巅峰赛模式" 
          sub="标准排位 / 巅峰赛规则"
          color="hover:shadow-blue-500/50 hover:border-blue-500"
          onClick={() => onSelectMode('PEAK')} 
        />

        <MenuButton 
          title="🌍 全局BP模式" 
          sub="BO3 / BO5 赛事规则 (无重复英雄)"
          color="hover:shadow-purple-500/50 hover:border-purple-500"
          onClick={() => onSelectMode('GLOBAL')} 
        />

        <MenuButton 
          title="⚙️ 自定义模式" 
          sub="自由编辑 / 战术演练"
          color="hover:shadow-emerald-500/50 hover:border-emerald-500"
          onClick={() => onSelectMode('CUSTOM')} 
        />

      </div>
      
      <p className="absolute bottom-8 text-slate-600 text-xs">v1.0.0 Dev Build</p>
    </div>
  );
}

// 抽取出来的按钮组件
function MenuButton({ title, sub, color, onClick }) {
  return (
    <button 
      onClick={onClick}
      // 这里的样式让它看起来像个长条按钮
      className={`
        relative group w-full p-6 text-left 
        bg-slate-900/80 backdrop-blur-sm 
        border border-slate-700 rounded-xl
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:bg-slate-800
        ${color} hover:shadow-lg
      `}
    >
      <div className="flex flex-col">
        <span className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
          {title}
        </span>
        <span className="text-xs text-slate-500 group-hover:text-slate-400 mt-1">
          {sub}
        </span>
      </div>
      
      {/* 右侧的小箭头 */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
        →
      </div>
    </button>
  );
}