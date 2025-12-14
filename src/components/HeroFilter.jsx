import { useState, useMemo, useEffect } from 'react';
import { heroes } from '../heroes';
import { TABS, TAGS } from '../data/tagConfig';

// 这个组件接收一个 onFilterChange 回调，把筛选结果传回给父组件
export default function HeroFilter({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeTags, setActiveTags] = useState([]); // 存储选中的根系分标签

  // 当任何筛选条件变化时，重新计算结果
  useEffect(() => {
    const filtered = heroes.filter(hero => {
      // 1. 分路过滤
      const matchTab = activeTab === 'ALL' || hero.positions.includes(activeTab);
      // 2. 搜索过滤
      const matchSearch = hero.name.includes(searchTerm) || hero.pinyin.toLowerCase().includes(searchTerm.toLowerCase());
      // 3. 根系分标签过滤 (核心：英雄必须包含所有选中的标签)
      const matchTags = activeTags.every(tag => hero.tags.includes(tag));
      
      return matchTab && matchSearch && matchTags;
    });
    // 通过回调，把结果告诉父组件 (PeakBP, GlobalBP...)
    onFilterChange(filtered);
  }, [searchTerm, activeTab, activeTags, onFilterChange]);

  // 点击根系分标签
  const handleTagClick = (tagKey) => {
    setActiveTags(prev => 
      prev.includes(tagKey) 
        ? prev.filter(t => t !== tagKey) // 如果已选中，则取消
        : [...prev, tagKey]                // 如果未选中，则添加
    );
  };

  return (
    <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-col gap-3">
      {/* 搜索框 */}
      <input 
        type="text" 
        placeholder="搜索英雄 (支持拼音)..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
        className="w-full bg-slate-800 text-white rounded px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-600"
      />
      
      {/* 分路筛选 */}
      <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 根系分筛选 */}
      <div className="flex justify-center gap-1 sm:gap-2 flex-wrap border-t border-slate-800 pt-3">
        {Object.entries(TAGS).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => handleTagClick(key)}
            className={`
              px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border transition-all
              ${activeTags.includes(key)
                ? `bg-${color}-500 border-${color}-400 text-white shadow-lg` 
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}