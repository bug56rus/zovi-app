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
  
  const currentFont = fontMap[fontFamily] || fontMap['Great Vibes'];

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

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    let newX = (textX || 50) + (e.movementX / rect.width) * 100;
    let newY = (textY || 50) + (e.movementY / rect.height) * 100;
    newX = Math.max(10, Math.min(90, newX));
    newY = Math.max(10, Math.min(90, newY));
    onPositionChange(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full mb-6">
      <p className="text-sm opacity-80 font-medium mb-2 ml-2 flex items-center gap-2">
        <span>👆</span> Потяните текст, чтобы переместить его
      </p>
      
      <div 
        ref={cardRef}
        style={{ containerType: 'inline-size' }}
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-black/10 select-none touch-none bg-gray-100"
      >
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-gray-300 pointer-events-none" />
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} opacity-80 pointer-events-none`}></div>

        <div 
          className={`
            absolute flex flex-col cursor-grab active:cursor-grabbing w-[85%] p-[3cqw] rounded-xl
            border-2 border-dashed transition-all duration-75
            ${isDragging 
              ? 'border-indigo-400 bg-black/10 scale-105 shadow-2xl z-20' 
              : 'border-white/40 hover:border-white/80 hover:bg-black/5 z-10'}
          `}
          style={{ 
            left: `${textX}%`, 
            top: `${textY}%`, 
            transform: 'translate(-50%, -50%)',
            fontFamily: currentFont,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="absolute -top-[4cqw] -right-[4cqw] bg-indigo-500 text-white rounded-full w-[8cqw] h-[8cqw] flex items-center justify-center shadow-lg pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[4cqw] h-[4cqw]">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
            </svg>
          </div>

          <h1 
            className="text-[8cqw] font-bold mb-[1.5cqw] drop-shadow-md leading-tight text-center pointer-events-none"
            style={{ color: textColor || '#ffffff' }}
          >
            {title || 'Название'}
          </h1>
          
          {/* Убран 📅 */}
          <div 
            className="space-y-[1.5cqw] text-[7cqw] font-medium drop-shadow-sm opacity-90 text-center pointer-events-none"
            style={{ color: textColor || '#ffffff' }}
          >
            <p>{displayDate}</p>
            {location && <p>📍 {location}</p>}
            {description && <p className="mt-[1.5cqw] text-[6cqw] opacity-80 leading-tight">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}