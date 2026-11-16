'use client';

import { useRef, useState } from 'react';

const fontMap: Record<string, string> = {
  'Montserrat': 'var(--font-montserrat)',
  'Playfair Display': 'var(--font-playfair)',
  'Great Vibes': 'var(--font-great-vibes)',
  'Caveat': 'var(--font-caveat)',
  'Oswald': 'var(--font-oswald)',
  'Literata': 'var(--font-literata)',
  'Poiret One': 'var(--font-poiret)',
};

export default function PreviewCard({ 
  title, dateTime, location, description, 
  coverImage, textColor, fontFamily,
  textX = 50, textY = 50, onPositionChange
}: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const currentFont = fontMap[fontFamily] || fontMap['Montserrat'];

  const isDarkText = ['#000000', '#111827', '#312e81', '#3730a3'].includes(textColor?.toLowerCase());
  const overlayGradient = isDarkText 
    ? 'from-white/90 via-white/50 to-transparent' 
    : 'from-black/90 via-black/50 to-transparent';

  let displayDate = 'Дата не выбрана';
  if (dateTime) {
    try {
      displayDate = new Date(dateTime).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    } catch (e) {}
  }

  // 👇 ЛОГИКА ПЕРЕТАСКИВАНИЯ
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Переводим движение мышки/пальца в проценты (ограничиваем краями карточки 10-90%)
    let newX = (textX || 50) + (deltaX / rect.width) * 100;
    let newY = (textY || 50) + (deltaY / rect.height) * 100;
    
    newX = Math.max(10, Math.min(90, newX));
    newY = Math.max(10, Math.min(90, newY));

    onPositionChange(Math.round(newX), Math.round(newY));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full mb-6">
      <p className="text-sm opacity-60 mb-2 ml-2 flex items-center gap-2">
        <span>👆</span> Предпросмотр (текст можно двигать)
      </p>
      
      <div 
        ref={cardRef}
        className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-xl border border-black/10 select-none touch-none"
      >
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-gray-300 pointer-events-none" />
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} opacity-80 pointer-events-none`}></div>

        {/* ПЕРЕТАСКИВАЕМЫЙ БЛОК */}
        <div 
          className={`absolute flex flex-col cursor-grab active:cursor-grabbing w-[85%] ${isDragging ? 'scale-105' : ''} transition-transform duration-75`}
          style={{ 
            left: `${textX}%`, 
            top: `${textY}%`, 
            transform: 'translate(-50%, -50%)', // Центрируем текст под курсором
            fontFamily: currentFont,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <h1 
            className="text-3xl font-bold mb-1 drop-shadow-md leading-tight text-center"
            style={{ color: textColor || '#ffffff' }}
          >
            {title || 'Название события'}
          </h1>
          
          <div 
            className="space-y-1 text-sm font-medium drop-shadow-sm opacity-90 text-center"
            style={{ color: textColor || '#ffffff' }}
          >
            <p>📅 {displayDate}</p>
            {location && <p>📍 {location}</p>}
            {description && <p className="mt-1 text-xs opacity-80 line-clamp-2">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}