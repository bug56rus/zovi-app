  return (
    <main className={`min-h-[100dvh] flex flex-col items-center justify-center p-4 font-sans ${theme.bg}`}>
      
      {/* КАРТОЧКА ОТКРЫТКИ (Строго 3:4, влезает целиком) */}
      <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-black/10">
        
        {event.coverImage && (
          <img src={event.coverImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        )}

        <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} opacity-80 pointer-events-none`}></div>

        {/* Текст на открытке */}
        <div 
          className="absolute flex flex-col w-[85%]"
          style={{ 
            left: `${event.textX ?? 50}%`, 
            top: `${event.textY ?? 50}%`, 
            transform: 'translate(-50%, -50%)',
            fontFamily: currentFont 
          }}
        >
          <h1 
            className="text-4xl font-bold mb-2 tracking-tight drop-shadow-lg text-center leading-tight"
            style={{ color: event.textColor || '#ffffff' }}
          >
            {event.title}
          </h1>
          
          <div 
            className="space-y-1 text-sm font-medium drop-shadow-md text-center"
            style={{ color: event.textColor || '#ffffff', opacity: 0.95 }}
          >
            <p>📅 {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
            {event.location && <p>📍 {event.location}</p>}
            {event.description && <p className="mt-2 text-xs opacity-90">{event.description}</p>}
          </div>
        </div>
      </div>

      {/* КНОПКИ И СПИСОК ГОСТЕЙ (Снизу под открыткой) */}
      <div className={`w-full max-w-md mt-6 rounded-3xl backdrop-blur-xl shadow-xl p-6 flex flex-col gap-5 ${theme.sheet}`}>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center">Подтвердите участие</h3>
          <RsvpButtons inviteToken={cleanToken} currentStatus={data.currentGuestStatus} templateId={event.templateId} />
        </div>

        {event.showGuests && (
          <div className="mt-1">
            <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wider text-center ${theme.textMuted}`}>
              Уже ответили ({guests.length}):
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {guests.map((g: any, i: number) => (
                <div key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium border border-black/5 bg-black/5 flex items-center gap-1`}>
                  <span>{g.status === 'going' ? '✅' : g.status === 'maybe' ? '🤔' : '❌'}</span>
                  <span>Гость {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );