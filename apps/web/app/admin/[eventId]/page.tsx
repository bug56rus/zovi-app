                {/* МИНИ-ПРЕДПРОСМОТР В ДАШБОРДЕ */}
                <div 
                  onClick={() => { playClick(); setIsPreviewOpen(true); }}
                  style={{ containerType: 'inline-size' }} // 👈 ВКЛЮЧАЕМ КОНТЕЙНЕРНЫЕ ЗАПРОСЫ
                  className="relative w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group shadow-xl border border-black/10 transition-transform hover:scale-[1.02] mb-4"
                >
                  {event.coverImage && (
                    <img src={event.coverImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} opacity-80`}></div>
                  
                  <div 
                    className="absolute flex flex-col w-[85%]"
                    style={{ 
                      left: `${event.textX || 50}%`, 
                      top: `${event.textY || 50}%`, 
                      transform: 'translate(-50%, -50%)',
                      fontFamily: currentFont 
                    }}
                  >
                    {/* 👇 ШРИФТЫ В cqw */}
                    <h1 
                      className="text-[8cqw] font-bold mb-[1cqw] drop-shadow-md text-center leading-tight line-clamp-3"
                      style={{ color: event.textColor || '#ffffff' }}
                    >
                      {event.title}
                    </h1>
                    <p 
                      className="text-[3.5cqw] text-center opacity-90 drop-shadow-sm"
                      style={{ color: event.textColor || '#ffffff' }}
                    >
                      📅 {new Date(event.dateTime).toLocaleString('ru-RU')}
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium text-xs bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      🔍 Открыть
                    </span>
                  </div>
                </div>