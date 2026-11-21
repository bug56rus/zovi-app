// apps/web/app/components/CoverPicker.tsx
'use client';

import { useState } from 'react';
import { COVER_CATEGORIES, getCategoryCovers } from '../config/covers';
import { playClick } from '../utils/sound';

export default function CoverPicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (url: string) => void; 
}) {
  const [activeCategory, setActiveCategory] = useState(COVER_CATEGORIES[0].id);
  
  const currentCovers = getCategoryCovers(activeCategory);

  return (
    <div className="bg-black/5 p-4 rounded-xl border border-black/10">
      <label className="text-sm opacity-70 mb-3 block">Выберите обложку</label>
      
      {/* Табы категорий */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {COVER_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => { playClick(); setActiveCategory(cat.id); }}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'bg-white/40 hover:bg-white/60 text-gray-700'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Сетка картинок активной категории */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {currentCovers.map(url => (
          <img 
            key={url} 
            src={url} 
            alt={url} 
            onClick={() => { playClick(); onChange(url); }}
            className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-2 transition-all flex-shrink-0 ${
              value === url 
                ? 'border-indigo-500 scale-105 shadow-md' 
                : 'border-transparent opacity-60 hover:opacity-100'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}