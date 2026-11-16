// apps/web/app/components/PreviewCard.tsx
'use client';

const fontMap: Record<string, string> = {
  'Montserrat': 'var(--font-montserrat)',
  'Playfair Display': 'var(--font-playfair)',
  'Great Vibes': 'var(--font-great-vibes)',
  'Caveat': 'var(--font-caveat)',
  'Oswald': 'var(--font-oswald)',
  'Literata': 'var(--font-literata)',
  'Poiret One': 'var(--font-poiret)',
};

const flexPositions: Record<string, string> = {
  'top-left': 'items-start justify-start text-left', 'top-center': 'items-start justify-center text-center', 'top-right': 'items-start justify-end text-right',
  'center-left': 'items-center justify-start text-left', 'center': 'items-center justify-center text-center', 'center-right': 'items-center justify-end text-right',
  'bottom-left': 'items-end justify-start text-left', 'bottom-center': 'items-end justify-center text-center', 'bottom-right': 'items-end justify-end text-right',
};

export default function PreviewCard({ 
  title, dateTime, location, description, 
  coverImage, coverPosition, textColor, fontFamily 
}: any) {
  const currentPos = flexPositions[coverPosition] || flexPositions['center'];
  const currentFont = fontMap[fontFamily] || fontMap['Montserrat'];

  const isDarkText = ['#000000', '#111827', '#312e81', '#3730a3'].includes(textColor?.toLowerCase());
  const overlayGradient = isDarkText 
    ? 'from-white/90 via-white/50 to-transparent' 
    : 'from-black/90 via-black/50 to-transparent';

  // Форматирование даты для превью
  let displayDate = 'Дата не выбрана';
  if (dateTime) {
    try {
      displayDate = new Date(dateTime).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    } catch (e) {}
  }

  return (
    <div className="w-full mb-6">
      <p className="text-sm opacity-60 mb-2 ml-2">Предпросмотр:</p>
      
      <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-xl border border-black/10">
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} opacity-80 pointer-events-none`}></div>

        <div 
          className={`absolute inset-0 p-6 flex flex-col ${currentPos}`}
          style={{ fontFamily: currentFont }}
        >
          <h1 
            className="text-3xl font-bold mb-2 drop-shadow-md leading-tight"
            style={{ color: textColor || '#ffffff' }}
          >
            {title || 'Название события'}
          </h1>
          
          <div 
            className="space-y-1 text-sm font-medium drop-shadow-sm opacity-90"
            style={{ color: textColor || '#ffffff' }}
          >
            <p>📅 {displayDate}</p>
            {location && <p>📍 {location}</p>}
            {description && <p className="mt-2 text-xs opacity-80 line-clamp-2">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}